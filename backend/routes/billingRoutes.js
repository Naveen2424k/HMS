const express = require('express');
const router = express.Router();
const { getBills, createBill, updateBillStatus } = require('../controllers/billingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getBills).post(protect, authorize('Receptionist', 'Admin'), createBill);
router.route('/:id/status').put(protect, authorize('Receptionist', 'Admin'), updateBillStatus);

module.exports = router;
