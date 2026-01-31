const express = require('express');
const router = express.Router();
const { admitPatient, dischargePatient, getOccupancy } = require('../controllers/ipdController');
const { bookBed, getMyBooking, cancelBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/occupancy').get(protect, getOccupancy);
router.route('/admit').post(protect, admitPatient);
router.route('/discharge/:id').put(protect, dischargePatient);

// Use new routes
router.route('/book-bed').post(protect, bookBed);
router.route('/my-booking').get(protect, getMyBooking);
router.route('/cancel-booking').delete(protect, cancelBooking);

module.exports = router;
