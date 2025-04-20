import express from "express";
import dotenv from "dotenv";
import notificationRoutes from './routes/notificationRoutes.js';
import cors from "cors";

dotenv.config();

app.use(cors());
const app = express();
app.use(express.json());

app.use('/api/notifications', notificationRoutes);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


app.get("/", (req, res) => {
  res.send("Notification Service Running");
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () =>
  console.log(`Notification Service running on port ${PORT}`),
);




//https://expressjs.com/en/resources/middleware/cors.html