const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Prevent deleting oneself
            if (user.clerkId === req.headers['x-clerk-user-id'] || user.email === req.user?.email) {
                return res.status(400).json({ message: 'Authorization Failure: Cannot terminate current session identity.' });
            }

            await user.deleteOne();
            res.json({ message: 'Identity Purged Successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Termination Protocol Failed' });
    }
};

const { clerkClient } = require('@clerk/clerk-sdk-node');

// @desc    Create new user (Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please provide all identity parameters.' });
        }

        // 1. Create in Clerk
        const clerkUser = await clerkClient.users.createUser({
            emailAddress: [email],
            password: password,
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ') || '',
            publicMetadata: { role }
        });

        // 2. Sync with MongoDB (Server middleware or manual create)
        const user = await User.create({
            clerkId: clerkUser.id,
            name,
            email,
            role
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Provisioning Error:', error);
        res.status(500).json({ message: error.message || 'Identity Provisioning Failed' });
    }
};

module.exports = { getUsers, updateUserRole, deleteUser, createUser };
