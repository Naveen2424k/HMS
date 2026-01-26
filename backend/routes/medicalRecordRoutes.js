const express = require('express');
const router = express.Router();
const { getMedicalRecords, createMedicalRecord } = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMedicalRecords)
    .post(protect, authorize('Doctor', 'Admin'), createMedicalRecord);

module.exports = router;
