import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      total,
      paymentMethod,
      discountCode,
      couponCode,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, 'Missing required order fields');
    }

    // 1. Compute real subtotal server-side by fetching Product prices from DB
    let calculatedSubtotal = 0;
    const processedItems = [];
    const soldOutItems = [];

    for (const item of items) {
      if (!item.id) {
        return sendError(res, 400, 'Invalid product item format');
      }

      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return sendError(res, 400, `Product with id ${item.id} not found`);
      }

      if (product.isSoldOut) {
        soldOutItems.push(product.name);
      }

      // Determine actual current price: use salePrice/price if product has active discount, otherwise regular price
      let itemPrice;
      if (product.salePrice !== undefined && product.salePrice !== null) {
        itemPrice = Number(product.salePrice);
      } else if (product.price !== undefined && product.price !== null) {
        itemPrice = Number(product.price);
      } else if (product.originalPrice !== undefined && product.originalPrice !== null) {
        itemPrice = Number(product.originalPrice);
      } else {
        itemPrice = Number(item.price) || 0;
      }

      const quantity = Math.max(1, Number(item.quantity) || 1);
      calculatedSubtotal += itemPrice * quantity;

      processedItems.push({
        ...item,
        price: itemPrice,
        quantity,
      });
    }

    if (soldOutItems.length > 0) {
      return sendError(
        res,
        400,
        `The following item(s) are sold out and unavailable for purchase: ${soldOutItems.join(', ')}`
      );
    }

    // 2. Server-side discount re-validation (reuse validateCoupon logic)
    let discountAmount = 0;
    const codeToValidate = (discountCode || couponCode || '').toString().trim().toUpperCase();

    if (codeToValidate) {
      const discount = await prisma.discountCode.findUnique({
        where: { code: codeToValidate },
      });

      if (discount && discount.isActive && calculatedSubtotal >= discount.minSpend) {
        discountAmount = Math.round((calculatedSubtotal * discount.discountPercent) / 100);
      }
    }

    // 3. Shipping Fee calculation
    const freeShippingThreshold = 5000;
    const shippingFee = calculatedSubtotal >= freeShippingThreshold ? 0 : 250;

    const serverComputedTotal = Math.max(0, Math.round(calculatedSubtotal - discountAmount + shippingFee));

    // 4. Warning check for client total discrepancy
    if (total !== undefined && total !== null && total !== '') {
      const clientTotal = Number(total);
      if (Math.abs(clientTotal - serverComputedTotal) > 1) {
        console.warn(
          `[SECURITY WARNING] Client-sent total (${clientTotal}) differs from server-computed total (${serverComputedTotal}). Order total set to server-computed amount.`
        );
      }
    }

    // Format: "ORD-XXXX" matching existing pattern
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `ORD-${randomSuffix}`;
    const initialStatus = 'Pending';
    const now = new Date().toISOString();

    const order = await prisma.order.create({
      data: {
        id,
        userId,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items: processedItems,
        total: serverComputedTotal,
        status: initialStatus,
        statusHistory: [{ status: initialStatus, timestamp: now }],
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

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Forbidden: You do not have access to this order');
    }

    return sendSuccess(res, 200, { order }, 'Order details fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
