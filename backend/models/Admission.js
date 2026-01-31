const mongoose = require('mongoose');

const admissionSchema = mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
        bed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', required: true },
        admissionDate: { type: Date, default: Date.now },
        dischargeDate: { type: Date },
        reason: { type: String, required: true },
        vitalsAtAdmission: {
            bp: String,
            temp: String,
            pulse: String,
            spO2: String
        },
        status: {
            type: String,
            enum: ['Admitted', 'Discharged', 'Transfered'],
            default: 'Admitted'
        },
        dischargeSummary: {
            conditionOnDischarge: String,
            advice: String,
            followUpDate: Date
        }
    },
    { timestamps: true }
);

const Admission = mongoose.model('Admission', admissionSchema);
module.exports = Admission;
