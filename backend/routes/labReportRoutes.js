const express = require('express');
const router = express.Router();
const { getLabReports, requestLabTest, uploadLabResult } = require('../controllers/labReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getLabReports).post(protect, authorize('Doctor'), requestLabTest);
router.route('/:id').put(protect, authorize('Admin'), uploadLabResult);

module.exports = router;
