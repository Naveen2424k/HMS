const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

const getAppointments = async (req, res) => {
    let appointments;
    if (req.user.role === 'Admin' || req.user.role === 'Receptionist') {
        appointments = await Appointment.find().populate({ path: 'patient', populate: { path: 'user', select: 'name' } }).populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    } else if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        appointments = await Appointment.find({ doctor: doctor._id }).populate({ path: 'patient', populate: { path: 'user', select: 'name' } }).populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    } else {
        const patient = await Patient.findOne({ user: req.user._id });
        appointments = await Appointment.find({ patient: patient._id }).populate({ path: 'patient', populate: { path: 'user', select: 'name' } }).populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    }
    res.json(appointments);
};

const createAppointment = async (req, res) => {
    const { doctorId, date, reason } = req.body;
    let patientId;

    if (req.user.role === 'Patient') {
        let patient = await Patient.findOne({ user: req.user._id });
        if (!patient) {
            // Auto-create profile for new users to unblock scheduling
            patient = await Patient.create({
                user: req.user._id,
                age: 30, // Default
                gender: 'Other',
                phone: 'Not Provided',
                bloodGroup: 'Unknown',
                address: 'Not Provided'
            });
        }
        patientId = patient._id;
    } else {
        // Admin or other roles scheduling for a patient
        patientId = req.body.patientId;
    }

    if (!patientId || !doctorId || !date) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check for existing appointment at the same time
    const appointmentDate = new Date(date);
    const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        date: appointmentDate,
        status: { $ne: 'Cancelled' }
    });

    if (existingAppointment) {
        return res.status(400).json({ message: 'This time slot is already booked. Please choose another time.' });
    }

    const appointment = new Appointment({ patient: patientId, doctor: doctorId, date, reason });
    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
};

const updateAppointmentStatus = async (req, res) => {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) {
        appointment.status = status || appointment.status;
        appointment.notes = notes || appointment.notes;
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } else {
        res.status(404).json({ message: 'Appointment not found' });
    }
};

module.exports = { getAppointments, createAppointment, updateAppointmentStatus };
