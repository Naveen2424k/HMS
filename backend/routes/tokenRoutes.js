const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');
const { protect } = require('../middleware/authMiddleware');

// Generate token for appointment
router.post('/generate', protect, tokenController.generateToken);

// Get queue status
router.get('/queue-status', tokenController.getQueueStatus);

// Call next patient
router.post('/call-next', protect, tokenController.callNextPatient);

// Get my token status
router.get('/my-token', protect, tokenController.getMyToken);

// Update token status
router.put('/:tokenId/status', protect, tokenController.updateTokenStatus);

// Get today's statistics
router.get('/stats/today', protect, tokenController.getTodayStats);

module.exports = router;
