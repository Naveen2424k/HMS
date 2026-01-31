const { createClerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify the token with Clerk (allow 5m clock skew for dev)
            const decoded = await clerkClient.verifyToken(token, {
                clockSkewInMs: 300000
            });


            if (!decoded) {
                return res.status(401).json({ message: 'Not authorized, token failed' });
            }


            // Find user in our DB by clerkId or email
            let user = await User.findOne({ clerkId: decoded.sub });

            if (!user) {
                // Fetch user details from Clerk if not in our DB
                const clerkUser = await clerkClient.users.getUser(decoded.sub);

                // Check if user exists by email (to merge accounts if needed)
                const email = clerkUser.emailAddresses[0]?.emailAddress;
                user = await User.findOne({ email });

                if (user) {
                    // Update existing user with clerkId
                    user.clerkId = decoded.sub;
                    await user.save();
                } else {
                    // Create new user record
                    user = await User.create({
                        clerkId: decoded.sub,
                        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
                        email: email,
                        role: clerkUser.publicMetadata.role || 'Patient', // Default role
                    });
                }
            }

            req.user = user;
            return next();
        } catch (error) {
            console.error('Clerk Auth Error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
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

module.exports = { protect, authorize };


