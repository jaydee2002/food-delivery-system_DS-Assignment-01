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

// System Admin
router.get('/admin', systemAdminAuthMiddleware, getAllOrders);

// Delivery Person
router.get('/ready', deliveryAuthMiddleware, getReady);

// Customer
router.post('/', customerAuthMiddleware, placeOrder);
router.get('/', customerAuthMiddleware, getOrders);

// Restaurant Admin
router.get(
  '/restaurant/:id/pending',
  restaurantAdminAuthMiddleware,
  getPending
);
router.get(
  '/restaurant/:id/preparing',
  restaurantAdminAuthMiddleware,
  getPrepare
);
router.get('/restaurant/:id/ready', restaurantAdminAuthMiddleware, getPickup);
router.get('/restaurant/:id/picked', restaurantAdminAuthMiddleware, getPicked);
router.get(
  '/restaurant/:id/delivered',
  restaurantAdminAuthMiddleware,
  getDelivered
);

// Routes with dynamic :id (place these after specific routes)
router.patch('/:id/deliver', deliveryAuthMiddleware, deliverOrder);
router.patch('/:id', customerAuthMiddleware, updateOrder);
router.get('/:id', trackOrder);
router.delete('/:id', customerAuthMiddleware, cancelOrder);
router.patch('/:id/prepare', restaurantAdminAuthMiddleware, acceptOrder);
router.patch('/:id/ready', restaurantAdminAuthMiddleware, prepareOrder);
router.patch('/:id/confirm', restaurantAdminAuthMiddleware, pickedOrder);

export default router;

//OLD ROUTES - Checked in Postman and working fine

// import express from 'express';
// import {
//   placeOrder,
//   updateOrder,
//   trackOrder,
//   getAllOrders,
//   getOrders,
//   getPending,
//   acceptOrder,
//   getPrepare,
//   prepareOrder,
//   getPickup,
//   getReady,
//   pickedOrder,
//   getPicked,
//   deliverOrder,
//   getDelivered,
//   cancelOrder,
// } from '../controllers/orderController.js';
// import {
//   customerAuthMiddleware,
//   restaurantAdminAuthMiddleware,
//   systemAdminAuthMiddleware,
//   deliveryAuthMiddleware,
// } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// //System Admin
// router.get('/admin', systemAdminAuthMiddleware, getAllOrders);

// //Delivery Person
// router.get('/ready', deliveryAuthMiddleware, getReady);
// router.patch('/:id/deliver', deliveryAuthMiddleware, deliverOrder);

// //Customer
// router.post('/', customerAuthMiddleware, placeOrder);
// router.patch('/:id', customerAuthMiddleware, updateOrder);
// router.get('/:id', customerAuthMiddleware, trackOrder);
// router.get('/', customerAuthMiddleware, getOrders);
// router.delete('/:id', customerAuthMiddleware, cancelOrder);

// //Restaurant Admin
// router.get(
//   '/restaurant/:id/pending',
//   restaurantAdminAuthMiddleware,
//   getPending
// );
// router.patch('/:id/prepare', restaurantAdminAuthMiddleware, acceptOrder);
// router.get(
//   '/restaurant/:id/preparing',
//   restaurantAdminAuthMiddleware,
//   getPrepare
// );
// router.patch('/:id/ready', restaurantAdminAuthMiddleware, prepareOrder);
// router.get('/restaurant/:id/ready', restaurantAdminAuthMiddleware, getPickup);
// router.patch('/:id/confirm', restaurantAdminAuthMiddleware, pickedOrder);
// router.get('/restaurant/:id/picked', restaurantAdminAuthMiddleware, getPicked);
// router.get(
//   '/restaurant/:id/delivered',
//   restaurantAdminAuthMiddleware,
//   getDelivered
// );

// export default router;
