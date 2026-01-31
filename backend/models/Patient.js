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
        allergies: [{ type: String }],
        chronicDiseases: [{ type: String }],
        pastSurgeries: [{
            name: String,
            date: Date,
            doctor: String,
            outcome: String
        }],
        emergencyContact: {
            name: String,
            relation: String,
            phone: String
        },
        insuranceProvider: { type: String },
        insuranceId: { type: String }
    },
    { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
