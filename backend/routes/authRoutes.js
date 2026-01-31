const express = require('express');
const router = express.Router();
const { getUserProfile, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.delete('/account', protect, deleteAccount);

module.exports = router;

