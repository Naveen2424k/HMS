const mongoose = require('mongoose');

const labReportSchema = mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
        testName: { type: String, required: true },
        testResult: { type: String },
        reportFile: { type: String }, // URL to PDF
        status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const LabReport = mongoose.model('LabReport', labReportSchema);
module.exports = LabReport;
