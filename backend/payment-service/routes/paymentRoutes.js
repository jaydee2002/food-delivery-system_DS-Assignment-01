import express from 'express';
import jwt from 'jsonwebtoken';
import { processPayment, notifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bareer', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'customer') return res.status(403).json({ message: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes
router.post('/process', processPayment);
router.post('/notify', notifyPayment);

export default router;
