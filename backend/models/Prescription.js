const mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
        appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
        medicines: [
            {
                name: { type: String, required: true },
                dosage: { type: String, required: true }, // e.g., '1-0-1'
                duration: { type: String, required: true }, // e.g., '5 days'
                instructions: { type: String },
            }
        ],
        notes: { type: String },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
