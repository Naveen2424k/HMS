const mongoose = require('mongoose');
const Ward = require('../models/Ward');
const Bed = require('../models/Bed');
const dotenv = require('dotenv');

dotenv.config();

const seedIPD = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital');
        console.log('Connected to MongoDB for seeding IPD data...');

        // Clear existing
        await Ward.deleteMany({});
        await Bed.deleteMany({});

        const wardData = [
            { name: 'Elite Suite', type: 'Private', floor: 4, capacity: 4, dailyRate: 1200 },
            { name: 'Intensive Sync', type: 'ICU', floor: 2, capacity: 6, dailyRate: 2500 },
            { name: 'Emergency Nexus', type: 'Emergency', floor: 1, capacity: 8, dailyRate: 800 },
            { name: 'General Core', type: 'General', floor: 3, capacity: 12, dailyRate: 400 }
        ];

        for (const w of wardData) {
            const ward = await Ward.create(w);
            console.log(`Created Ward: ${ward.name}`);

            const beds = [];
            for (let i = 1; i <= ward.capacity; i++) {
                beds.push({
                    bedNumber: `${ward.name[0]}${i < 10 ? '0' + i : i}`,
                    ward: ward._id,
                    status: Math.random() > 0.3 ? 'Available' : 'Occupied',
                    pricePerDay: ward.dailyRate
                });
            }
            await Bed.insertMany(beds);
            console.log(`  -> Seeded ${ward.capacity} beds for ${ward.name}`);
        }

        console.log('IPD Seeding Complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedIPD();
