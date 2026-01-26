const Bill = require('../models/Bill');

const getBills = async (req, res) => {
    let bills;
    if (req.user.role === 'Admin' || req.user.role === 'Receptionist') {
        bills = await Bill.find().populate({ path: 'patient', populate: { path: 'user', select: 'name' } }).populate('appointment');
    } else {
        const patient = await Patient.findOne({ user: req.user._id });
        bills = await Bill.find({ patient: patient._id }).populate({ path: 'patient', populate: { path: 'user', select: 'name' } }).populate('appointment');
    }
    res.json(bills);
};

const createBill = async (req, res) => {
    const { patientId, appointmentId, amount } = req.body;
    const bill = new Bill({ patient: patientId, appointment: appointmentId, amount });
    const createdBill = await bill.save();
    res.status(201).json(createdBill);
};

const updateBillStatus = async (req, res) => {
    const { status, paymentMethod } = req.body;
    const bill = await Bill.findById(req.params.id);
    if (bill) {
        bill.status = status || bill.status;
        bill.paymentMethod = paymentMethod || bill.paymentMethod;
        const updatedBill = await bill.save();
        res.json(updatedBill);
    } else {
        res.status(404).json({ message: 'Bill not found' });
    }
};

module.exports = { getBills, createBill, updateBillStatus };
