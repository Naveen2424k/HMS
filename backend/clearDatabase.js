// Script to clear all data from MongoDB database
// WARNING: This will delete ALL data except your admin user
// Run this with: node clearDatabase.js

const mongoose = require('mongoose');
require('dotenv').config();

const clearDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        console.log('');

        // Get all collections
        const collections = await mongoose.connection.db.collections();

        console.log('📋 Found collections:');
        collections.forEach(collection => {
            console.log(`   - ${collection.collectionName}`);
        });
        console.log('');

        // Ask for confirmation
        console.log('⚠️  WARNING: This will delete ALL data from the database!');
        console.log('⚠️  Only your admin user will be preserved.');
        console.log('');

        // Get admin email from command line or use default
        const adminEmail = process.argv[2] || 'knaveenkumar2424@gmail.com';

        let deletedCount = 0;
        let preservedUser = null;

        // Clear each collection
        for (const collection of collections) {
            const collectionName = collection.collectionName;

            if (collectionName === 'users') {
                // Preserve admin user, delete others
                const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
                preservedUser = await User.findOne({ email: adminEmail });
                const result = await User.deleteMany({ email: { $ne: adminEmail } });
                console.log(`🔒 Users: Deleted ${result.deletedCount}, preserved admin (${adminEmail})`);
                deletedCount += result.deletedCount;
            } else {
                // Delete all documents from other collections
                const result = await collection.deleteMany({});
                console.log(`🗑️  ${collectionName}: Deleted ${result.deletedCount} documents`);
                deletedCount += result.deletedCount;
            }
        }

        console.log('');
        console.log('✅ Database cleared successfully!');
        console.log(`📊 Total documents deleted: ${deletedCount}`);

        if (preservedUser) {
            console.log('');
            console.log('👤 Preserved Admin User:');
            console.log(`   Name: ${preservedUser.name}`);
            console.log(`   Email: ${preservedUser.email}`);
            console.log(`   Role: ${preservedUser.role}`);
        }

        console.log('');
        console.log('🎉 Database is now clean and ready!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

console.log('🧹 Database Cleanup Script');
console.log('=========================');
console.log('');

clearDatabase();
