import express from 'express';
import { verifyAuth } from '../middlewares/authMiddleware.js';
import { userProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', verifyAuth, userProfile);

export default router;
