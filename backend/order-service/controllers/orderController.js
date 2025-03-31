import Order from '../models/Order.js';
import { io } from '../index.js';

export const placeOrder = async (req, res) => {
  const { restaurantId, items } = req.body;
  try {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const order = new Order({
      customer: req.user.id,
      restaurant: restaurantId,
      items,
      total,
    });
    await order.save();
    io.emit('newOrder', order);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error in Placing Order' });
  }
};

//Before Confirmation
export const updateOrder = async (req, res) => {
  const { items } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (
      !order ||
      order.customer.toString() !== req.user.id ||
      order.status !== 'pending'
    ) {
      return res.status(403).json({ message: 'Cannot modify order' });
    }
    order.items = items;
    order.total = items.reduce((sum, item) => sum + item.quantity * 10, 0);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'restaurant items.menuItem'
    );
    if (!order || order.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Past Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('restaurant')
      .populate('items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Admin Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer')
      .populate('restaurant')
      .populate('items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
