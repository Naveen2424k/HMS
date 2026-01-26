const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

dotenv.config();

const sampleDoctors = [
    {
        name: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@medicare.com',
        password: 'password123',
        specialization: 'Cardiologist',
        experience: 12,
        fees: 150,
        availability: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00' },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
            { day: 'Friday', startTime: '09:00', endTime: '13:00' }
        ]
    },
    {
        name: 'Dr. James Chen',
        email: 'james.chen@medicare.com',
        password: 'password123',
        specialization: 'Neurologist',
        experience: 15,
        fees: 200,
        availability: [
            { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
            { day: 'Thursday', startTime: '10:00', endTime: '18:00' }
        ]
    },
    {
        name: 'Dr. Emily Brooks',
        email: 'emily.brooks@medicare.com',
        password: 'password123',
        specialization: 'Pediatrician',
        experience: 8,
        fees: 100,
        availability: [
            { day: 'Monday', startTime: '08:00', endTime: '16:00' },
            { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
            { day: 'Wednesday', startTime: '08:00', endTime: '16:00' },
            { day: 'Thursday', startTime: '08:00', endTime: '16:00' },
            { day: 'Friday', startTime: '08:00', endTime: '16:00' }
        ]
    },
    {
        name: 'Dr. Michael Chang',
        email: 'michael.chang@medicare.com',
        password: 'password123',
        specialization: 'Orthopedic',
        experience: 20,
        fees: 180,
        availability: [
            { day: 'Monday', startTime: '13:00', endTime: '19:00' },
            { day: 'Wednesday', startTime: '13:00', endTime: '19:00' },
            { day: 'Friday', startTime: '13:00', endTime: '19:00' }
        ]
    },
    {
        name: 'Dr. Olivia Martinez',
        email: 'olivia.martinez@medicare.com',
        password: 'password123',
        specialization: 'Dermatologist',
        experience: 10,
        fees: 120,
        availability: [
            { day: 'Tuesday', startTime: '09:00', endTime: '15:00' },
            { day: 'Thursday', startTime: '09:00', endTime: '15:00' },
            { day: 'Saturday', startTime: '10:00', endTime: '14:00' }
        ]
    },
    {
        name: 'Dr. Robert Sullivan',
        email: 'robert.sullivan@medicare.com',
        password: 'password123',
        specialization: 'General Physician',
        experience: 25,
        fees: 80,
        availability: [
            { day: 'Monday', startTime: '08:00', endTime: '12:00' },
            { day: 'Tuesday', startTime: '08:00', endTime: '12:00' },
            { day: 'Wednesday', startTime: '08:00', endTime: '12:00' },
            { day: 'Thursday', startTime: '08:00', endTime: '12:00' },
            { day: 'Friday', startTime: '08:00', endTime: '12:00' }
        ]
    }
];

const seedDoctors = async () => {
    try {
        await connectDB();

        console.log('Seeding doctors...');

        for (const doc of sampleDoctors) {
            // Check if user already exists
            let user = await User.findOne({ email: doc.email });

            if (!user) {
                user = await User.create({
                    name: doc.name,
                    email: doc.email,
                    password: doc.password,
                    role: 'Doctor'
                });
                console.log(`Created user: ${doc.name}`);
            } else {
                console.log(`User already exists: ${doc.name}`);
            }

            // Check if doctor profile exists
            const doctorExists = await Doctor.findOne({ user: user._id });

            if (!doctorExists) {
                await Doctor.create({
                    user: user._id,
                    specialization: doc.specialization,
                    experience: doc.experience,
                    fees: doc.fees,
                    availability: doc.availability
                });
                console.log(`Created doctor profile for: ${doc.name}`);
            } else {
                console.log(`Doctor profile already exists for: ${doc.name}`);
            }
        }

        console.log('Doctors seeding completed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDoctors();
