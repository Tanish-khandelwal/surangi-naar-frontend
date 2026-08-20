import { Router } from 'express';
import { me, deleteAccount } from '../auth/auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, me);
router.delete('/me', requireAuth, deleteAccount);

export default router;
