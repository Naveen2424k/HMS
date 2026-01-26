import { createContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
    const { getToken, signOut } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncUser = async () => {
            if (clerkLoaded) {
                if (clerkUser) {
                    try {
                        const token = await getToken();
                        // This endpoint should verify the Clerk token and return/create the user in our DB
                        const { data } = await api.get('/auth/profile', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setUser(data);
                    } catch (error) {
                        console.error('Failed to sync user:', error);
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        };
        syncUser();
    }, [clerkUser, clerkLoaded, getToken]);

    const logout = async () => {
        await signOut();
        setUser(null);
    };

    // login and register are now handled by Clerk components
    const login = () => { console.warn('Use Clerk SignIn component instead'); };
    const register = () => { console.warn('Use Clerk SignUp component instead'); };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
