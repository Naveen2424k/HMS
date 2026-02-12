const { createClerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const protect = async (req, res, next) => {
    let token;
    let clerkId;

    // 1. Check for Bearer Token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = await clerkClient.verifyToken(token, {
                clockSkewInMs: 300000
            });

            if (!decoded) {
                return res.status(401).json({ message: 'Not authorized, token failed' });
            }
            clerkId = decoded.sub;
        } catch (error) {
            console.error('Clerk Auth Error:', error);
            // Don't return yet, try the fallback header if present
        }
    }

    // 2. Fallback to X-Clerk-User-Id header (for internal dev convenience seen in project)
    if (!clerkId && req.headers['x-clerk-user-id']) {
        clerkId = req.headers['x-clerk-user-id'];
    }

    if (!clerkId) {
        return res.status(401).json({ message: 'Not authorized, no identity found' });
    }

    try {
        // Find user in our DB
        let user = await User.findOne({ clerkId });

        if (!user) {
            // Fetch user details from Clerk if not in our DB
            const clerkUser = await clerkClient.users.getUser(clerkId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            user = await User.findOne({ email });

            if (user) {
                user.clerkId = clerkId;
                await user.save();
            } else {
                user = await User.create({
                    clerkId: clerkId,
                    name: `${clerkUser.firstName} ${clerkUser.lastName}`,
                    email: email,
                    role: clerkUser.publicMetadata.role || 'Patient',
                });
            }
        }

        req.user = user;
        return next();
    } catch (error) {
        console.error('User Sync Error:', error);
        return res.status(401).json({ message: 'Not authorized, user synchronization failed' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role ${req.user?.role || 'Guest'} is not authorized to access this route` });
        }
        next();
    };
};

const admin = authorize('Admin');

const checkPermission = (perm) => {
    return (req, res, next) => {
        if (req.user.role === 'Admin' || (req.user.permissions && req.user.permissions.includes(perm))) {
            return next();
        }
        res.status(403).json({ message: `Insufficient permissions: ${perm}` });
    };
};

module.exports = { protect, authorize, admin, checkPermission };
