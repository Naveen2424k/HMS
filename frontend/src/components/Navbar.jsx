import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import AuthContext from '../context/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, isSignedIn } = useUser();
    const { signOut } = useClerk();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user: dbUser } = React.useContext(AuthContext);
    const role = dbUser?.role || user?.publicMetadata?.role;

    const handleLogout = async () => {
        await signOut();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Book Appointment', path: '/appointments', restrictedRoles: ['Admin'] },
        { name: 'Dashboard', path: '/after-login', protected: true },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="bg-white sticky top-0 z-[1000] border-b-4 border-blue-600 shadow-md h-24 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="flex justify-between items-center">

                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-md">🏥</div>
                        <div>
                            <h1 className="text-3xl font-black text-blue-900 leading-none">MediCare</h1>
                            <p className="text-sm text-blue-500 font-bold uppercase tracking-widest mt-1">Hospital Management</p>
                        </div>
                    </Link>

                    {/* Navigation - Desktop */}
                    <div className="hidden lg:flex items-center gap-4">
                        {navLinks.map((link) => {
                            if (link.protected && !isSignedIn) return null;
                            if (link.restrictedRoles && role && link.restrictedRoles.includes(role)) return null;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="px-6 py-3 text-lg font-black text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth - Desktop */}
                    <div className="hidden lg:flex items-center gap-6">
                        {isSignedIn ? (
                            <div className="flex items-center gap-6">
                                <Link
                                    to="/after-login"
                                    className="flex items-center gap-3 bg-blue-50 text-blue-900 border-2 border-blue-100 px-6 py-3 rounded-2xl font-black text-lg hover:bg-blue-100 transition shadow-sm"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-black shadow-md">
                                        {user?.firstName?.charAt(0) || 'U'}
                                    </div>
                                    <span>{user?.firstName || 'Dashboard'}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={28} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link
                                    to="/login"
                                    className="text-blue-600 font-black hover:text-blue-700 text-xl px-4"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl shadow-blue-200"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-3 text-blue-900 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all border-2 border-blue-100"
                    >
                        {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-24 left-0 w-full bg-white border-b-8 border-blue-600 shadow-2xl z-[2000]">
                    <div className="p-10 space-y-6">
                        {navLinks.map((link) => {
                            if (link.protected && !isSignedIn) return null;
                            if (link.restrictedRoles && role && link.restrictedRoles.includes(role)) return null;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block p-5 text-2xl font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition"
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        <div className="pt-8 border-t-2 border-gray-100 mt-8 space-y-6">
                            {isSignedIn ? (
                                <>
                                    <Link
                                        to="/after-login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-6 p-6 bg-blue-50 text-blue-900 rounded-3xl border-2 border-blue-100"
                                    >
                                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-md">
                                            {user?.firstName?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-2xl font-black">{user?.firstName || 'My Dashboard'}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full p-6 bg-red-50 text-red-600 rounded-3xl font-black text-xl flex items-center justify-center gap-3"
                                    >
                                        <LogOut size={30} /> Logout Account
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full p-6 text-center text-blue-600 border-4 border-blue-600 rounded-3xl font-black text-2xl"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full p-6 text-center bg-blue-600 text-white rounded-3xl font-black text-2xl shadow-xl shadow-blue-200"
                                    >
                                        Register Now
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
