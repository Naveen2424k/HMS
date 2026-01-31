const Token = require('../models/Token');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const smsService = require('../services/smsService');

// Generate token for appointment
exports.generateToken = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId)
            .populate('patient')
            .populate('doctor');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Get today's date range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Get last token number for today
        const lastToken = await Token.findOne({
            date: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ tokenNumber: -1 });

        const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

        // Calculate estimated wait time
        const waitingTokens = await Token.countDocuments({
            doctor: appointment.doctor._id,
            status: 'waiting',
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const estimatedWaitTime = waitingTokens * 15; // 15 minutes per patient

        const token = new Token({
            tokenNumber,
            appointment: appointmentId,
            patient: appointment.patient._id,
            doctor: appointment.doctor._id,
            department: appointment.doctor.department,
            estimatedWaitTime,
            priority: appointment.priority || 'normal'
        });

        await token.save();

        // Send SMS
        if (appointment.patient && appointment.patient.phone) {
            // Get current serving token for context
            const currentServing = await Token.findOne({
                doctor: appointment.doctor._id,
                status: 'in-progress',
                date: { $gte: startOfDay, $lte: endOfDay }
            });

            smsService.sendTokenNumberSMS({
                patientPhone: appointment.patient.phone,
                tokenNumber: token.tokenNumber,
                currentToken: currentServing ? currentServing.tokenNumber : 0,
                estimatedWait: token.estimatedWaitTime
            }).catch(err => console.error(err));
        }

        res.status(201).json({
            success: true,
            token,
            message: `Token ${tokenNumber} generated successfully`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... (getQueueStatus remains same) ...
exports.getQueueStatus = async (req, res) => {
    // ... existing implementation ...
    try {
        const { doctorId, departmentId } = req.query;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let query = {
            date: { $gte: startOfDay, $lte: endOfDay }
        };

        if (doctorId) query.doctor = doctorId;
        if (departmentId) query.department = departmentId;

        const tokens = await Token.find(query)
            .populate('patient', 'name age gender')
            .populate('doctor', 'name specialization')
            .populate('appointment')
            .sort({ tokenNumber: 1 });

        const currentToken = await Token.findOne({
            ...query,
            status: 'in-progress'
        }).populate('patient', 'name');

        const waitingCount = await Token.countDocuments({
            ...query,
            status: 'waiting'
        });

        const completedCount = await Token.countDocuments({
            ...query,
            status: 'completed'
        });

        res.json({
            success: true,
            currentToken: currentToken ? currentToken.tokenNumber : null,
            currentPatient: currentToken ? currentToken.patient.name : null,
            waitingCount,
            completedCount,
            totalTokens: tokens.length,
            tokens
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Call next patient
exports.callNextPatient = async (req, res) => {
    try {
        const { doctorId } = req.body;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Complete current token
        await Token.updateMany(
            {
                doctor: doctorId,
                status: 'in-progress',
                date: { $gte: startOfDay, $lte: endOfDay }
            },
            {
                status: 'completed',
                completionTime: new Date()
            }
        );

        // Get next waiting token (priority first)
        const nextToken = await Token.findOne({
            doctor: doctorId,
            status: 'waiting',
            date: { $gte: startOfDay, $lte: endOfDay }
        })
            .sort({ priority: -1, tokenNumber: 1 })
            .populate('patient', 'name age gender phone') // Added phone
            .populate('appointment');

        if (!nextToken) {
            return res.json({
                success: true,
                message: 'No more patients in queue',
                nextToken: null
            });
        }

        nextToken.status = 'in-progress';
        nextToken.callTime = new Date();
        await nextToken.save();

        // Send SMS
        if (nextToken.patient && nextToken.patient.phone) {
            smsService.sendTokenNumberSMS({
                patientPhone: nextToken.patient.phone,
                tokenNumber: nextToken.tokenNumber,
                currentToken: nextToken.tokenNumber, // It's them!
                estimatedWait: 0
            }).catch(err => console.error(err));
        }

        res.json({
            success: true,
            nextToken,
            message: `Token ${nextToken.tokenNumber} called`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get patient's token status
exports.getMyToken = async (req, res) => {
    try {
        const patientId = req.user.id;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const token = await Token.findOne({
            patient: patientId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['waiting', 'in-progress'] }
        })
            .populate('doctor', 'name specialization')
            .populate('appointment');

        if (!token) {
            return res.json({
                success: true,
                message: 'No active token found',
                token: null
            });
        }

        // Get current serving token
        const currentToken = await Token.findOne({
            doctor: token.doctor._id,
            status: 'in-progress',
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        // Count tokens ahead
        const tokensAhead = await Token.countDocuments({
            doctor: token.doctor._id,
            status: 'waiting',
            tokenNumber: { $lt: token.tokenNumber },
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        res.json({
            success: true,
            token,
            currentServingToken: currentToken ? currentToken.tokenNumber : null,
            tokensAhead,
            estimatedWaitTime: tokensAhead * 15
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update token status
exports.updateTokenStatus = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const { status } = req.body;

        const token = await Token.findById(tokenId);

        if (!token) {
            return res.status(404).json({ message: 'Token not found' });
        }

        token.status = status;

        if (status === 'completed') {
            token.completionTime = new Date();
        } else if (status === 'in-progress') {
            token.callTime = new Date();
        }

        await token.save();

        res.json({
            success: true,
            token,
            message: 'Token status updated'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get today's statistics
exports.getTodayStats = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const stats = await Token.aggregate([
            {
                $match: {
                    date: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalTokens = await Token.countDocuments({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const avgWaitTime = await Token.aggregate([
            {
                $match: {
                    date: { $gte: startOfDay, $lte: endOfDay },
                    status: 'completed',
                    callTime: { $exists: true },
                    checkInTime: { $exists: true }
                }
            },
            {
                $project: {
                    waitTime: {
                        $divide: [
                            { $subtract: ['$callTime', '$checkInTime'] },
                            60000 // Convert to minutes
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgWaitTime: { $avg: '$waitTime' }
                }
            }
        ]);

        res.json({
            success: true,
            totalTokens,
            stats,
            avgWaitTime: avgWaitTime[0]?.avgWaitTime || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
