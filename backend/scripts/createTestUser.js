const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const createTestUsers = async () => {
    try {
        await connectDB();

        // Clear existing users (optional - comment out if you want to keep existing users)
        // await User.deleteMany({});

        const users = [
            {
                name: 'Admin User',
                email: 'admin@hospital.com',
                password: 'admin123',
                role: 'Admin'
            },
            {
                name: 'Dr. John Smith',
                email: 'doctor@hospital.com',
                password: 'doctor123',
                role: 'Doctor'
            },
            {
                name: 'Jane Receptionist',
                email: 'receptionist@hospital.com',
                password: 'reception123',
                role: 'Receptionist'
            },
            {
                name: 'Patient Test',
                email: 'patient@hospital.com',
                password: 'patient123',
                role: 'Patient'
            }
        ];

        for (const userData of users) {
            const userExists = await User.findOne({ email: userData.email });
            if (!userExists) {
                const user = await User.create(userData);
                console.log(`✅ Created user: ${user.name} (${user.email}) - Role: ${user.role}`);
            } else {
                console.log(`⚠️  User already exists: ${userData.email}`);
            }
        }

        console.log('\n🎉 Test users created successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Admin:        admin@hospital.com / admin123');
        console.log('Doctor:       doctor@hospital.com / doctor123');
        console.log('Receptionist: receptionist@hospital.com / reception123');
        console.log('Patient:      patient@hospital.com / patient123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test users:', error.message);
        process.exit(1);
    }
};

createTestUsers();
