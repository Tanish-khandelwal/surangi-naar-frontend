import crypto from 'crypto';
import razorpay from '../../config/razorpay.js';
import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return sendError(res, 400, 'amount and orderId are required');
    }

    if (!razorpay) {
      // Fallback response for dev/mock mode when Razorpay keys are not configured
      return sendSuccess(res, 200, {
        id: `rzp_mock_${Date.now()}`,
        currency: 'INR',
        amount: Math.round(Number(amount) * 100),
        orderId,
      }, 'Mock Razorpay order created');
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise
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

    // Update order status in DB
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'Processing',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentMethod: 'Prepaid (Razorpay)',
      },
    });

    return sendSuccess(res, 200, { order: updatedOrder }, 'Payment verified successfully');
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return sendError(res, 500, error.message);
  }
};
