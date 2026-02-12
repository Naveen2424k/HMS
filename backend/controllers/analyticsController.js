const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const LabReport = require('../models/LabReport');
const Prescription = require('../models/Prescription');
const Department = require('../models/Department');
const Ward = require('../models/Ward');
const Bed = require('../models/Bed');
const Inventory = require('../models/Inventory');

// Get dashboard overview statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Today's appointments
        const todayAppointments = await Appointment.countDocuments({
            date: { $gte: today, $lt: tomorrow }
        });

        // Total Counts
        const totalPatients = await Patient.countDocuments();
        const totalDoctors = await Doctor.countDocuments();
        const totalDepartments = await Department.countDocuments();

        // Today's revenue
        const todayRevenue = await Payment.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    paidAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Pending bills
        const pendingBills = await Bill.countDocuments({
            paymentStatus: { $in: ['pending', 'partial'] }
        });

        // Upcoming appointments (next 7 days)
        const next7Days = new Date(today);
        next7Days.setDate(next7Days.getDate() + 7);
        const upcomingAppointments = await Appointment.countDocuments({
            date: { $gte: today, $lt: next7Days },
            status: { $in: ['scheduled', 'confirmed'] }
        });

        // Bed Occupancy
        const totalBeds = await Bed.countDocuments();
        const occupiedBeds = await Bed.countDocuments({ isOccupied: true });

        // Low Stock Items
        const lowStockItems = await Inventory.countDocuments({ quantity: { $lt: 10 } });

        // Department Load (Doctors per department)
        const departmentLoad = await Doctor.aggregate([
            {
                $group: {
                    _id: '$specialization',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            stats: {
                todayAppointments,
                totalPatients,
                totalDoctors,
                totalDepartments,
                todayRevenue: todayRevenue[0]?.total || 0,
                pendingBills,
                upcomingAppointments,
                bedOccupancy: totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0,
                totalBeds,
                occupiedBeds,
                lowStockItems,
                departmentLoad
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;

        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
        const end = endDate ? new Date(endDate) : new Date();

        let dateFormat;
        switch (groupBy) {
            case 'month':
                dateFormat = '%Y-%m';
                break;
            case 'year':
                dateFormat = '%Y';
                break;
            default:
                dateFormat = '%Y-%m-%d';
        }

        const revenueData = await Payment.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    paidAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: '$paidAt' } },
                    totalRevenue: { $sum: '$amount' },
                    transactionCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Revenue by payment method
        const revenueByMethod = await Payment.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    paidAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: '$paymentMethod',
                    totalRevenue: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Total revenue
        const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);

        res.json({
            success: true,
            totalRevenue,
            revenueData,
            revenueByMethod
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get appointment analytics
exports.getAppointmentAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
        const end = endDate ? new Date(endDate) : new Date();

        // Appointments by status
        const appointmentsByStatus = await Appointment.aggregate([
            {
                $match: {
                    date: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Appointments by department
        const appointmentsByDepartment = await Appointment.aggregate([
            {
                $match: {
                    date: { $gte: start, $lte: end }
                }
            },
            {
                $lookup: {
                    from: 'doctors',
                    localField: 'doctor',
                    foreignField: '_id',
                    as: 'doctorInfo'
                }
            },
            { $unwind: '$doctorInfo' },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'doctorInfo.department',
                    foreignField: '_id',
                    as: 'departmentInfo'
                }
            },
            { $unwind: '$departmentInfo' },
            {
                $group: {
                    _id: '$departmentInfo.name',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Daily appointment trend
        const dailyTrend = await Appointment.aggregate([
            {
                $match: {
                    date: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            appointmentsByStatus,
            appointmentsByDepartment,
            dailyTrend
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get doctor performance analytics
exports.getDoctorPerformance = async (req, res) => {
    try {
        const { startDate, endDate, doctorId } = req.query;

        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
        const end = endDate ? new Date(endDate) : new Date();

        let matchQuery = {
            date: { $gte: start, $lte: end }
        };

        if (doctorId) {
            matchQuery.doctor = doctorId;
        }

        const doctorStats = await Appointment.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$doctor',
                    totalAppointments: { $sum: 1 },
                    completedAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    cancelledAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'doctors',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'doctorInfo'
                }
            },
            { $unwind: '$doctorInfo' },
            {
                $project: {
                    doctorName: '$doctorInfo.name',
                    specialization: '$doctorInfo.specialization',
                    totalAppointments: 1,
                    completedAppointments: 1,
                    cancelledAppointments: 1,
                    completionRate: {
                        $multiply: [
                            { $divide: ['$completedAppointments', '$totalAppointments'] },
                            100
                        ]
                    }
                }
            },
            { $sort: { totalAppointments: -1 } }
        ]);

        res.json({
            success: true,
            doctorStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get patient analytics
exports.getPatientAnalytics = async (req, res) => {
    try {
        // New patients this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newPatientsThisMonth = await Patient.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        // Patients by age group
        const patientsByAge = await Patient.aggregate([
            {
                $project: {
                    ageGroup: {
                        $switch: {
                            branches: [
                                { case: { $lt: ['$age', 18] }, then: '0-17' },
                                { case: { $lt: ['$age', 30] }, then: '18-29' },
                                { case: { $lt: ['$age', 45] }, then: '30-44' },
                                { case: { $lt: ['$age', 60] }, then: '45-59' },
                                { case: { $gte: ['$age', 60] }, then: '60+' }
                            ],
                            default: 'Unknown'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$ageGroup',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Patients by gender
        const patientsByGender = await Patient.aggregate([
            {
                $group: {
                    _id: '$gender',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Patient growth trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const patientGrowth = await Patient.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            newPatientsThisMonth,
            patientsByAge,
            patientsByGender,
            patientGrowth
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get department analytics
exports.getDepartmentAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
        const end = endDate ? new Date(endDate) : new Date();

        // Revenue by department
        const departmentRevenue = await Bill.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    paymentStatus: 'paid'
                }
            },
            {
                $lookup: {
                    from: 'appointments',
                    localField: 'appointment',
                    foreignField: '_id',
                    as: 'appointmentInfo'
                }
            },
            { $unwind: '$appointmentInfo' },
            {
                $lookup: {
                    from: 'doctors',
                    localField: 'appointmentInfo.doctor',
                    foreignField: '_id',
                    as: 'doctorInfo'
                }
            },
            { $unwind: '$doctorInfo' },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'doctorInfo.department',
                    foreignField: '_id',
                    as: 'departmentInfo'
                }
            },
            { $unwind: '$departmentInfo' },
            {
                $group: {
                    _id: '$departmentInfo.name',
                    totalRevenue: { $sum: '$totalAmount' },
                    patientCount: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        res.json({
            success: true,
            departmentRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export report data
exports.exportReport = async (req, res) => {
    try {
        const { reportType, startDate, endDate, format = 'json' } = req.query;

        const start = new Date(startDate);
        const end = new Date(endDate);

        let data;

        switch (reportType) {
            case 'revenue':
                data = await Payment.find({
                    paymentStatus: 'completed',
                    paidAt: { $gte: start, $lte: end }
                }).populate('patient', 'name email phone');
                break;

            case 'appointments':
                data = await Appointment.find({
                    date: { $gte: start, $lte: end }
                }).populate('patient doctor');
                break;

            case 'patients':
                data = await Patient.find({
                    createdAt: { $gte: start, $lte: end }
                });
                break;

            default:
                return res.status(400).json({ message: 'Invalid report type' });
        }

        // In production, you can convert to CSV/Excel/PDF here
        if (format === 'csv') {
            // Convert to CSV format
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=${reportType}_report.csv`);
            // CSV conversion logic here
        }

        res.json({
            success: true,
            reportType,
            dateRange: { start, end },
            recordCount: data.length,
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = exports;
