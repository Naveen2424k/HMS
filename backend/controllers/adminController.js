const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const HospitalSettings = require('../models/HospitalSettings');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Payment = require('../models/Payment');
const Bill = require('../models/Bill');
const Bed = require('../models/Bed');
const Department = require('../models/Department');
const Inventory = require('../models/Inventory');

// @desc    Get complete administrative dashboard stats
exports.getAdminDashboard = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // KPI Counts
        const [totalPatients, totalDoctors, totalStaff, totalDepartments] = await Promise.all([
            Patient.countDocuments(),
            Doctor.countDocuments(),
            User.countDocuments({ role: { $nin: ['Patient', 'Doctor'] } }),
            Department.countDocuments()
        ]);

        // Revenue Metrics
        const dailyRevenueArr = await Payment.aggregate([
            { $match: { paymentStatus: 'completed', paidAt: { $gte: today } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const monthlyRevenueArr = await Payment.aggregate([
            { $match: { paymentStatus: 'completed', paidAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Bed Occupancy rate
        const [totalBeds, occupiedBeds] = await Promise.all([
            Bed.countDocuments(),
            Bed.countDocuments({ status: 'Occupied' })
        ]);

        const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

        res.json({
            success: true,
            stats: {
                totalPatients,
                totalDoctors,
                totalStaff,
                totalDepartments,
                todayRevenue: dailyRevenueArr[0]?.total || 0,
                monthlyRevenue: monthlyRevenueArr[0]?.total || 0,
                pendingBills: await Bill.countDocuments({ paymentStatus: { $ne: 'paid' } }),
                bedOccupancyRate: occupancyRate,
                lowStockAlerts: await Inventory.countDocuments({ quantity: { $lt: 10 } })
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Audit Logs
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Audit retrieval failed' });
    }
};

// @desc    Update User Status (RBAC Control)
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Identity not found' });

        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
        await user.save();

        // Log the action
        await AuditLog.create({
            actor: req.user?._id || user._id, // Fallback if no auth middleware yet
            action: 'STATUS_TOGGLE',
            target: `User: ${user.email}`,
            details: { newStatus: user.status }
        });

        res.json({ success: true, status: user.status });
    } catch (error) {
        res.status(500).json({ message: 'Status toggle failed' });
    }
};

// @desc    System Settings
exports.getSettings = async (req, res) => {
    try {
        let settings = await HospitalSettings.findOne();
        if (!settings) settings = await HospitalSettings.create({});
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Settings retrieval failed' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const settings = await HospitalSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Settings update failed' });
    }
};

// @desc    Inventory Management
exports.getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find().sort({ quantity: 1 });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: 'Inventory retrieval failed' });
    }
};
