import express from 'express';
import {
  createRestaurant,
  getUnavailableRestaurants,
  updateRestaurantAvailability,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getMenuItemsByRestaurant,
  getRestaurantByOwner
} from '../controllers/restaurantController.js';
import { verifyAuth, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Restaurant routes
router.post(
  '/',
  verifyAuth,
  restrictTo('customer', 'restaurant_admin'),
  createRestaurant
);

router.get(
  '/unavailable',
  verifyAuth,
  restrictTo('system_admin'),
  getUnavailableRestaurants
);

router.patch(
  '/:id/availability',
  verifyAuth,
  restrictTo('system_admin'),
  updateRestaurantAvailability
);

// Fetch menu items for a specific restaurant
router.get('/menu', getMenuItemsByRestaurant);

router.get(
  '/owner',
  verifyAuth,
  restrictTo('restaurant_admin'),
  getRestaurantByOwner
);
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;
