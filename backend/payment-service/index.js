import express from 'express';
import dotenv from 'dotenv';
import paymentRoutes from './routes/paymentRoutes.js';
 
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/api/payments', paymentRoutes);

app.post('/api/payments/process', (req, res) => {
  const { orderId, amount } = req.body;

  // Here you would call the PayHere API (or redirect logic)
  const payHereUrl = `https://sandbox.payhere.lk/pay?order_id=${orderId}&amount=${amount}`;

  res.json({ paymentUrl: payHereUrl });
});

app.get('/', (req, res) => {
  res.send('Payment Service Running');
});

//start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));

