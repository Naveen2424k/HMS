import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';
import { Bell, X, Zap } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [activeAlert, setActiveAlert] = useState(null);

    useEffect(() => {
        if (user) {
            const newSocket = io(import.meta.env.VITE_API_URL.replace('/api', ''));
            setSocket(newSocket);

            newSocket.emit('join', user._id);

            newSocket.on('notification', (data) => {
                setNotifications(prev => [data, ...prev]);
                setActiveAlert(data);
                // Clear alert after 5 seconds
                setTimeout(() => setActiveAlert(null), 5000);
            });

            return () => newSocket.close();
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{ notifications, socket }}>
            {children}
            {activeAlert && (
                <div className="fixed top-12 right-12 z-[2000] animate-in slide-in-from-right-full duration-700">
                    <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-6 min-w-[400px]">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center animate-pulse">
                            <Zap size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">System Notification</p>
                            <h4 className="font-black uppercase italic tracking-tighter text-lg">{activeAlert.title}</h4>
                            <p className="text-xs text-slate-400 font-bold">{activeAlert.message}</p>
                        </div>
                        <button onClick={() => setActiveAlert(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
