import Transaction from '../models/transactionModel.js';
import User from '../models/userModel.js';
import { sendTransactionEmail } from '../utils/email.js';

// Transfer Logic
export const transfer = async (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  try {
    // Find both users
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    if (fromUser.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct and add balance
    fromUser.balance -= amount;
    toUser.balance += amount;

    await fromUser.save();
    await toUser.save();

    // Create a transaction record
    const transaction = new Transaction({
      from: fromUser._id,
      to: toUser._id,
      amount,
      status: 'success',
    });

    await transaction.save();

    // Send transaction email
    sendTransactionEmail(transaction);

    res.status(200).json({ message: 'Transfer successful', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// View Transactions Logic
export const viewTransactions = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch transactions related to the user
    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }],
    }).populate('from to', 'name email');

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
