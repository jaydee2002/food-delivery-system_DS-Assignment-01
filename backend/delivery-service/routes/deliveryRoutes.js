import express from 'express';
import jwt from 'jsonwebtoken';
import Delivery from '../models/Delivery.js';
import Order from '../models/Order.js';
import { io } from '../index.js';

const router = express.Router();

// Middleware to authenticate delivery personnel
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'delivery_personnel') return res.status(403).json({ message: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Assign Delivery (Auto-assignment simulation)
router.post('/assign', async (req, res) => {
  const { orderId, driverId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'preparing') return res.status(400).json({ message: 'Order not ready' });

    const delivery = new Delivery({ order: orderId, driver: driverId, location: 'Restaurant' });
    await delivery.save();
    order.status = 'confirmed';
    await order.save();
    io.emit('deliveryAssigned', delivery); // Notify customer
    res.status(201).json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Delivery Status
router.put('/:id', authMiddleware, async (req, res) => {
  const { status, location } = req.body;
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery || delivery.driver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    delivery.status = status || delivery.status;
    delivery.location = location || delivery.location;
    await delivery.save();

    if (status === 'delivered') {
      const order = await Order.findById(delivery.order);
      order.status = 'delivered';
      await order.save();
    }
    io.emit('deliveryUpdate', delivery); // Real-time update
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;