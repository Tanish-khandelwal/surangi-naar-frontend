import { Router } from 'express';
import * as authController from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.post('/google', authRateLimiter, authController.googleLogin);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
