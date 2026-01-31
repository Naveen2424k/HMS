const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Dashboard overview statistics
router.get('/dashboard-stats', protect, analyticsController.getDashboardStats);

// Revenue analytics
router.get('/revenue', protect, analyticsController.getRevenueAnalytics);

// Appointment analytics
router.get('/appointments', protect, analyticsController.getAppointmentAnalytics);

// Doctor performance
router.get('/doctor-performance', protect, analyticsController.getDoctorPerformance);

// Patient analytics
router.get('/patients', protect, analyticsController.getPatientAnalytics);

// Department analytics
router.get('/departments', protect, analyticsController.getDepartmentAnalytics);

// Export reports
router.get('/export', protect, analyticsController.exportReport);

module.exports = router;
