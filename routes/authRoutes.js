import express from 'express';
import { signup, login, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Email Verification Route
router.get('/verify-email', verifyEmail);

export default router;
