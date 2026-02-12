const Bill = require('../models/Bill');
const Patient = require('../models/Patient');
const { sendNotification } = require('../services/notificationService');
const { asyncHandler } = require('../middleware/errorMiddleware');


// @desc    Get all bills with pagination
// @route   GET /api/billing
// @access  Private
const getBills = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.user.role !== 'Admin' && req.user.role !== 'Receptionist') {
        const patient = await Patient.findOne({ user: req.user._id });
        if (patient) {
            query = { patient: patient._id };
        } else {
            return res.json({ data: [], page, pages: 0, total: 0 });
        }
    }

    const bills = await Bill.find(query)
        .populate({ path: 'patient', populate: { path: 'user', select: 'name' } })
        .populate('appointment')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Bill.countDocuments(query);

    res.json({
        data: bills,
        page,
        pages: Math.ceil(total / limit),
        total
    });
});

// @desc    Create a new bill
// @route   POST /api/billing
// @access  Private/Admin
const createBill = asyncHandler(async (req, res) => {
    const { patientId, appointmentId, amount } = req.body;

    if (!patientId || !appointmentId || !amount) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const bill = new Bill({ patient: patientId, appointment: appointmentId, amount });
    const createdBill = await bill.save();

    // Real-time Notification for Patient
    const populatedBill = await Bill.findById(createdBill._id).populate({ path: 'patient', populate: { path: 'user' } });
    if (populatedBill?.patient?.user) {
        await sendNotification(req.app, {
            recipient: populatedBill.patient.user._id,
            type: 'System',
            title: 'New Bill Generated',
            message: `A new bill for ₹${amount} has been generated for your recent appointment.`,
            priority: 'High'
        });
    }

    res.status(201).json(createdBill);
});


// @desc    Update bill status
// @route   PUT /api/billing/:id
// @access  Private
const updateBillStatus = asyncHandler(async (req, res) => {
    const { status, paymentMethod } = req.body;
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
        res.status(404);
        throw new Error('Bill not found');
    }

    bill.status = status || bill.status;
    bill.paymentMethod = paymentMethod || bill.paymentMethod;
    const updatedBill = await bill.save();
    res.json(updatedBill);
});

module.exports = { getBills, createBill, updateBillStatus };
