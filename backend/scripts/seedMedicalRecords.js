const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');

dotenv.config();

const sampleRecords = [
    {
        diagnosis: 'Acute Bronchitis',
        prescription: 'Amoxicillin 500mg - 1 tablet 3 times a day for 7 days.\nAcetaminophen 500mg - 1 tablet every 6 hours for fever.\nDrink plenty of fluids.',
        dateOffset: 2 // days ago
    },
    {
        diagnosis: 'Hypertension (Stage 1)',
        prescription: 'Lisinopril 10mg - 1 tablet daily.\nMonitor blood pressure daily.\nLow sodium diet recommended.',
        dateOffset: 15
    },
    {
        diagnosis: 'Seasonal Allergies',
        prescription: 'Cetirizine 10mg - 1 tablet daily.\nFluticasone propionate nasal spray - 2 sprays per nostril daily.',
        dateOffset: 4
    }
];

const seedMedicalRecords = async () => {
    try {
        await connectDB();
        console.log('Seeding medical records...');

        // Get a doctor
        const doctor = await Doctor.findOne().populate('user');
        if (!doctor) {
            console.error('No doctors found. Please run seedDoctors.js first.');
            process.exit(1);
        }

        // Get a patient
        let patient = await Patient.findOne().populate('user');
        if (!patient) {
            // Find a user with role Patient to create a profile if none exists
            const patientUser = await User.findOne({ role: 'Patient' });
            if (patientUser) {
                patient = await Patient.create({
                    user: patientUser._id,
                    age: 30,
                    gender: 'Male',
                    phone: '555-0123'
                });
            } else {
                console.error('No patients found. Please register a patient or create one.');
                process.exit(1);
            }
        }

        console.log(`Using Doctor: ${doctor.user.name}`);
        console.log(`Using Patient: ${patient.user.name || 'Unknown'}`);

        for (const rec of sampleRecords) {
            const date = new Date();
            date.setDate(date.getDate() - rec.dateOffset);

            await MedicalRecord.create({
                patient: patient._id,
                doctor: doctor._id,
                diagnosis: rec.diagnosis,
                prescription: rec.prescription,
                date: date
            });
            console.log(`Created record: ${rec.diagnosis}`);
        }

        console.log('Medical records seeding completed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedMedicalRecords();
