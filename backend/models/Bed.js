const mongoose = require('mongoose');

const bedSchema = mongoose.Schema(
    {
        bedNumber: { type: String, required: true },
        ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', required: true },
        status: {
            type: String,
            enum: ['Available', 'Occupied', 'Maintenance', 'Reserved'],
            default: 'Available'
        },
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
        pricePerDay: { type: Number },
    },
    { timestamps: true }
);

const Bed = mongoose.model('Bed', bedSchema);
module.exports = Bed;
