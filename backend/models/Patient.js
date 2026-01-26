const mongoose = require('mongoose');

const patientSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
        bloodGroup: { type: String },
        address: { type: String },
        phone: { type: String, required: true },
        medicalHistory: [{ type: String }],
    },
    { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
