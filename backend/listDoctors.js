// Simple script to verify doctors in database
const mongoose = require('mongoose');
require('dotenv').config();

const Doctor = require('./models/Doctor');

const checkDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        const doctors = await Doctor.find().populate('user');

        console.log(`Total Doctors: ${doctors.length}\n`);

        if (doctors.length > 0) {
            console.log('Doctors List:');
            console.log('=============');
            doctors.forEach((doc, i) => {
                console.log(`${i + 1}. ${doc.name}`);
                console.log(`   Specialization: ${doc.specialization}`);
                console.log(`   Email: ${doc.email}`);
                console.log(`   Fee: $${doc.consultationFee}`);
                console.log(`   User ID: ${doc.user?._id || 'Not linked'}`);
                console.log('');
            });
        } else {
            console.log('❌ No doctors found!');
            console.log('\nRun: node addDoctors.js to add sample doctors');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkDoctors();
