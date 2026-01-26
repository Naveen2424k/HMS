const Doctor = require('../models/Doctor');
const User = require('../models/User');

const getDoctors = async (req, res) => {
    const keyword = req.query.specialization
        ? { specialization: { $regex: req.query.specialization, $options: 'i' } }
        : {};

    const doctors = await Doctor.find({ ...keyword }).populate('user', 'name email');
    res.json(doctors);
};

const getDoctorById = async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
    if (doctor) {
        res.json(doctor);
    } else {
        res.status(404).json({ message: 'Doctor not found' });
    }
};

const createDoctor = async (req, res) => {
    const { userId, specialization, experience, fees, availability } = req.body;
    const doctor = new Doctor({ user: userId, specialization, experience, fees, availability });
    const createdDoctor = await doctor.save();
    res.status(201).json(createdDoctor);
};

const updateDoctor = async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
        doctor.specialization = req.body.specialization || doctor.specialization;
        doctor.experience = req.body.experience || doctor.experience;
        doctor.fees = req.body.fees || doctor.fees;
        doctor.availability = req.body.availability || doctor.availability;
        const updatedDoctor = await doctor.save();
        res.json(updatedDoctor);
    } else {
        res.status(404).json({ message: 'Doctor not found' });
    }
};

const deleteDoctor = async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
        await doctor.deleteOne();
        res.json({ message: 'Doctor removed' });
    } else {
        res.status(404).json({ message: 'Doctor not found' });
    }
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
