const mongoose = require('mongoose');

const wardSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ['General', 'ICU', 'Emergency', 'Private', 'Semi-Private'],
            required: true
        },
        floor: { type: Number },
        capacity: { type: Number, required: true },
        dailyRate: { type: Number, required: true },
    },
    { timestamps: true }
);

const Ward = mongoose.model('Ward', wardSchema);
module.exports = Ward;
