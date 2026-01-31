import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useUser();
    const { user: dbUser, loading: dbLoading } = useContext(AuthContext);

    if (!clerkLoaded || dbLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-blue-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" />;
    }

    // Check role from both DB and Clerk metadata
    const userRole = dbUser?.role || clerkUser?.publicMetadata?.role;

    // Check if user has one of the allowed roles
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect to home or a generic area to break after-login loops
        console.warn(`Access denied. Role ${userRole} not in ${allowedRoles}`);
        return <Navigate to="/" />;
    }


    return children;
};

export default ProtectedRoute;
