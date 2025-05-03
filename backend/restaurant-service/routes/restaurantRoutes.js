import express from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController.js';
import { verifyAuth, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Restaurant routes
router.post('/', verifyAuth, restrictTo('restaurant_admin'), createRestaurant);
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;
