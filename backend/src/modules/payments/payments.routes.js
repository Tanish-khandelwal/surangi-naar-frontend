import { Router } from 'express';
import { createRazorpayOrder, verifyPaymentSignature } from './payments.controller.js';

const router = Router();

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPaymentSignature);

export default router;
