const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
        reason: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
