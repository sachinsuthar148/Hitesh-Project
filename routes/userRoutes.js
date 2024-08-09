import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get Profile Route
router.get('/profile', protect, getUserProfile);

// Update Profile Route
router.put('/profile', protect, updateUserProfile);

export default router;
