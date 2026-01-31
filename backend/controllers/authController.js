const { createClerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });


// @desc    Get user profile (Synced with Clerk)
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    // req.user is already populated by the protect middleware
    if (req.user) {
        res.json({
            _id: req.user._id,
            clerkId: req.user.clerkId,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete user account and profile
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = user._id;

        // 1. Delete platform-wide user-linked data
        const Booking = require('../models/Booking');
        const Notification = require('../models/Notification');
        const Payment = require('../models/Payment');
        const Bed = require('../models/Bed');

        // Handle active bookings - free the bed
        const userBookings = await Booking.find({ user: userId });
        for (const booking of userBookings) {
            if (booking.bed) {
                await Bed.findByIdAndUpdate(booking.bed, { status: 'Available', patient: null });
            }
        }
        await Booking.deleteMany({ user: userId });
        await Notification.deleteMany({ user: userId });
        await Payment.deleteMany({ user: userId });

        // 2. Handle Role-Specific Profiles and Data
        if (user.role === 'Patient') {
            const Patient = require('../models/Patient');
            const Appointment = require('../models/Appointment');
            const MedicalRecord = require('../models/MedicalRecord');
            const LabReport = require('../models/LabReport');
            const Bill = require('../models/Bill');
            const Prescription = require('../models/Prescription');
            const Admission = require('../models/Admission');

            const patient = await Patient.findOne({ user: userId });
            if (patient) {
                const patientId = patient._id;

                // Free bed if admitted
                const activeAdmission = await Admission.findOne({ patient: patientId, status: 'Admitted' });
                if (activeAdmission && activeAdmission.bed) {
                    await Bed.findByIdAndUpdate(activeAdmission.bed, { status: 'Available', patient: null });
                }

                // Delete all data linked to the patient
                await Appointment.deleteMany({ patient: patientId });
                await MedicalRecord.deleteMany({ patient: patientId });
                await LabReport.deleteMany({ patient: patientId });
                await Bill.deleteMany({ patient: patientId });
                await Prescription.deleteMany({ patient: patientId });
                await Admission.deleteMany({ patient: patientId });

                // Finally delete the patient profile
                await Patient.findByIdAndDelete(patientId);
            }
        } else if (user.role === 'Doctor') {
            const Doctor = require('../models/Doctor');
            const Appointment = require('../models/Appointment');
            const MedicalRecord = require('../models/MedicalRecord');
            const LabReport = require('../models/LabReport');
            const Prescription = require('../models/Prescription');

            const doctor = await Doctor.findOne({ user: userId });
            if (doctor) {
                const doctorId = doctor._id;
                // Delete all data linked to the doctor
                await Appointment.deleteMany({ doctor: doctorId });
                await MedicalRecord.deleteMany({ doctor: doctorId });
                await LabReport.deleteMany({ doctor: doctorId });
                await Prescription.deleteMany({ doctor: doctorId });

                // Finally delete the doctor profile
                await Doctor.findByIdAndDelete(doctorId);
            }
        }

        // 3. Delete the User from Clerk
        let clerkUserId = user.clerkId;

        // Fallback: If clerkId is missing in DB, try to find it in Clerk by email
        if (!clerkUserId && user.email) {
            console.log(`Clerk ID missing for ${user.email}, attempting fallback lookup...`);
            try {
                const clerkUsers = await clerkClient.users.getUserList({ emailAddress: [user.email] });
                if (clerkUsers && clerkUsers.length > 0) {
                    clerkUserId = clerkUsers[0].id;
                    console.log(`Found Clerk ID via fallback: ${clerkUserId}`);
                }
            } catch (lookupError) {
                console.error('Fallback Clerk lookup failed:', lookupError.message);
            }
        }

        if (clerkUserId) {
            try {
                await clerkClient.users.deleteUser(clerkUserId);
                console.log(`User ${clerkUserId} successfully deleted from Clerk`);
            } catch (clerkError) {
                console.error(`Clerk User Deletion Error for ${clerkUserId}:`, clerkError.message);
                // Continue with local deletion even if Clerk deletion fails
            }
        } else {
            console.warn(`No Clerk ID found for user ${user.email}, skipping Clerk-side deletion.`);
        }

        // 4. Delete the User record from MongoDB
        await User.findByIdAndDelete(userId);
        console.log(`User ${userId} (${user.email}) deleted from MongoDB`);



        res.json({ message: 'User account and all associated data deleted successfully' });
    } catch (error) {
        console.error('Account Deletion Error:', error);
        res.status(500).json({ message: 'Server error during account deletion' });
    }
};


module.exports = { getUserProfile, deleteAccount };
