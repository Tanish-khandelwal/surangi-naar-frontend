import { Router } from 'express';
import * as ordersController from './orders.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { verifyAccessToken } from '../../utils/jwt.js';

const router = Router();

// Optional auth helper middleware for order creation
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = verifyAccessToken(token);
    } catch (e) {
      // Ignore token verification failure for guest checkouts
    }
  }
  next();
};

router.post('/', optionalAuth, ordersController.createOrder);
router.get('/', requireAuth, ordersController.getUserOrders);
router.get('/:id', ordersController.getOrderById);

export default router;
