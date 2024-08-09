import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Verification Email
export const sendVerificationEmail = async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  const url = `http://localhost:5000/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your email',
    html: `<h3>Hello ${user.name}</h3><p>Please click the following link to verify your email: <a href="${url}">${url}</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

// Send Transaction Email
export const sendTransactionEmail = async (transaction) => {
  const fromUser = await User.findById(transaction.from);
  const toUser = await User.findById(transaction.to);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: fromUser.email,
    subject: 'Transaction Successful',
    html: `<h3>Transaction Details</h3>
           <p>From: ${fromUser.name}</p>
           <p>To: ${toUser.name}</p>
           <p>Amount: $${transaction.amount}</p>
           <p>Status: ${transaction.status}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending transaction email:', error);
  }
};
