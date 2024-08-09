import express from 'express';
import { transfer, viewTransactions } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Transfer Route
router.post('/transfer', protect, transfer);

// View Transactions Route
router.get('/:userId', protect, viewTransactions);

export default router;
