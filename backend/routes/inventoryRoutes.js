const express = require('express');
const router = express.Router();
const { getInventory, addItem, updateStock } = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getInventory).post(protect, addItem);
router.route('/:id/stock').put(protect, updateStock);

module.exports = router;
