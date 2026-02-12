import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Bell, Search, Globe, MessageSquare, ChevronDown, LogOut, User as UserIcon, Menu, ShieldCheck } from 'lucide-react';

const Header = ({ onMenuClick }) => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <header className="h-24 px-10 flex items-center justify-between bg-white border-b-2 border-blue-100 sticky top-0 z-[100] shadow-sm">

            {/* Left Section */}
            <div className="flex items-center gap-10">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                >
                    <Menu size={28} />
                </button>

                <div className="relative group hidden xl:block">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-300" size={24} />
                    <input
                        type="text"
                        placeholder="Search records, specialists..."
                        className="w-[450px] pl-16 pr-8 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-black text-blue-900 focus:border-blue-600 focus:bg-white transition-all placeholder:text-blue-200 shadow-inner text-lg"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-8">

                {/* Desktop Global Link */}
                <Link to="/" className="hidden md:flex items-center gap-3 text-lg font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors mr-6">
                    <Globe size={22} />
                    Public Portal
                </Link>

                {/* Notifications */}
                <div className="flex items-center gap-4">
                    <button className="p-4 bg-blue-50 text-blue-400 rounded-2xl hover:bg-white hover:shadow-md transition-all relative">
                        <MessageSquare size={26} />
                    </button>
                    <button className="p-4 bg-blue-50 text-blue-400 rounded-2xl hover:bg-white hover:shadow-md transition-all relative">
                        <Bell size={26} />
                        <div className="absolute top-4 right-4 w-3.5 h-3.5 bg-red-500 rounded-full border-4 border-white"></div>
                    </button>
                </div>

                {/* Profile Section */}
                <div className="relative ml-6">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-6 bg-white border-2 border-blue-100 p-2.5 pl-6 rounded-[2.5rem] hover:bg-blue-50 transition-all group shadow-sm"
                    >
                        <div className="text-right hidden sm:block">
                            <h4 className="text-lg font-black text-blue-900 leading-none uppercase italic">{user?.fullName || 'Administrator'}</h4>
                            <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mt-2">Active Protocol</p>
                        </div>
                        <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-100">
                            {user?.firstName?.charAt(0) || 'A'}
                        </div>
                        <ChevronDown size={22} className={`text-blue-300 transition-transform mr-2 ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Simple Dropdown Menu */}
                    {showProfileMenu && (
                        <div className="absolute top-full right-0 mt-6 w-80 bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border-4 border-blue-50 p-6 animate-in fade-in slide-in-from-top-6 duration-300">
                            <div className="p-6 bg-blue-50 rounded-3xl mb-6">
                                <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2 italic">Authorized Identity</p>
                                <p className="text-lg font-black text-blue-900 truncate italic">{user?.primaryEmailAddress?.emailAddress}</p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowProfileMenu(false);
                                    navigate('/after-login?action=settings');
                                }}
                                className="w-full flex items-center gap-4 p-5 rounded-2xl hover:bg-blue-50 text-blue-900 font-black text-xl transition-all italic"
                            >
                                <UserIcon size={24} />
                                Profile Settings
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 p-5 rounded-2xl hover:bg-red-50 text-red-600 font-black text-xl transition-all mt-3 italic"
                            >
                                <LogOut size={24} />
                                Terminate Session
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
