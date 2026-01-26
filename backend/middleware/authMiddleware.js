const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using Clerk
            const decoded = await clerkClient.verifyToken(token);
            const clerkId = decoded.sub;

            // Attach clerk info to request
            req.auth = { clerkId, claims: decoded };

            // Find user in our database using clerkId
            req.user = await User.findOne({ clerkId }).select('-password');

            next();
        } catch (error) {
            console.error('Auth Error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role ${req.user.role} is not authorized to access this route` });
        }
        next();
    };
};

module.exports = { protect, authorize };
