import crypto from 'crypto';
import razorpay from '../../config/razorpay.js';
import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

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

    if (!razorpay) {
      // Fallback response for dev/mock mode when Razorpay keys are not configured
      return sendSuccess(res, 200, {
        id: `rzp_mock_${Date.now()}`,
        currency: 'INR',
        amount: amountInPaise,
        orderId,
      }, 'Mock Razorpay order created');
    }

    const options = {
      amount: amountInPaise, // amount in paise derived strictly from server-computed order.total
      currency: 'INR',
      receipt: orderId,
    };

    const rzpOrder = await razorpay.orders.create(options);
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

    return sendSuccess(res, 200, { order: updatedOrder }, 'Payment verified successfully');
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return sendError(res, 500, error.message);
  }
};
