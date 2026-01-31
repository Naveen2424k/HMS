import { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ShieldAlert, LogIn, Home, Activity, Zap, Sparkles, ShieldCheck } from 'lucide-react';

const Logout = () => {
    const { logout, authenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            if (authenticated) {
                // We let the AuthContext handle the Clerk signOut
                // But we stay on this page to show the "Terminated" UI
                await logout();
            }
        };
        performLogout();
    }, [logout, authenticated]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#020617]">
            {/* Dynamic Background Engine */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-rose-600/10 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-900 rounded-full blur-[150px]"></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] bg-center opacity-10"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl text-center space-y-16 animate-in fade-in zoom-in duration-1000">
                {/* Protocol Header */}
                <div className="space-y-8">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center text-rose-500 border-2 border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.2)] animate-pulse">
                            <ShieldAlert size={48} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-7xl md:text-9xl font-[1000] text-white tracking-tighter uppercase italic leading-none">
                            Session <br />
                            <span className="text-rose-500 drop-shadow-glow-rose">Terminated.</span>
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] italic">
                            <Zap size={14} className="text-rose-500" />
                            Security Clearance Revoked
                            <Zap size={14} className="text-rose-500" />
                        </div>
                    </div>
                </div>

                {/* Status Card */}
                <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    <div className="relative z-10 space-y-8">
                        <p className="text-xl text-slate-400 font-bold leading-relaxed italic">
                            Your secure handshake with the <span className="text-white">Medicare Infrastructure</span> has been disconnected. All active neural nodes have been flushed.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5 space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Auth Status</p>
                                <p className="text-rose-400 font-black uppercase italic tracking-tighter">Disconnected</p>
                            </div>
                            <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5 space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Encryption</p>
                                <p className="text-emerald-400 font-black uppercase italic tracking-tighter">Inactive</p>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col sm:flex-row gap-6">
                            <Link
                                to="/"
                                className="flex-1 py-6 bg-white text-slate-950 rounded-[2.2rem] font-[1000] uppercase tracking-[0.4em] text-[10px] hover:bg-primary-600 hover:text-white transition-all duration-700 shadow-xl flex items-center justify-center gap-4 group/home italic"
                            >
                                <Home size={18} className="group-hover/home:-translate-y-1 transition-transform" />
                                Public Portal
                            </Link>
                            <Link
                                to="/login"
                                className="flex-1 py-6 bg-slate-900 text-white rounded-[2.2rem] font-[1000] uppercase tracking-[0.4em] text-[10px] hover:bg-slate-800 transition-all duration-700 border border-white/10 flex items-center justify-center gap-4 group/login italic"
                            >
                                <LogIn size={18} className="group-hover/login:translate-x-1 transition-transform" />
                                New Identity Sync
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Infrastructure Footer */}
                <div className="pt-12 text-slate-600 text-[9px] font-black uppercase tracking-[0.8em] opacity-30 italic flex items-center justify-center gap-6">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                    Nexus Node 01 • Systems Offline
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default Logout;
