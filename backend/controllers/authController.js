const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const getUserProfile = async (req, res) => {
    let user = req.user;

    // If user not in DB but authenticated via Clerk, create them
    if (!user && req.auth) {
        try {
            const clerkUser = await clerkClient.users.getUser(req.auth.clerkId);
            user = await User.create({
                clerkId: req.auth.clerkId,
                name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'User',
                email: clerkUser.emailAddresses[0].emailAddress,
                role: 'Patient', // Default role
            });
        } catch (error) {
            console.error('Error creating user from Clerk:', error);
            return res.status(500).json({ message: 'Error syncing user profile' });
        }
    }

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            clerkId: user.clerkId
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Old methods kept for reference or specialized use, but Clerk handles most of this now
const registerUser = async (req, res) => {
    res.status(400).json({ message: 'Use Clerk for registration' });
};

const loginUser = async (req, res) => {
    res.status(400).json({ message: 'Use Clerk for login' });
};

module.exports = { registerUser, loginUser, getUserProfile };
