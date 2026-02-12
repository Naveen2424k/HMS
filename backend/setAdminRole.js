// Quick script to set a user's role to Admin
// Run this with: node setAdminRole.js <email>

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const setAdminRole = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User with email ${email} not found`);
            process.exit(1);
        }

        user.role = 'Admin';
        await user.save();

        console.log(`✅ User ${user.name} (${user.email}) role updated to Admin`);
        console.log(`User ID: ${user._id}`);
        console.log(`Clerk ID: ${user.clerkId}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

const email = process.argv[2];

if (!email) {
    console.log('Usage: node setAdminRole.js <email>');
    console.log('Example: node setAdminRole.js admin@hospital.com');
    process.exit(1);
}

setAdminRole(email);
