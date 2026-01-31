const express = require('express');
const router = express.Router();
const { getPrescriptions, createPrescription, getPrescriptionById } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPrescriptions)
    .post(protect, authorize('Doctor'), createPrescription);

router.route('/:id')
    .get(protect, getPrescriptionById);

module.exports = router;
