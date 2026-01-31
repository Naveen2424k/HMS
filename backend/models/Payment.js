const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'upi', 'netbanking', 'razorpay', 'stripe'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    paymentGatewayResponse: {
        type: Object
    },
    paidAt: {
        type: Date
    },
    refundedAt: {
        type: Date
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: {
        type: String
    },
    invoiceNumber: {
        type: String
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Generate unique transaction ID
paymentSchema.pre('save', async function (next) {
    if (!this.transactionId && this.paymentStatus === 'completed') {
        this.transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
    next();
});

module.exports = mongoose.model('Payment', paymentSchema);
