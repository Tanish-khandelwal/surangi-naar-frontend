import { Router } from 'express';
import { validateCoupon } from './coupons.controller.js';
import { writeRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/validate', writeRateLimiter, validateCoupon);

export default router;
