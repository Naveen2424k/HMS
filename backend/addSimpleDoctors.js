// Simple script to add doctors WITHOUT Clerk (for testing)
// Matches the schema in backend/models/Doctor.js
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Doctor = require('./models/Doctor');

const simpleDoctors = [
    {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@hospital.com',
        specialization: 'Cardiology',
        experience: 15,
        fees: 150,
        availability: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00' },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
            { day: 'Friday', startTime: '09:00', endTime: '17:00' }
        ]
    },
    {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@hospital.com',
        specialization: 'Neurology',
        experience: 12,
        fees: 180,
        availability: [
            { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
            { day: 'Thursday', startTime: '10:00', endTime: '18:00' }
        ]
    },
    {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        specialization: 'Pediatrics',
        experience: 10,
        fees: 120,
        availability: [
            { day: 'Monday', startTime: '08:00', endTime: '16:00' },
            { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
            { day: 'Friday', startTime: '08:00', endTime: '16:00' }
        ]
    }
];

const addSimpleDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        let added = 0;
        let skipped = 0;

        for (const docData of simpleDoctors) {
            // Check if user already exists
            let user = await User.findOne({ email: docData.email });

            if (!user) {
                user = await User.create({
                    name: docData.name,
                    email: docData.email,
                    role: 'Doctor',
                    clerkId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                });
                console.log(`👤 Created user: ${docData.name}`);
            }

            // Check if doctor profile already exists
            const existingDoctor = await Doctor.findOne({ user: user._id });
            if (existingDoctor) {
                console.log(`⏭️  Skipped: Doctor profile for ${docData.name} already exists`);
                skipped++;
                continue;
            }

            // Create doctor profile
            await Doctor.create({
                user: user._id,
                specialization: docData.specialization,
                experience: docData.experience,
                fees: docData.fees,
                availability: docData.availability
            });

            console.log(`✅ Added Doctor Profile: ${docData.name} - ${docData.specialization}`);
            added++;
        }

        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Added: ${added}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`\n🎉 Done!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

addSimpleDoctors();
