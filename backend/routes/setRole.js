const express = require('express');
const router = express.Router();
const Clerk = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const clerkClient = Clerk.clerkClient;

router.post('/', async (req, res) => {
    const { userId, role } = req.body;

    const allowedRoles = ['Patient', 'Doctor', 'Receptionist', 'Admin', 'Nurse', 'LabTechnician', 'Pharmacist'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role selection' });
    }

    try {
        // 1. Update Clerk Metadata
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: { role }
        });

        // 2. Sync with MongoDB
        const clerkUser = await clerkClient.users.getUser(userId);
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'Anonymous';
        const email = clerkUser.emailAddresses[0]?.emailAddress;

        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            // Try finding by email for seeded users
            user = await User.findOne({ email });
            if (user) {
                user.clerkId = userId;
                user.role = role;
                await user.save();
            } else {
                user = await User.create({
                    clerkId: userId,
                    name,
                    email,
                    role
                });
            }
        } else {
            user.role = role;
            await user.save();
        }

        // 3. Create Role-Specific Profile if needed
        if (role === 'Doctor') {
            const existingDoctor = await Doctor.findOne({ user: user._id });
            if (!existingDoctor) {
                await Doctor.create({
                    user: user._id,
                    specialization: 'General Physician', // Default
                    experience: 0,
                    fees: 500,
                    availability: []
                });
            }
        } else if (role === 'Patient') {
            const existingPatient = await Patient.findOne({ user: user._id });
            if (!existingPatient) {
                await Patient.create({
                    user: user._id,
                    age: 0,
                    gender: 'Not Specified',
                    phone: clerkUser.phoneNumbers[0]?.phoneNumber || 'Not Provided',
                    bloodGroup: 'Unknown',
                    address: 'Not Provided'
                });
            }
        }

        res.status(200).json({ message: 'Role and Profile sync successful' });
    } catch (error) {
        console.error('Error syncing role:', error);
        res.status(500).json({ error: 'Failed to sync role' });
    }
});

module.exports = router;
