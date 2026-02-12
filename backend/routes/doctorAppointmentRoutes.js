const express = require('express');
const router = express.Router();
const {
    getDoctorAppointments,
    acceptAppointment,
    rejectAppointment,
    completeAppointment
} = require('../controllers/doctorAppointmentController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getDoctorAppointments);
router.put('/:id/accept', authorize('Doctor'), acceptAppointment);
router.put('/:id/reject', authorize('Doctor'), rejectAppointment);
router.put('/:id/complete', authorize('Doctor'), completeAppointment);

module.exports = router;
