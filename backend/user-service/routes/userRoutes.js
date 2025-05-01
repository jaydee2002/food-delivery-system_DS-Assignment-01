import express from 'express';
import { verifyAuth, restrictTo } from '../middlewares/authMiddleware.js';
import {
  userProfile,
  getUserByparam,
  addToCart,
  getCart,
} from '../controllers/userController.js';
import { updateUserRole } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', verifyAuth, userProfile);

router.patch(
  '/:id/role',
  verifyAuth,
  restrictTo('system_admin'),
  updateUserRole
);

// Add item to cart (protected route)
router.post('/cart', verifyAuth, addToCart);

// Fetch user's cart (protected route)
router.get('/cart', verifyAuth, getCart);

// Added by Bavi for need in the Order Service
router.get('/:id', getUserByparam);

export default router;
