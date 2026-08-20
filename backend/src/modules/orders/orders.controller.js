import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { customerName, customerEmail, customerPhone, customerAddress, items, total, paymentMethod } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !items || !total) {
      return sendError(res, 400, 'Missing required order fields');
    }

    // Format: "ORD-XXXX" matching existing pattern
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `ORD-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        id,
        userId,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items,
        total: Number(total),
        status: 'Pending',
        paymentMethod: paymentMethod || 'Prepaid (UPI / Card)',
      },
    });

    // Optionally clear cart if logged in
    if (userId) {
      await prisma.cartItem.deleteMany({ where: { userId } });
    }

    return sendSuccess(res, 201, { order }, 'Order created successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 200, { orders }, 'Orders fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    return sendSuccess(res, 200, { order }, 'Order details fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
