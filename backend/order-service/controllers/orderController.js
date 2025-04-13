import Order from '../models/Order.js';
import { io } from '../index.js';

//Place Order
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

    // const paymentResponse = await axios.post(
    //   'http://localhost:3000/api/payments/process',
    //   { orderId: order._id, amount: total },
    //   { headers: { Authorization: `Bearer ${req.header('Authorization')}` } }
    // );

    io.emit('newOrder', order);
    res.status(201).json(order);
  } catch (error) {
    console.log('eoorr', error);
    res.status(500).json({ message: 'Error in Placing Order' });
  }
};

//Before Confirmation Update Order
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

//Cancel Order (Before Confirmation)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be canceled' });
    }
    await order.remove();
    res.json({ message: 'Order canceled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get pending orders of that restrauant
export const getPending = async (req, res) => {
  try {
    const orders = await Order.find({
      restaurant: req.params.id,
      status: 'pending',
    }).populate('customer items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Change Order Status to Preparing (Restaurant Admin)
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurant');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.restaurant.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: Not the restaurant admin' });
    }
    if (order.status !== 'pending') {
      return res
        .status(400)
        .json({ message: 'Order cannot be set to preparing' });
    }

    order.status = 'preparing';
    await order.save();

    // await axios.post('http://localhost:3000/api/notifications/send', {
    //   orderId: order._id,
    //   customerEmail: 'customer@example.com',
    //   customerPhone: '+94771234567',
    // });

    io.emit('orderStatusUpdate', order);
    res.json({ message: 'Order accepted and set to preparing', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get preparing orders of that restrauant
export const getPrepare = async (req, res) => {
  try {
    const orders = await Order.find({
      restaurant: req.params.id,
      status: 'preparing',
    }).populate('customer items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Change Order Status to Ready for Pickup (Restaurant Admin)
export const prepareOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurant');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.restaurant.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: Not the restaurant admin' });
    }
    if (order.status !== 'preparing') {
      return res
        .status(400)
        .json({ message: 'Order must be in preparing status' });
    }

    order.status = 'ready-to-pickup';
    await order.save();

    io.emit('orderStatusUpdate', order);
    res.json({ message: 'Order is ready for pickup', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get ready to pickup orders of that restrauant
export const getPickup = async (req, res) => {
  try {
    const orders = await Order.find({
      restaurant: req.params.id,
      status: 'ready-to-pickup',
    }).populate('customer items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Preparing Orders for Delivery Personnel
export const getReady = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'ready-to-pickup' }).populate(
      'restaurant items.menuItem'
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Change Order Status to Picked
export const pickedOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'ready-to-pickup') {
      return res
        .status(400)
        .json({ message: 'Order must be in ready to pickup status' });
    }

    order.status = 'picked';
    await order.save();

    io.emit('orderStatusUpdate', order);
    res.json({ message: 'Order confirmed for delivery', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get picked orders of that restrauant
export const getPicked = async (req, res) => {
  try {
    const orders = await Order.find({
      restaurant: req.params.id,
      status: 'picked',
    }).populate('customer items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Change Order Status to Delivered (Delivery Person)
export const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'picked') {
      return res
        .status(400)
        .json({ message: 'Order must be in picked status' });
    }

    order.status = 'delivered';
    await order.save();

    io.emit('orderStatusUpdate', order);
    res.json({ message: 'Order delivered successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get delivered orders of that restrauant
export const getDelivered = async (req, res) => {
  try {
    const orders = await Order.find({
      restaurant: req.params.id,
      status: 'delivered',
    }).populate('customer items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Track One Specific Order (Customer)
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

//Customer Past Orders
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
