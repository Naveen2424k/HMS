import { createContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user: clerkUser, isLoaded: userLoaded } = useUser();
    const { getToken, isLoaded: authLoaded, signOut } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Setup Axios Interceptor for every request
        const interceptor = api.interceptors.request.use(async (config) => {
            if (authLoaded) {
                try {
                    const token = await getToken();
                    if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                } catch (error) {
                    console.error('Interceptor token fetch failed:', error);
                }
            }
            return config;
        });

        const syncUser = async () => {
            if (userLoaded && authLoaded && clerkUser) {
                try {
                    // Just trigger a profile fetch to sync state
                    const { data } = await api.get('/auth/profile');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to sync user with backend:', error);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            } else if (userLoaded && authLoaded && !clerkUser) {
                setUser(null);
                setLoading(false);
            }
        };

        syncUser();

        // Cleanup interceptor on unmount
        return () => api.interceptors.request.eject(interceptor);
    }, [clerkUser, userLoaded, authLoaded, getToken]);


    const logout = async () => {
        try {
            await signOut();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading: loading || !userLoaded || !authLoaded,
            authenticated: !!clerkUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;



