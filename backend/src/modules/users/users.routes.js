import { Router } from 'express';
import { me, deleteAccount, updateUserProfile, changePassword } from '../auth/auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, me);
router.put('/me', requireAuth, updateUserProfile);
router.put('/change-password', requireAuth, changePassword);
router.delete('/me', requireAuth, deleteAccount);

export default router;
