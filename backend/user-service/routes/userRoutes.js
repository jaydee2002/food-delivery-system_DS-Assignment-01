import express from 'express';
import { verifyAuth } from '../middlewares/authMiddleware.js';
import { userProfile, getUserByparam } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', verifyAuth, userProfile);

// Added by Bavi for need in the Order Service
router.get('/:id', getUserByparam);

router.patch(
  '/:id/role',
  verifyAuth,
  restrictTo('system_admin'),
  updateUserRole
);

export default router;
