import crypto from 'crypto';
import razorpay from '../../config/razorpay.js';
import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { sendEmail } from '../../config/email.js';
import { getOrderConfirmationEmailTemplate } from '../../utils/emailTemplates.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return sendError(res, 400, 'orderId is required');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    const amountInPaise = Math.round(Number(order.total) * 100);

    // Idempotency check: if razorpayOrderId already exists for this order, return existing details
    if (order.razorpayOrderId) {
      return sendSuccess(
        res,
        200,
        {
          id: order.razorpayOrderId,
          currency: 'INR',
          amount: amountInPaise,
          orderId: order.id,
        },
        'Razorpay order retrieved (idempotent)'
      );
    }

    if (!razorpay) {
      // Fallback response for dev/mock mode when Razorpay keys are not configured
      const mockRzpId = `rzp_mock_${Date.now()}`;
      await prisma.order.update({
        where: { id: orderId },
        data: { razorpayOrderId: mockRzpId },
      });
      return sendSuccess(
        res,
        200,
        {
          id: mockRzpId,
          currency: 'INR',
          amount: amountInPaise,
          orderId,
        },
        'Mock Razorpay order created'
      );
    }

    const options = {
      amount: amountInPaise, // amount in paise derived strictly from server-computed order.total
      currency: 'INR',
      receipt: orderId,
    };

    const rzpOrder = await razorpay.orders.create(options);

    // Persist razorpayOrderId on the order for idempotency
    await prisma.order.update({
      where: { id: orderId },
      data: { razorpayOrderId: rzpOrder.id },
    });

    return sendSuccess(res, 200, rzpOrder, 'Razorpay order created');
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return sendError(res, 500, error.message);
  }
};

export const verifyPaymentSignature = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return sendError(res, 400, 'Missing Razorpay signature verification parameters');
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error('RAZORPAY_KEY_SECRET environment variable is missing');
    }
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return sendError(res, 400, 'Invalid Razorpay signature');
    }

    // Look up the actual order from DB
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return sendError(res, 400, 'Payment does not match this order');
    }

    const expectedAmountInPaise = Math.round(Number(order.total) * 100);
    const now = new Date().toISOString();
    const currentHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];

    // Defense-in-depth check: fetch actual Razorpay order details and confirm paid amount matches order's stored total
    if (razorpay) {
      try {
        const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
        const actualPaidPaise = Number(rzpOrder.amount);

        if (actualPaidPaise !== expectedAmountInPaise) {
          console.warn(
            `[SECURITY WARNING] Payment amount mismatch for order ${orderId}. Expected ${expectedAmountInPaise} paise, got ${actualPaidPaise} paise.`
          );

          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'Flagged for Review',
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              paymentMethod: 'Prepaid (Razorpay)',
              statusHistory: [
                ...currentHistory,
                { status: 'Flagged for Review', timestamp: now, reason: 'Payment amount mismatch' },
              ],
            },
          });

          return sendError(res, 400, 'Payment amount mismatch. Order flagged for manual review.');
        }
      } catch (fetchError) {
        console.error('Error fetching Razorpay order details:', fetchError);
        return sendError(res, 500, 'Failed to fetch Razorpay order details for amount verification.');
      }
    }

    // Update order status in DB to Processing
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'Processing',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentMethod: 'Prepaid (Razorpay)',
        statusHistory: [...currentHistory, { status: 'Processing', timestamp: now }],
      },
    });

    // Clear cart upon successful payment verification
    if (order.userId) {
      await prisma.cartItem.deleteMany({ where: { userId: order.userId } });
    }

    // Send order confirmation email (fire-and-forget)
    if (updatedOrder.customerEmail) {
      const { html, text } = getOrderConfirmationEmailTemplate({ order: updatedOrder });
      sendEmail({
        to: updatedOrder.customerEmail,
        subject: `Order Confirmation - ${updatedOrder.id} | SURANGHI NAAR`,
        html,
        text,
      }).catch((err) => console.error('Order confirmation email error:', err));
    }

    return sendSuccess(res, 200, { order: updatedOrder }, 'Payment verified successfully');
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return sendError(res, 500, error.message);
  }
};

export const handleRazorpayWebhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ RAZORPAY_WEBHOOK_SECRET is missing from environment variables');
    return sendError(res, 500, 'RAZORPAY_WEBHOOK_SECRET environment variable is missing');
  }

  if (!signature) {
    console.warn('⚠️ Razorpay webhook request missing x-razorpay-signature header');
    return sendError(res, 400, 'Missing x-razorpay-signature header');
  }

  // 1. Verify Webhook Signature using HMAC SHA256 against raw body Buffer
  let rawBody;
  let eventObj;
  try {
    rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : (req.rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)));
      
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('⚠️ Invalid Razorpay webhook signature');
      return sendError(res, 400, 'Invalid webhook signature');
    }

    eventObj = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString('utf8')) : req.body;
  } catch (sigErr) {
    console.error('Error verifying Razorpay webhook signature:', sigErr);
    return sendError(res, 400, 'Error verifying webhook signature');
  }

  // 2. Process Event (Always return 200 OK after signature verification passes)
  try {
    const event = eventObj?.event;

    if (event !== 'payment.captured') {
      console.log(`ℹ️ Razorpay webhook event '${event}' received and ignored.`);
      return res.status(200).json({ status: 'ok', message: `Event '${event}' ignored` });
    }

    const paymentEntity = eventObj?.payload?.payment?.entity;
    const razorpay_order_id = paymentEntity?.order_id;
    const razorpay_payment_id = paymentEntity?.id;
    const capturedAmountInPaise = Number(paymentEntity?.amount);

    if (!razorpay_order_id) {
      console.warn('⚠️ Webhook payment.captured event missing order_id');
      return res.status(200).json({ status: 'ok', message: 'Missing razorpay order_id' });
    }

    // 3. Find corresponding internal order by stored razorpayOrderId
    const order = await prisma.order.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!order) {
      console.warn(`⚠️ Webhook: Internal order not found for razorpayOrderId: ${razorpay_order_id}`);
      return res.status(200).json({ status: 'ok', message: 'Internal order not found' });
    }

    // 4. Idempotency Check: if order is already processed/paid, return 200 OK immediately
    if (order.status !== 'Pending') {
      console.log(`ℹ️ Webhook: Order ${order.id} is already processed (status: ${order.status}). Skipping.`);
      return res.status(200).json({ status: 'ok', message: 'Order already processed' });
    }

    const expectedAmountInPaise = Math.round(Number(order.total) * 100);
    const now = new Date().toISOString();
    const currentHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];

    // 5. Amount Cross-Check
    if (capturedAmountInPaise !== expectedAmountInPaise) {
      console.warn(
        `[SECURITY WARNING] Webhook: Payment amount mismatch for order ${order.id}. Expected ${expectedAmountInPaise} paise, got ${capturedAmountInPaise} paise.`
      );

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'Flagged for Review',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          paymentMethod: 'Prepaid (Razorpay)',
          statusHistory: [
            ...currentHistory,
            { status: 'Flagged for Review', timestamp: now, reason: 'Payment amount mismatch via webhook' },
          ],
        },
      });

      return res.status(200).json({ status: 'ok', message: 'Order flagged for review due to amount mismatch' });
    }

    // 6. Update Order Status to Processing
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'Processing',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentMethod: 'Prepaid (Razorpay)',
        statusHistory: [
          ...currentHistory,
          { status: 'Processing', timestamp: now, reason: 'Payment captured via webhook' },
        ],
      },
    });

    // Clear user cart upon successful payment confirmation
    if (order.userId) {
      await prisma.cartItem.deleteMany({ where: { userId: order.userId } }).catch((err) => {
        console.error('Error clearing cart on webhook:', err);
      });
    }

    // Send order confirmation email (fire-and-forget)
    if (updatedOrder.customerEmail) {
      const { html, text } = getOrderConfirmationEmailTemplate({ order: updatedOrder });
      sendEmail({
        to: updatedOrder.customerEmail,
        subject: `Order Confirmation - ${updatedOrder.id} | SURANGHI NAAR`,
        html,
        text,
      }).catch((err) => console.error('Webhook order confirmation email error:', err));
    }

    console.log(`✅ Webhook: Order ${order.id} marked as Processing after payment.captured event.`);
    return res.status(200).json({ status: 'ok', message: 'Order updated successfully via webhook' });
  } catch (error) {
    console.error('🔥 Razorpay Webhook Processing Error:', error);
    // Always return 200 OK to Razorpay once signature is verified, logging errors internally
    return res.status(200).json({ status: 'ok', message: 'Internal processing error logged' });
  }
};
