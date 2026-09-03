import { Router } from 'express';
import { createRazorpayOrder, verifyPaymentSignature, handleRazorpayWebhook } from './payments.controller.js';
import { paymentRateLimiter, webhookRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/create-order', paymentRateLimiter, createRazorpayOrder);
router.post('/verify', paymentRateLimiter, verifyPaymentSignature);
router.post('/webhook', webhookRateLimiter, handleRazorpayWebhook);

export default router;
