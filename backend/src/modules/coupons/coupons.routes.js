import { Router } from 'express';
import { validateCoupon } from './coupons.controller.js';

const router = Router();

router.post('/validate', validateCoupon);

export default router;
