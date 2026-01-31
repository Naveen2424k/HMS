const Booking = require('../models/Booking');
const Bed = require('../models/Bed');
const Ward = require('../models/Ward');

// @desc    Book a bed
// @route   POST /api/ipd/book-bed
// @access  Private
const bookBed = async (req, res) => {
    try {
        const { wardId, bedId, reason } = req.body;
        const userId = req.user._id;

        // Check if user already has an active booking
        const existingBooking = await Booking.findOne({
            user: userId,
            status: 'Confirmed'
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You already have an active booking.' });
        }

        const bed = await Bed.findById(bedId);
        if (!bed) {
            return res.status(404).json({ message: 'Bed not found' });
        }

        if (bed.status !== 'Available') {
            return res.status(400).json({ message: 'Bed is no longer available' });
        }

        // Create booking
        const booking = await Booking.create({
            user: userId,
            ward: wardId,
            bed: bedId,
            admissionReason: reason,
            status: 'Confirmed'
        });

        // Update bed status
        bed.status = 'Occupied';
        bed.patient = userId; // Linking booked bed to user temporarily until formal admission
        await bed.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate('ward')
            .populate('bed');

        res.status(201).json(populatedBooking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's active booking
// @route   GET /api/ipd/my-booking
// @access  Private
const getMyBooking = async (req, res) => {
    try {
        const userId = req.user._id;
        const booking = await Booking.findOne({
            user: userId,
            status: 'Confirmed'
        })
            .populate('ward')
            .populate('bed')
            .sort({ createdAt: -1 });

        if (!booking) {
            // Return null if no booking, handled by frontend
            return res.json(null);
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   DELETE /api/ipd/cancel-booking
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const userId = req.user._id;

        const booking = await Booking.findOne({
            user: userId,
            status: 'Confirmed'
        });

        if (!booking) {
            return res.status(404).json({ message: 'No active booking found' });
        }

        // Release the bed
        const bed = await Bed.findById(booking.bed);
        if (bed) {
            bed.status = 'Available';
            bed.patient = null;
            await bed.save();
        }

        // Delete (or soft delete/update status) the booking
        // Requirement said "Remove booking record", but updating status is safer practice. 
        // However, to follow strict requirement "Remove booking record":
        await Booking.findByIdAndDelete(booking._id);

        res.json({ message: 'Booking cancelled successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookBed,
    getMyBooking,
    cancelBooking
};
