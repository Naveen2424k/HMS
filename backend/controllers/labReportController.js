const LabReport = require('../models/LabReport');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

// @desc    Get lab reports
// @route   GET /api/lab-reports
// @access  Private
const getLabReports = async (req, res) => {
    // ... existing implementation ...
    let reports;
    if (req.user.role === 'Admin' || req.user.role === 'Receptionist') {
        reports = await LabReport.find()
            .populate({ path: 'patient', populate: { path: 'user', select: 'name' } })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    } else if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        reports = await LabReport.find({ doctor: doctor._id })
            .populate({ path: 'patient', populate: { path: 'user', select: 'name' } });
    } else {
        const patient = await Patient.findOne({ user: req.user._id });
        reports = await LabReport.find({ patient: patient._id })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    }
    res.json(reports);
};

// ... existing requestLabTest ...
// @desc    Request a lab test (Doctor)
// @route   POST /api/lab-reports
// @access  Private/Doctor
const requestLabTest = async (req, res) => {
    const { patientId, testName } = req.body;
    const doctor = await Doctor.findOne({ user: req.user._id });

    const report = await LabReport.create({
        patient: patientId,
        doctor: doctor._id,
        testName,
    });

    res.status(201).json(report);
};

// @desc    Upload test result (Admin)
// @route   PUT /api/lab-reports/:id
// @access  Private/Admin
const uploadLabResult = async (req, res) => {
    const { testResult, reportFile } = req.body;
    const report = await LabReport.findById(req.params.id);

    if (report) {
        report.testResult = testResult || report.testResult;
        report.reportFile = reportFile || report.reportFile;
        report.status = 'Completed';

        const updatedReport = await report.save();

        // Send Notifications if completed
        if (updatedReport.status === 'Completed') {
            const fullReport = await LabReport.findById(updatedReport._id).populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email' }
            });

            if (fullReport && fullReport.patient) {
                const reportData = {
                    patientEmail: fullReport.patient.user.email,
                    patientName: fullReport.patient.user.name,
                    patientPhone: fullReport.patient.phone,
                    testName: fullReport.testName,
                    reportDate: new Date(),
                    reportId: fullReport._id
                };

                emailService.sendLabReportNotification(reportData).catch(err => console.error(err));
                smsService.sendLabReportReadySMS(reportData).catch(err => console.error(err));
            }
        }

        res.json(updatedReport);
    } else {
        res.status(404).json({ message: 'Lab report not found' });
    }
};

module.exports = { getLabReports, requestLabTest, uploadLabResult };
