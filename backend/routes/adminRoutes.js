const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getAdminDashboard,
    getAuditLogs,
    toggleUserStatus,
    getSettings,
    updateSettings
} = require('../controllers/adminController');

router.use(protect);
router.use(admin);

router.get('/dashboard', getAdminDashboard);
router.get('/audit-logs', getAuditLogs);
router.patch('/users/:id/status', toggleUserStatus);

router.route('/settings')
    .get(getSettings)
    .put(updateSettings);

module.exports = router;
