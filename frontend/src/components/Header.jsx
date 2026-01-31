import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { Bell, Search, Globe, MessageSquare, ChevronDown, LogOut, User as UserIcon, Menu, Zap, ShieldCheck, Activity, Sparkles } from 'lucide-react';

const Header = ({ onMenuClick }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`h-24 md:h-32 px-6 md:px-12 flex items-center justify-between transition-all duration-700 z-[100] sticky top-0 ${scrolled ? 'bg-white/70 backdrop-blur-3xl border-b border-white shadow-luxury-lg py-4 md:h-24' : 'bg-transparent py-8'}`}>
            {/* System Intelligence / Search */}
            <div className="flex items-center gap-6 md:gap-12">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-5 text-slate-900 bg-white/80 backdrop-blur-md hover:bg-slate-950 hover:text-white rounded-[1.5rem] transition-all duration-500 shadow-luxury-sm border border-white"
                >
                    <Menu size={28} />
                </button>

                <div className="relative group hidden xl:block">
                    <span className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-all duration-700 transform group-focus-within:scale-110">
                        <Search size={22} strokeWidth={2.5} />
                    </span>
                    <input
                        type="text"
                        placeholder="Query Global Health Database..."
                        className="bg-white/80 backdrop-blur-md border-2 border-transparent rounded-[2.5rem] py-5 pl-16 pr-10 w-[520px] focus:ring-8 focus:ring-primary-500/5 focus:border-primary-100 transition-all outline-none font-black text-[13px] uppercase tracking-wide placeholder:text-slate-300 shadow-luxury-sm group-hover:bg-white group-hover:shadow-luxury-md"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-700">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 italic">Global Sync</span>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-6">
                    <div className="flex items-center gap-4 px-6 py-3 bg-white/50 backdrop-blur-md rounded-full border border-white shadow-luxury-sm group cursor-pointer hover:bg-white transition-all duration-500">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[11px] font-[1000] uppercase text-slate-600 tracking-[0.4em] leading-none group-hover:text-primary-600">Active Node Link</span>
                    </div>
                </div>
            </div>

            {/* Strategic Actions & Command Identity */}
            <div className="flex items-center gap-6 md:gap-12">
                <div className="hidden md:flex items-center gap-12 border-r border-slate-200 pr-12 h-10">
                    <Link to="/" className="text-[12px] font-[1000] uppercase tracking-[0.5em] text-slate-400 hover:text-slate-950 transition-all duration-500 flex items-center gap-4 group italic">
                        <div className="p-2 rounded-xl group-hover:bg-slate-100 transition-colors">
                            <Globe size={20} className="group-hover:rotate-180 transition-transform duration-1000 text-primary-500" />
                        </div>
                        Public Portal
                    </Link>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <button className="relative p-5 text-slate-400 hover:bg-slate-950 hover:text-white rounded-[1.8rem] transition-all duration-500 group shadow-luxury-sm border-2 border-white/50 bg-white/50 backdrop-blur-md">
                        <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
                        <div className="absolute top-4 right-4 w-3.5 h-3.5 bg-primary-600 rounded-full border-4 border-white scale-0 group-hover:scale-100 transition-transform duration-500 shadow-glow-primary"></div>
                    </button>
                    <button className="relative p-5 text-slate-400 hover:bg-slate-950 hover:text-white rounded-[1.8rem] transition-all duration-500 group shadow-luxury-sm border-2 border-white/50 bg-white/50 backdrop-blur-md">
                        <Bell size={24} className="group-hover:rotate-12 transition-transform" />
                        <div className="absolute top-4 right-4 w-3.5 h-3.5 bg-rose-500 rounded-full border-4 border-white animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                    </button>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-6 bg-white/80 backdrop-blur-md p-3 rounded-[2.8rem] hover:shadow-luxury-xl border-2 border-white transition-all duration-700 group hover:bg-white"
                    >
                        <div className="text-right flex flex-col justify-center pl-6 hidden sm:block">
                            <h4 className="text-[16px] font-[1000] text-slate-950 leading-none uppercase tracking-tighter italic group-hover:text-primary-600 transition-colors">{user?.name}</h4>
                            <div className="flex items-center justify-end gap-3 mt-2 opacity-40 group-hover:opacity-100 transition-all duration-500">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">{user?.role} Tier</p>
                            </div>
                        </div>
                        <div className="w-16 h-16 bg-slate-950 rounded-[1.8rem] flex items-center justify-center text-white font-[1000] text-2xl border-[5px] border-white shadow-2xl relative group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 overflow-hidden">
                            <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            {user?.name?.charAt(0) || 'U'}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-glow-emerald"></div>
                        </div>
                        <ChevronDown size={20} className={`text-slate-300 mr-3 transition-transform duration-1000 ${showProfileMenu ? 'rotate-180 text-primary-500' : ''}`} />
                    </button>

                    <button
                        onClick={() => navigate('/logout')}
                        className="flex items-center justify-center gap-3 px-8 py-5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.8rem] transition-all duration-700 group border-2 border-white/50 bg-white/50 backdrop-blur-md ml-6 hover:shadow-luxury-lg hover:border-rose-400 focus:outline-none"
                        title="Security Termination"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Terminate</span>
                    </button>



                    {showProfileMenu && (
                        <div className="absolute top-[120%] right-0 w-85 bg-white/95 backdrop-blur-3xl border-2 border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] rounded-[3.5rem] py-10 z-[150] animate-in fade-in slide-in-from-top-12 duration-1000 overflow-hidden">
                            {/* Abstract Flare inside menu */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="px-12 py-8 border-b-2 border-slate-50 mb-6 bg-slate-950/5 rounded-[2.5rem] mx-4 relative overflow-hidden group/m">
                                <div className="absolute inset-0 bg-primary-600 translate-y-[100%] group-hover/m:translate-y-0 transition-transform duration-1000 opacity-[0.03]"></div>
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <Sparkles size={16} className="text-primary-600 animate-pulse" />
                                    <p className="text-[11px] font-[1000] text-slate-400 uppercase tracking-[0.5em] leading-none">Security Manifest</p>
                                </div>
                                <p className="text-lg font-[1000] text-slate-950 tracking-tighter truncate italic relative z-10">{user?.email}</p>
                            </div>

                            <div className="space-y-2 px-6">
                                <Link to="/dashboard?action=settings" onClick={() => setShowProfileMenu(false)} className="flex items-center justify-between w-full px-10 py-6 text-slate-800 font-[1000] uppercase text-[11px] tracking-[0.3em] hover:bg-slate-950 hover:text-white rounded-[2.2rem] transition-all duration-500 group/item">
                                    <div className="flex items-center gap-6">
                                        <div className="p-2 bg-slate-100 rounded-xl group-hover/item:bg-white/10 transition-colors">
                                            <UserIcon size={20} className="group-hover/item:scale-125 transition-transform" />
                                        </div>
                                        <span className="italic">Identity Hub</span>
                                    </div>
                                    <ChevronDown size={18} className="-rotate-90 opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:translate-x-2" />
                                </Link>
                                <button
                                    onClick={() => navigate('/logout')}
                                    className="flex items-center justify-between w-full px-10 py-6 text-rose-500 font-[1000] uppercase text-[11px] tracking-[0.3em] hover:bg-rose-500 hover:text-white rounded-[2.2rem] transition-all duration-700 group/exit"
                                >

                                    <div className="flex items-center gap-6">
                                        <div className="p-2 bg-rose-50 rounded-xl group-hover/exit:bg-white/10 transition-colors text-rose-600 group-hover/exit:text-white">
                                            <LogOut size={20} className="group-hover/exit:-translate-x-2 transition-transform" />
                                        </div>
                                        <span className="italic">Terminate Node</span>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-10 pt-8 border-t-2 border-slate-50 px-12 text-center relative z-10">
                                <div className="inline-flex items-center gap-4 opacity-40 group cursor-pointer hover:opacity-100 transition-opacity">
                                    <Activity size={14} className="text-primary-500 animate-pulse" />
                                    <span className="text-[9px] font-[1000] text-slate-500 uppercase tracking-[0.4em] italic group-hover:text-slate-950 transition-colors">Infrastructure • Nexus 01</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
