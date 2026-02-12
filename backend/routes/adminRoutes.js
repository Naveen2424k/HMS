const express = require('express');
const router = express.Router();
const { protect, admin, authorize } = require('../middleware/authMiddleware');
const {
    getAdminDashboard,
    getAuditLogs,
    toggleUserStatus,
    getSettings,
    updateSettings,
    getInventory
} = require('../controllers/adminController');

router.use(protect);

// Allow Receptionist to see stats for their dashboard too
router.get('/dashboard', authorize('Admin', 'Receptionist'), getAdminDashboard);

// Keep these strictly for Admin
router.get('/audit-logs', admin, getAuditLogs);
router.get('/inventory', admin, getInventory);
router.patch('/users/:id/status', admin, toggleUserStatus);

router.route('/settings')
    .get(admin, getSettings)
    .put(admin, updateSettings);

module.exports = router;
