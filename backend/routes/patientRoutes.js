const express = require('express');
const router = express.Router();
const { getPatients, getPatientById, createPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPatients).post(protect, createPatient);
router.route('/me').get(protect, authorize('Patient'), async (req, res) => {
    const Patient = require('../models/Patient');
    const patient = await Patient.findOne({ user: req.user._id });
    if (patient) {
        res.json(patient);
    } else {
        res.status(404).json({ message: 'Patient profile not found' });
    }
});
router.route('/:id').get(protect, getPatientById).put(protect, updatePatient).delete(protect, authorize('Admin'), deletePatient);

module.exports = router;
