const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get all prescriptions for a user
// @route   GET /api/prescriptions
// @access  Private
const getPrescriptions = async (req, res) => {
    let prescriptions;
    if (req.user.role === 'Admin' || req.user.role === 'Receptionist') {
        prescriptions = await Prescription.find()
            .populate({ path: 'patient', populate: { path: 'user', select: 'name' } })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    } else if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        prescriptions = await Prescription.find({ doctor: doctor._id })
            .populate({ path: 'patient', populate: { path: 'user', select: 'name' } });
    } else {
        const patient = await Patient.findOne({ user: req.user._id });
        prescriptions = await Prescription.find({ patient: patient._id })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    }
    res.json(prescriptions);
};

// @desc    Create a prescription
// @route   POST /api/prescriptions
// @access  Private/Doctor
const createPrescription = async (req, res) => {
    const { patientId, appointmentId, medicines, notes } = req.body;
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const prescription = await Prescription.create({
        patient: patientId,
        doctor: doctor._id,
        appointment: appointmentId,
        medicines,
        notes
    });

    res.status(201).json(prescription);
};

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res) => {
    const prescription = await Prescription.findById(req.params.id)
        .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name email specialization' } });

    if (prescription) {
        res.json(prescription);
    } else {
        res.status(404).json({ message: 'Prescription not found' });
    }
};

module.exports = { getPrescriptions, createPrescription, getPrescriptionById };
