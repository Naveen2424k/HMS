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
        // Set up interceptor to attach token to all requests
        const interceptor = api.interceptors.request.use(async (config) => {
            try {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error getting token for interceptor:', error);
            }
            return config;
        });

        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, [getToken]);

    useEffect(() => {
        const syncUser = async () => {
            if (!clerkLoaded) return;

            if (clerkUser) {
                try {
                    // This call will now automatically include the token thanks to the interceptor above
                    const { data } = await api.get('/auth/profile');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to sync user:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        syncUser();
    }, [clerkUser, clerkLoaded]); // Removed getToken as it's now handled by the interceptor effect

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
