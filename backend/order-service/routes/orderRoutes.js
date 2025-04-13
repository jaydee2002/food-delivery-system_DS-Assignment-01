import express from 'express';
import {
  placeOrder,
  updateOrder,
  trackOrder,
  getAllOrders,
  getOrders,
  getPending,
  acceptOrder,
  getPrepare,
  prepareOrder,
  getPickup,
  getReady,
  pickedOrder,
  getPicked,
  deliverOrder,
  getDelivered,
  cancelOrder,
} from '../controllers/orderController.js';
import {
  customerAuthMiddleware,
  restaurantAdminAuthMiddleware,
  systemAdminAuthMiddleware,
  deliveryAuthMiddleware,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

//Customer
router.post('/', customerAuthMiddleware, placeOrder);
router.patch('/:id', customerAuthMiddleware, updateOrder);
router.get('/:id', customerAuthMiddleware, trackOrder);
router.get('/', customerAuthMiddleware, getOrders);
router.delete('/:id', customerAuthMiddleware, cancelOrder);

//System Admin
router.get('/admin', systemAdminAuthMiddleware, getAllOrders);

//Restaurant Admin
router.get(
  '/restaurant/:id/pending',
  restaurantAdminAuthMiddleware,
  getPending
);
router.put('/:id/prepare', restaurantAdminAuthMiddleware, acceptOrder);
router.get(
  '/restaurant/:id/preparing',
  restaurantAdminAuthMiddleware,
  getPrepare
);
router.put('/:id/ready', restaurantAdminAuthMiddleware, prepareOrder);
router.get('/restaurant/:id/ready', restaurantAdminAuthMiddleware, getPickup);
router.put('/:id/confirm', restaurantAdminAuthMiddleware, pickedOrder);
router.get('/restaurant/:id/picked', restaurantAdminAuthMiddleware, getPicked);
router.get(
  '/restaurant/:id/delivered',
  restaurantAdminAuthMiddleware,
  getDelivered
);

//Delivery Person
router.get('/ready', deliveryAuthMiddleware, getReady);
router.put('/:id/deliver', deliveryAuthMiddleware, deliverOrder);

export default router;
