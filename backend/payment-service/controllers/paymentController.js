import axios from 'axios';
import Payment from '../models/paymentModel.js';

export const processPayment = async (req, res) => {
  const { orderId, amount } = req.body;

  const payHereData = {
    merchant_id: process.env.PAYHERE_MERCHANT_ID,
    return_url: 'http://localhost:5173/success',
    cancel_url: 'http://localhost:5173/cancel',
    notify_url: 'http://localhost:3005/api/payments/notify',
    order_id: orderId,
    items: 'Food Order',
    amount: amount,
    currency: 'LKR',
    first_name: 'Customer',
    last_name: 'User',
    email: 'customer@example.com',
    phone: '0771234567',
    address: '123 Street',
    city: 'Colombo',
    country: 'Sri Lanka',
  };

  try {
    // Save payment record in DB
    await Payment.create({
      orderId,
      amount,
      status: 'pending',
    });

    // Convert JSON to URL-encoded format
    const formData = new URLSearchParams(payHereData).toString();

    // Send data to PayHere checkout
    const response = await axios.post(
      'https://sandbox.payhere.lk/pay/checkout',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        maxRedirects: 0, // Prevent Axios from following the redirect
        validateStatus: (status) => status >= 200 && status < 400,
      }
    );

    // Extract redirect URL (PayHere responds with 302 redirect)
    const paymentUrl = response.headers.location;

    if (paymentUrl) {
      res.json({ paymentUrl });
    } else {
      res.status(500).json({ message: 'Failed to get PayHere redirect URL' });
    }
  } catch (err) {
    console.error('Payment error:', err.message);
    res.status(500).json({ message: 'Payment initiation failed' });
  }
};

export const notifyPayment = async (req, res) => {
  const { order_id, status_code, payment_id } = req.body;

  try {
    if (status_code === '2') {
      // Payment successful
      await Payment.findOneAndUpdate(
        { orderId: order_id },
        { status: 'success', payhereReferenceId: payment_id }
      );
      console.log(`Payment successful for order ${order_id}`);
    } else {
      // Payment failed
      await Payment.findOneAndUpdate(
        { orderId: order_id },
        { status: 'failed' }
      );
      console.log(`Payment failed for order ${order_id}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating payment:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
