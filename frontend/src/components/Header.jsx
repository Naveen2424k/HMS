import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import AuthContext from '../context/AuthContext.jsx';
import { Bell, Search, Globe, MessageSquare } from 'lucide-react';

const Header = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="glass-header h-24 px-10 flex items-center justify-between transition-all duration-500">
            {/* Search Bar / Insight */}
            <div className="flex items-center gap-6">
                <div className="relative group hidden lg:block">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors duration-300">
                        <Search size={22} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search global database..."
                        className="bg-slate-50 border-none rounded-2xl py-3.5 pl-14 pr-8 w-[400px] focus:ring-4 focus:ring-primary-50 transition-all outline-none font-semibold text-[15px]"
                    />
                </div>
                <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-2"></div>
                <div className="flex items-center gap-3 text-slate-400">
                    <Globe size={20} className="text-primary-400" />
                    <span className="text-xs font-black uppercase tracking-widest">Global Node: EU-West</span>
                </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                    <button className="relative p-3.5 text-slate-400 hover:bg-slate-50 hover:text-primary-600 rounded-2xl transition-all duration-300 group">
                        <MessageSquare size={22} />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-white ring-4 ring-primary-50 scale-0 group-hover:scale-100 transition-transform"></span>
                    </button>
                    <button className="relative p-3.5 text-slate-400 hover:bg-slate-50 hover:text-primary-600 rounded-2xl transition-all duration-300 group">
                        <Bell size={22} />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white ring-4 ring-rose-50 animate-pulse"></span>
                    </button>
                </div>

                <div className="h-10 w-[1px] bg-slate-100"></div>

                <div className="relative z-50 flex items-center gap-4">
                    <div className="text-right flex flex-col justify-center">
                        <h4 className="text-[15px] font-black text-slate-800 leading-tight">{user?.name}</h4>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{user?.role}</p>
                        </div>
                    </div>
                    <UserButton afterSignOutUrl="/login" appearance={{
                        elements: {
                            userButtonAvatarBox: "w-14 h-14 rounded-2xl border-2 border-white shadow-luxury-card",
                            userButtonTrigger: "focus:shadow-none outline-none"
                        }
                    }} />
                </div>
            </div>
        </header>
    );
};

export default Header;
