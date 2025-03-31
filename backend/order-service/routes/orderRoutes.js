import express from 'express';
import {
  placeOrder,
  updateOrder,
  trackOrder,
  getAllOrders,
  getOrders,
} from '../controllers/orderController.js';
import { authMiddleware, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, restrictTo('customer'), placeOrder);
router.patch('/:id', authMiddleware, restrictTo('customer'), updateOrder);
router.get('/:id', authMiddleware, restrictTo('customer'), trackOrder);
router.get('/', authMiddleware, restrictTo('customer'), getOrders);
router.get(
  '/admin',
  authMiddleware,
  restrictTo('restaurant_admin'),
  getAllOrders
);
 
export default router;
