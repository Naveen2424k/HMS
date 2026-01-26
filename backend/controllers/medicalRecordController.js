const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');

const getMedicalRecords = async (req, res) => {
    try {
        let records;
        if (req.user.role === 'Patient') {
            // Find records where the patient field matches the user's patient profile
            const Patient = require('../models/Patient');
            const patient = await Patient.findOne({ user: req.user._id });
            if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

            records = await MedicalRecord.find({ patient: patient._id })
                .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
                .sort({ date: -1 });
        } else if (req.user.role === 'Doctor') {
            const Doctor = require('../models/Doctor');
            const doctor = await Doctor.findOne({ user: req.user._id });
            records = await MedicalRecord.find({ doctor: doctor._id })
                .populate({ path: 'patient', populate: { path: 'user', select: 'name' } })
                .sort({ date: -1 });
        } else {
            // Admin
            records = await MedicalRecord.find()
                .populate({ path: 'patient', populate: { path: 'user', select: 'name' } })
                .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
        }
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createMedicalRecord = async (req, res) => {
    const { patientId, appointmentId, diagnosis, prescription } = req.body;

    // Determine doctor ID from logged in user
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
        return res.status(403).json({ message: 'Only doctors can create medical records' });
    }

    try {
        const record = new MedicalRecord({
            patient: patientId,
            doctor: doctor._id,
            appointment: appointmentId,
            diagnosis,
            prescription,
            date: Date.now()
        });

        const createdRecord = await record.save();
        res.status(201).json(createdRecord);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

module.exports = { getMedicalRecords, createMedicalRecord };
