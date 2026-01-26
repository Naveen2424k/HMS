const Patient = require('../models/Patient');
const User = require('../models/User');

const getPatients = async (req, res) => {
    const patients = await Patient.find().populate('user', 'name email');
    res.json(patients);
};

const getPatientById = async (req, res) => {
    const patient = await Patient.findById(req.params.id).populate('user', 'name email');
    if (patient) {
        res.json(patient);
    } else {
        res.status(404).json({ message: 'Patient not found' });
    }
};

const createPatient = async (req, res) => {
    const { userId, age, gender, phone, bloodGroup, address } = req.body;
    const patient = new Patient({ user: userId, age, gender, phone, bloodGroup, address });
    const createdPatient = await patient.save();
    res.status(201).json(createdPatient);
};

const updatePatient = async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
        patient.age = req.body.age || patient.age;
        patient.gender = req.body.gender || patient.gender;
        patient.phone = req.body.phone || patient.phone;
        patient.bloodGroup = req.body.bloodGroup || patient.bloodGroup;
        patient.address = req.body.address || patient.address;
        if (req.body.medicalHistory) {
            patient.medicalHistory = req.body.medicalHistory;
        }
        const updatedPatient = await patient.save();
        res.json(updatedPatient);
    } else {
        res.status(404).json({ message: 'Patient not found' });
    }
};

const getPatientProfile = async (req, res) => {
    let patient = await Patient.findOne({ user: req.user._id }).populate('user', 'name email');

    if (!patient) {
        // Auto-create a profile if one doesn't exist to ensure smooth UX
        patient = await Patient.create({
            user: req.user._id,
            age: 0,
            gender: 'Other',
            phone: 'Not Set',
            bloodGroup: 'Unknown',
            address: 'Not Set'
        });
        // Populate the user field for the newly created patient
        patient = await patient.populate('user', 'name email');
    }

    res.json(patient);
};

const deletePatient = async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
        await patient.deleteOne();
        res.json({ message: 'Patient removed' });
    } else {
        res.status(404).json({ message: 'Patient not found' });
    }
};

module.exports = { getPatients, getPatientById, createPatient, updatePatient, deletePatient, getPatientProfile };
