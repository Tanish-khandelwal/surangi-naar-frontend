import { Router } from 'express';
import { validateCoupon, getActiveCoupons, getAvailableCoupons } from './coupons.controller.js';
import { writeRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.get('/available', getAvailableCoupons);
router.get('/', getActiveCoupons);
router.post('/validate', writeRateLimiter, validateCoupon);

export default router;

