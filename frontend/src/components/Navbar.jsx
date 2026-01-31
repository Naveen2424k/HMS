import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, isSignedIn } = useUser();
    const { signOut } = useClerk();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Book Appointment', path: '/appointments' },
        { name: 'Room Booking', path: '/room-booking' },
        { name: 'Dashboard', path: '/after-login', protected: true },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-blue-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Hospital Name */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            🏥
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-blue-900 m-0">MediCare Hospital</h1>
                            <p className="text-xs text-gray-500 -mt-1">Caring for You</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            if (link.protected && !isSignedIn) return null;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium text-sm"
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side - Login/Profile */}
                    <div className="hidden md:flex items-center gap-3">
                        {isSignedIn ? (
                            <>
                                <Link
                                    to="/after-login"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all"
                                >
                                    <User size={18} />
                                    <span className="font-medium text-sm">{user?.firstName || user?.emailAddresses[0].emailAddress}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-sm"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-5 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                    <div className="px-4 py-3 space-y-2">
                        {navLinks.map((link) => {
                            if (link.protected && !isSignedIn) return null;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        {/* Mobile Auth Buttons */}
                        <div className="pt-3 border-t border-gray-200 space-y-2">
                            {isSignedIn ? (
                                <>
                                    <Link
                                        to="/after-login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium"
                                    >
                                        <User size={20} />
                                        {user?.firstName || user?.emailAddresses[0].emailAddress}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-center text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-center bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                    >
                                        Register
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
