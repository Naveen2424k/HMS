const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ward',
        required: true
    },
    bed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bed',
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Cancelled', 'Completed'],
        default: 'Confirmed'
    },
    admissionReason: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
