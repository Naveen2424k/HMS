const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenNumber: {
        type: Number,
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    status: {
        type: String,
        enum: ['waiting', 'in-progress', 'completed', 'cancelled'],
        default: 'waiting'
    },
    checkInTime: {
        type: Date,
        default: Date.now
    },
    callTime: {
        type: Date
    },
    completionTime: {
        type: Date
    },
    estimatedWaitTime: {
        type: Number, // in minutes
        default: 0
    },
    priority: {
        type: String,
        enum: ['normal', 'urgent', 'emergency'],
        default: 'normal'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
tokenSchema.index({ date: 1, status: 1 });
tokenSchema.index({ doctor: 1, status: 1 });

module.exports = mongoose.model('Token', tokenSchema);
