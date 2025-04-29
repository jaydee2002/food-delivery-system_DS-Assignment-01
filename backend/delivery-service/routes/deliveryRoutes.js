import express from 'express';
import {
  assignDelivery,
  updateDeliveryStatus,
  getDeliveries,
  getDeliveryById
} from '../controllers/deliveryController.js';
import { deliveryAuthMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// router.get('/my-deliveries', deliveryAuthMiddleware, getDeliveries);
// router.post('/assign', deliveryAuthMiddleware, assignDelivery);
// router.put('/:id', deliveryAuthMiddleware, updateDeliveryStatus);
// router.get('/:id', deliveryAuthMiddleware, getDeliveryById);

router.get('/my-deliveries', getDeliveries);
router.post('/assign',assignDelivery);
router.put('/:id',  updateDeliveryStatus);
router.get('/:id', getDeliveryById);

export default router;
