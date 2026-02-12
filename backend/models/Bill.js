const mongoose = require('mongoose');

const billSchema = mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
        appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
        paymentMethod: { type: String },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

billSchema.index({ patient: 1 });
billSchema.index({ appointment: 1 });

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;

