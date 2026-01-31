import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Activity,
    Menu,
    X,
    ArrowRight,
    Bed
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

const AuraNavigation = () => {
    const { authenticated } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Doctors', path: '/doctors' },
        { name: 'Services', path: '/services' },
        { name: 'Room Nodes', path: '/room-booking' },
        { name: 'Appointments', path: '/appointments' },
        { name: 'Quality', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <>
            {/* 1. TOP-LEFT NAVIGATION NODE - GLOBAL PROTOCOL */}
            <nav className="fixed top-10 left-10 z-[100] pointer-events-auto">
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-500 group relative
                        ${scrolled ? 'bg-slate-950 shadow-luxury-lg' : 'bg-slate-950/80 backdrop-blur-xl border border-white/10'}
                        hover:bg-primary-600 hover:scale-110 active:scale-90
                    `}
                >
                    <Menu size={28} strokeWidth={2.5} />
                    <span className="absolute left-20 px-4 py-2 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl whitespace-nowrap">
                        Protocol Matrix
                    </span>
                </button>
            </nav>

            {/* 2. SIDE-DRAWER NAVIGATION PROTOCOL - OFF-SIDE ONLY */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[500] pointer-events-none">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-500"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>

                    {/* Drawer */}
                    <div className="absolute left-0 top-0 h-full w-[350px] lg:w-[450px] bg-white shadow-[20px_0_80px_rgba(0,0,0,0.1)] pointer-events-auto animate-in slide-in-from-left duration-500 ease-in-out flex flex-col p-10 lg:p-16 relative overflow-hidden">
                        {/* Drawer Background Aura */}
                        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary-600/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-24 relative z-10">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 group"
                            >
                                <Activity className="text-primary-600 group-hover:rotate-12 transition-transform" size={28} />
                                <span className="font-[1000] text-2xl text-slate-950 tracking-tighter uppercase italic leading-none">MediCare</span>
                            </Link>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-3 hover:bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all active:scale-90"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-8 relative z-10">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block group"
                                >
                                    <span className="text-4xl lg:text-5xl font-[1000] text-slate-300 group-hover:text-slate-950 transition-all uppercase italic tracking-tighter leading-none block">
                                        {link.name}
                                    </span>
                                    <div className="h-1 w-0 bg-primary-600 group-hover:w-16 transition-all duration-500 mt-3"></div>
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto relative z-10">
                            <div className="h-px w-full bg-slate-100 mb-10"></div>
                            {authenticated ? (
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between p-6 bg-slate-950 text-white rounded-2xl hover:bg-primary-600 transition-all group"
                                >
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Master Link</p>
                                        <p className="text-xl font-[1000] uppercase italic tracking-tighter">Dashboard</p>
                                    </div>
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary-600 transition-all group"
                                >
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Restricted</p>
                                        <p className="text-xl font-[1000] uppercase italic tracking-tighter text-slate-950">Authenticate</p>
                                    </div>
                                    <ArrowRight className="text-primary-600 group-hover:translate-x-2 transition-transform" size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AuraNavigation;
