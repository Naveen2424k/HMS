const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Helper to get doctor profile from Clerk ID
const getDoctorIdByClerkId = async (clerkId) => {
    const user = await User.findOne({ clerkId });
    if (!user) return null;
    const doctor = await Doctor.findOne({ user: user._id });
    return doctor ? doctor._id : null;
};

const getDoctorAppointments = async (req, res) => {
    try {
        const clerkId = req.headers['x-clerk-user-id']; // We'll pass this from frontend for now
        console.log('DEBUG: Fetching appointments for Clerk ID:', clerkId);
        if (!clerkId) return res.status(401).json({ message: 'Clerk ID missing' });

        const doctorId = await getDoctorIdByClerkId(clerkId);
        if (!doctorId) return res.status(404).json({ message: 'Doctor profile not found' });

        const appointments = await Appointment.find({ doctor: doctorId })
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email' }
            })
            .sort({ date: 1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { sendNotification } = require('../services/notificationService');

const acceptAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'patient',
            populate: { path: 'user' }
        });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = 'Approved';
        await appointment.save();

        // Notify Patient
        if (appointment.patient?.user) {
            await sendNotification(req.app, {
                recipient: appointment.patient.user._id,
                type: 'Appointment',
                title: 'Appointment Approved',
                message: 'Your appointment has been approved by the doctor. Check your dashboard for queue status.',
                priority: 'High'
            });
        }

        res.json({ message: 'Appointment accepted', appointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rejectAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'patient',
            populate: { path: 'user' }
        });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = 'Cancelled';
        await appointment.save();

        // Notify Patient
        if (appointment.patient?.user) {
            await sendNotification(req.app, {
                recipient: appointment.patient.user._id,
                type: 'Appointment',
                title: 'Appointment Cancelled',
                message: 'Your appointment has been cancelled/rejected by the specialist.',
                priority: 'Medium'
            });
        }

        res.json({ message: 'Appointment rejected', appointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const completeAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'patient',
            populate: { path: 'user' }
        });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = 'Completed';
        await appointment.save();

        // Notify Patient
        if (appointment.patient?.user) {
            await sendNotification(req.app, {
                recipient: appointment.patient.user._id,
                type: 'Appointment',
                title: 'Session Completed',
                message: 'Your medical session has been marked as completed. Please check for prescriptions.',
                priority: 'Medium'
            });
        }

        res.json({ message: 'Appointment marked as completed', appointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDoctorAppointments,
    acceptAppointment,
    rejectAppointment,
    completeAppointment
};
