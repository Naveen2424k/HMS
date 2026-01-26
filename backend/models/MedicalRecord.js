const mongoose = require('mongoose');

const medicalRecordSchema = mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
        appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
        diagnosis: { type: String, required: true },
        prescription: { type: String, required: true },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
module.exports = MedicalRecord;
