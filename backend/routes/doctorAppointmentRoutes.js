const express = require('express');
const router = express.Router();
const {
    getDoctorAppointments,
    acceptAppointment,
    rejectAppointment,
    completeAppointment
} = require('../controllers/doctorAppointmentController');

router.get('/', getDoctorAppointments);
router.put('/:id/accept', acceptAppointment);
router.put('/:id/reject', rejectAppointment);
router.put('/:id/complete', completeAppointment);

module.exports = router;
