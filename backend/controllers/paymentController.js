const Payment = require('../models/Payment');
const Bill = require('../models/Bill');
const crypto = require('crypto');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

// Note: Install Razorpay SDK: npm install razorpay
// const Razorpay = require('razorpay');

// Initialize Razorpay (uncomment when you have API keys)
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { billId, amount } = req.body;

        const bill = await Bill.findById(billId);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Uncomment when Razorpay is configured
        // const options = {
        //     amount: amount * 100, // amount in paise
        //     currency: 'INR',
        //     receipt: `receipt_${billId}`,
        //     payment_capture: 1
        // };

        // const order = await razorpay.orders.create(options);

        // For now, create a mock order
        const order = {
            id: `order_${Date.now()}`,
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${billId}`
        };

        const payment = new Payment({
            bill: billId,
            patient: bill.patient,
            amount,
            paymentMethod: 'razorpay',
            paymentStatus: 'pending',
            razorpayOrderId: order.id
        });

        await payment.save();

        res.json({
            success: true,
            order,
            paymentId: payment._id,
            key: process.env.RAZORPAY_KEY_ID || 'rzp_test_key'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify Razorpay payment
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentId
        } = req.body;

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
            .update(sign.toString())
            .digest('hex');

        // For development, skip signature verification
        const isValid = true; // In production: expectedSign === razorpay_signature

        if (isValid) {
            const payment = await Payment.findById(paymentId).populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email' }
            });

            if (!payment) {
                return res.status(404).json({ message: 'Payment not found' });
            }

            payment.paymentStatus = 'completed';
            payment.razorpayPaymentId = razorpay_payment_id;
            payment.razorpaySignature = razorpay_signature;
            payment.paidAt = new Date();
            payment.invoiceNumber = `INV${Date.now()}`;

            await payment.save();

            // Update bill status
            await Bill.findByIdAndUpdate(payment.bill, {
                paymentStatus: 'paid',
                paidAmount: payment.amount,
                paidAt: new Date()
            });

            // Send Notifications
            if (payment.patient) {
                const paymentData = {
                    patientEmail: payment.patient.user.email,
                    patientName: payment.patient.user.name,
                    patientPhone: payment.patient.phone,
                    invoiceNumber: payment.invoiceNumber,
                    transactionId: payment.razorpayPaymentId || payment.transactionId,
                    amount: payment.amount,
                    paymentMethod: payment.paymentMethod,
                    paidAt: payment.paidAt
                };

                emailService.sendPaymentReceipt(paymentData).catch(err => console.error(err));
                smsService.sendPaymentConfirmationSMS(paymentData).catch(err => console.error(err));
            }

            res.json({
                success: true,
                message: 'Payment verified successfully',
                payment
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Record cash/card payment
exports.recordPayment = async (req, res) => {
    try {
        const { billId, amount, paymentMethod, notes } = req.body;

        const bill = await Bill.findById(billId);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        const payment = new Payment({
            bill: billId,
            patient: bill.patient,
            amount,
            paymentMethod,
            paymentStatus: 'completed',
            paidAt: new Date(),
            invoiceNumber: `INV${Date.now()}`,
            notes
        });

        await payment.save();

        // Update bill
        await Bill.findByIdAndUpdate(billId, {
            paymentStatus: 'paid',
            paidAmount: amount,
            paidAt: new Date()
        });

        // Populate for notification
        const populatedPayment = await Payment.findById(payment._id).populate({
            path: 'patient',
            populate: { path: 'user', select: 'name email' }
        });

        if (populatedPayment && populatedPayment.patient) {
            const paymentData = {
                patientEmail: populatedPayment.patient.user.email,
                patientName: populatedPayment.patient.user.name,
                patientPhone: populatedPayment.patient.phone,
                invoiceNumber: populatedPayment.invoiceNumber,
                transactionId: populatedPayment.transactionId,
                amount: populatedPayment.amount,
                paymentMethod: populatedPayment.paymentMethod,
                paidAt: populatedPayment.paidAt
            };

            emailService.sendPaymentReceipt(paymentData).catch(err => console.error(err));
            smsService.sendPaymentConfirmationSMS(paymentData).catch(err => console.error(err));
        }

        res.status(201).json({
            success: true,
            payment,
            message: 'Payment recorded successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
    try {
        const { patientId, startDate, endDate, status } = req.query;

        let query = {};

        if (patientId) query.patient = patientId;
        if (status) query.paymentStatus = status;
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const payments = await Payment.find(query)
            .populate('patient', 'name email phone')
            .populate('bill')
            .sort({ createdAt: -1 });

        const totalAmount = await Payment.aggregate([
            { $match: { ...query, paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            success: true,
            payments,
            totalAmount: totalAmount[0]?.total || 0,
            count: payments.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('patient', 'name email phone')
            .populate('bill');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json({
            success: true,
            payment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Process refund
exports.processRefund = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { refundAmount, refundReason } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (payment.paymentStatus !== 'completed') {
            return res.status(400).json({ message: 'Only completed payments can be refunded' });
        }

        // In production, process refund through payment gateway
        // if (payment.razorpayPaymentId) {
        //     await razorpay.payments.refund(payment.razorpayPaymentId, {
        //         amount: refundAmount * 100
        //     });
        // }

        payment.paymentStatus = 'refunded';
        payment.refundAmount = refundAmount;
        payment.refundReason = refundReason;
        payment.refundedAt = new Date();

        await payment.save();

        // Update bill
        await Bill.findByIdAndUpdate(payment.bill, {
            paymentStatus: 'refunded'
        });

        res.json({
            success: true,
            payment,
            message: 'Refund processed successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const matchQuery = {
            paymentStatus: 'completed'
        };

        if (startDate && endDate) {
            matchQuery.paidAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const stats = await Payment.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$paymentMethod',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalRevenue = await Payment.aggregate([
            { $match: matchQuery },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const dailyRevenue = await Payment.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
                    revenue: { $sum: '$amount' },
                    transactions: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            stats,
            totalRevenue: totalRevenue[0]?.total || 0,
            dailyRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
