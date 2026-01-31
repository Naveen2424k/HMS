const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Create Razorpay order
router.post('/razorpay/create-order', protect, paymentController.createRazorpayOrder);

// Verify Razorpay payment
router.post('/razorpay/verify', protect, paymentController.verifyRazorpayPayment);

// Record manual payment (cash/card)
router.post('/record', protect, paymentController.recordPayment);

// Get payment history
router.get('/history', protect, paymentController.getPaymentHistory);

// Get payment by ID
router.get('/:id', protect, paymentController.getPaymentById);

// Process refund
router.post('/:paymentId/refund', protect, paymentController.processRefund);

// Get payment statistics
router.get('/stats/revenue', protect, paymentController.getPaymentStats);

module.exports = router;
