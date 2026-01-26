const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        specialization: { type: String, required: true },
        experience: { type: Number, required: true },
        fees: { type: Number, required: true },
        availability: [
            {
                day: { type: String, required: true }, // e.g., 'Monday'
                startTime: { type: String, required: true }, // e.g., '09:00'
                endTime: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
