const mongoose = require('mongoose');
const User = require('../backend/models/User');
require('dotenv').config({ path: './backend/.env' });

const updateUserRole = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // CHANGE THIS EMAIL to the user you want to update
        const targetEmail = 'naveen@example.com';
        // CHANGE THIS ROLE to 'Doctor', 'Admin', 'Receptionist', etc.
        const newRole = 'Doctor';

        const user = await User.findOne({ email: targetEmail });

        if (!user) {
            console.log(`User with email ${targetEmail} not found!`);
            console.log('Please log in once via the website to create your account first.');
            process.exit(1);
        }

        user.role = newRole;
        await user.save();

        console.log(`SUCCESS: Updated ${user.name} (${user.email}) to role: ${newRole}`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateUserRole();
