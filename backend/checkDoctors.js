// Quick script to check doctors in database
const mongoose = require('mongoose');
require('dotenv').config();

const Doctor = require('./models/Doctor');
const User = require('./models/User');

const checkDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const doctors = await Doctor.find().populate('user');
        const doctorUsers = await User.find({ role: 'Doctor' });

        console.log(`\n📊 Database Status:`);
        console.log(`   Doctor Profiles: ${doctors.length}`);
        console.log(`   Doctor Users: ${doctorUsers.length}`);
        console.log('');

        if (doctors.length > 0) {
            console.log('👨‍⚕️ Doctors in System:');
            console.log('===================');
            doctors.forEach((doc, i) => {
                console.log(`${i + 1}. ${doc.name} - ${doc.specialization} ($${doc.consultationFee})`);
            });
        } else {
            console.log('❌ No doctors found in database');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDoctors();
