import { Router } from 'express';
import { me, deleteAccount, updateUserProfile } from '../auth/auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, me);
router.put('/me', requireAuth, updateUserProfile);
router.delete('/me', requireAuth, deleteAccount);

export default router;
