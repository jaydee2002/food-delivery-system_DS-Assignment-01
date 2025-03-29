import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.get('/', (req, res) => {
  res.send('Restaurant Service Running');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
  console.log(`Restaurant Service running on port ${PORT}`)
);
