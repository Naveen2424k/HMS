// Script to add sample doctors to the database
// Run this with: node addDoctors.js

const mongoose = require('mongoose');
const { createClerkClient } = require('@clerk/clerk-sdk-node');
require('dotenv').config();

const User = require('./models/User');
const Doctor = require('./models/Doctor');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const sampleDoctors = [
    {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@hospital.com',
        password: 'Doctor@123',
        specialization: 'Cardiology',
        phone: '+1-555-0101',
        experience: 15,
        qualification: 'MD, FACC',
        department: 'Cardiology',
        consultationFee: 150
    },
    {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@hospital.com',
        password: 'Doctor@123',
        specialization: 'Neurology',
        phone: '+1-555-0102',
        experience: 12,
        qualification: 'MD, PhD',
        department: 'Neurology',
        consultationFee: 180
    },
    {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        password: 'Doctor@123',
        specialization: 'Pediatrics',
        phone: '+1-555-0103',
        experience: 10,
        qualification: 'MD, FAAP',
        department: 'Pediatrics',
        consultationFee: 120
    },
    {
        name: 'Dr. James Wilson',
        email: 'james.wilson@hospital.com',
        password: 'Doctor@123',
        specialization: 'Orthopedics',
        phone: '+1-555-0104',
        experience: 18,
        qualification: 'MD, FAAOS',
        department: 'Orthopedics',
        consultationFee: 160
    },
    {
        name: 'Dr. Priya Patel',
        email: 'priya.patel@hospital.com',
        password: 'Doctor@123',
        specialization: 'Dermatology',
        phone: '+1-555-0105',
        experience: 8,
        qualification: 'MD, FAAD',
        department: 'Dermatology',
        consultationFee: 130
    }
];

const addDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        console.log('');
        console.log('👨‍⚕️ Adding Sample Doctors...');
        console.log('=========================');
        console.log('');

        let addedCount = 0;
        let skippedCount = 0;

        for (const doctorData of sampleDoctors) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ email: doctorData.email });

                if (existingUser) {
                    console.log(`⏭️  Skipped: ${doctorData.name} (already exists)`);
                    skippedCount++;
                    continue;
                }

                // 1. Create user in Clerk
                const clerkUser = await clerkClient.users.createUser({
                    emailAddress: [doctorData.email],
                    password: doctorData.password,
                    firstName: doctorData.name.split(' ')[1],
                    lastName: doctorData.name.split(' ').slice(2).join(' '),
                    publicMetadata: { role: 'Doctor' }
                });

                // 2. Create user in MongoDB
                const user = await User.create({
                    clerkId: clerkUser.id,
                    name: doctorData.name,
                    email: doctorData.email,
                    role: 'Doctor'
                });

                // 3. Create doctor profile
                const doctor = await Doctor.create({
                    user: user._id,
                    name: doctorData.name,
                    email: doctorData.email,
                    phone: doctorData.phone,
                    specialization: doctorData.specialization,
                    department: doctorData.department,
                    qualification: doctorData.qualification,
                    experience: doctorData.experience,
                    consultationFee: doctorData.consultationFee,
                    availability: {
                        monday: { available: true, slots: ['09:00-12:00', '14:00-17:00'] },
                        tuesday: { available: true, slots: ['09:00-12:00', '14:00-17:00'] },
                        wednesday: { available: true, slots: ['09:00-12:00', '14:00-17:00'] },
                        thursday: { available: true, slots: ['09:00-12:00', '14:00-17:00'] },
                        friday: { available: true, slots: ['09:00-12:00', '14:00-17:00'] },
                        saturday: { available: true, slots: ['09:00-13:00'] },
                        sunday: { available: false, slots: [] }
                    }
                });

                console.log(`✅ Added: ${doctorData.name} - ${doctorData.specialization}`);
                addedCount++;

            } catch (error) {
                console.error(`❌ Failed to add ${doctorData.name}:`, error.message);
            }
        }

        console.log('');
        console.log('📊 Summary:');
        console.log(`   ✅ Added: ${addedCount} doctors`);
        console.log(`   ⏭️  Skipped: ${skippedCount} doctors`);
        console.log('');
        console.log('🎉 Done! Doctors are ready for appointments.');
        console.log('');
        console.log('📝 Default Password: Doctor@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

console.log('👨‍⚕️ Doctor Seeding Script');
console.log('======================');
console.log('');

addDoctors();
