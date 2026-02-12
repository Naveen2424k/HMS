const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const { sendNotification } = require('../services/notificationService');
const { asyncHandler } = require('../middleware/errorMiddleware');


// @desc    Get all appointments with pagination
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        query = { doctor: doctor._id };
    } else if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ user: req.user._id });
        query = { patient: patient._id };
    }

    const appointments = await Appointment.find(query)
        .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Appointment.countDocuments(query);

    res.json({
        data: appointments,
        page,
        pages: Math.ceil(total / limit),
        total
    });
});

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
    const { doctorId, date, reason } = req.body;
    let patientId;

    if (req.user.role === 'Patient') {
        let patient = await Patient.findOne({ user: req.user._id });
        if (!patient) {
            patient = await Patient.create({
                user: req.user._id,
                age: 30,
                gender: 'Other',
                phone: 'Not Provided',
                bloodGroup: 'Unknown',
                address: 'Not Provided'
            });
        }
        patientId = patient._id;
    } else {
        patientId = req.body.patientId;
    }

    if (!patientId || !doctorId || !date) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const appointmentDate = new Date(date);
    const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        date: appointmentDate,
        status: { $ne: 'Cancelled' }
    });

    if (existingAppointment) {
        res.status(400);
        throw new Error('This time slot is already booked. Please choose another time.');
    }

    const appointment = new Appointment({ patient: patientId, doctor: doctorId, date, reason });
    const createdAppointment = await appointment.save();

    // Notification Logic (Async)
    const fullAppointment = await Appointment.findById(createdAppointment._id)
        .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });

    if (fullAppointment?.patient?.user && fullAppointment?.doctor?.user) {
        const appointmentData = {
            patientEmail: fullAppointment.patient.user.email,
            patientName: fullAppointment.patient.user.name,
            doctorName: fullAppointment.doctor.user.name,
            date: fullAppointment.date,
            time: new Date(fullAppointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            appointmentId: fullAppointment._id
        };
        emailService.sendAppointmentConfirmation(appointmentData).catch(err => console.error('Email Error:', err));
        smsService.sendAppointmentConfirmationSMS(appointmentData).catch(err => console.error('SMS Error:', err));

        // Real-time Notification for Doctor
        await sendNotification(req.app, {
            recipient: fullAppointment.doctor.user._id,
            sender: fullAppointment.patient.user._id,
            type: 'Appointment',
            title: 'New Appointment Scheduled',
            message: `New appointment with ${fullAppointment.patient.user.name} on ${new Date(fullAppointment.date).toLocaleDateString()}`,
            priority: 'Medium'
        });

        // Real-time Notification for Patient
        await sendNotification(req.app, {
            recipient: fullAppointment.patient.user._id,
            type: 'Appointment',
            title: 'Appointment Request Filed',
            message: `Your appointment with Dr. ${fullAppointment.doctor.user.name} has been submitted and is pending approval.`,
            priority: 'Medium'
        });
    }


    res.status(201).json(createdAppointment);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    appointment.status = status || appointment.status;
    appointment.notes = notes || appointment.notes;
    const updatedAppointment = await appointment.save();

    // Real-time Notification for Patient
    const populatedAppointment = await Appointment.findById(updatedAppointment._id).populate({ path: 'patient', populate: { path: 'user' } });
    if (populatedAppointment?.patient?.user) {
        await sendNotification(req.app, {
            recipient: populatedAppointment.patient.user._id,
            type: 'Appointment',
            title: `Appointment ${updatedAppointment.status}`,
            message: `Your appointment status has been updated to: ${updatedAppointment.status}${notes ? '. Notes: ' + notes : ''}`,
            priority: 'Medium'
        });
    }

    res.json(updatedAppointment);
});


module.exports = { getAppointments, createAppointment, updateAppointmentStatus };
