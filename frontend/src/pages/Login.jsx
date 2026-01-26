import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { LogIn, Mail, Lock, Loader2, Activity, ShieldCheck, Globe } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication sequence failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#f8faff] overflow-hidden">
            {/* Left Branding Side */}
            <div className="hidden md:flex md:w-[40%] lg:w-[50%] bg-slate-900 relative p-16 flex-col justify-between overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/20 animate-pulse-subtle">
                            <Activity size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-[900] text-white tracking-tight leading-none">MediCare</h1>
                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mt-2 leading-none">Royal Health Network</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg mb-20 animate-in fade-in slide-in-from-left duration-1000">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-md mb-8">
                        <ShieldCheck className="text-emerald-400" size={16} />
                        <span className="text-[10px] font-black uppercase text-primary-200 tracking-widest leading-none">Encrypted Access Node</span>
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter">Gateway to World-Class <span className="text-primary-500">Excellence.</span></h2>
                    <p className="text-slate-400 mt-10 text-xl font-medium leading-relaxed">Experience the next generation of medical administration with our enterprise-grade healthcare management system.</p>
                </div>

                <div className="relative z-10 flex items-center gap-10">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 overflow-hidden">
                                <span className="text-xs uppercase tracking-tighter">MD</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">Trusted by over <span className="text-white">500+</span> Elite Institutions globally.</p>
                </div>

                {/* Animated Background Blobs */}
                <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Right Login Side */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white md:rounded-l-[4rem] shadow-2xl relative z-20">
                <div className="max-w-md w-full animate-in fade-in slide-in-from-right duration-1000">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Account Access</h2>
                        <p className="text-slate-400 font-bold mt-4 uppercase text-[11px] tracking-[0.2em] flex items-center gap-2 leading-none">
                            <Globe size={14} className="text-primary-500" />
                            Identity Authorization required
                        </p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-3xl text-sm mb-10 flex items-center gap-4 animate-in shake duration-300">
                            <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></div>
                            <span className="font-bold tracking-tight">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8 uppercase tracking-[0.1em]">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 ml-1">Official Identifier</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                                    <Mail size={20} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-100 px-14 py-5 rounded-[2rem] focus:ring-4 focus:ring-primary-50 transition-all outline-none font-bold placeholder:text-slate-300 tracking-tight normal-case"
                                    placeholder="Enter registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-slate-400">Security Phrase</label>
                                <a href="#" className="text-[10px] font-black text-primary-600 hover:underline">Revoke / Reset?</a>
                            </div>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                                    <Lock size={20} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-100 px-14 py-5 rounded-[2rem] focus:ring-4 focus:ring-primary-50 transition-all outline-none font-bold placeholder:text-slate-300 tracking-tight normal-case"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-6 mt-6 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-primary-600 hover:shadow-2xl hover:shadow-primary-200 transition-all active:scale-[0.98] group disabled:bg-slate-300"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <span>Execute Login</span>
                                    <LogIn className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 text-center">
                        <p className="text-slate-400 font-bold text-sm tracking-tight">
                            Access restricted to authorized personnel only.
                            <Link to="/register" className="text-primary-600 font-black ml-4 hover:underline underline-offset-8">
                                Initiate Registry
                            </Link>
                        </p>
                    </div>

                    <div className="mt-20 flex justify-center gap-10">
                        <div className="flex flex-col items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                            <div className="h-6 w-24 bg-slate-200 rounded-lg mb-2"></div>
                            <span className="text-[8px] font-black uppercase tracking-widest">HL7 Verified</span>
                        </div>
                        <div className="flex flex-col items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                            <div className="h-6 w-24 bg-slate-200 rounded-lg mb-2"></div>
                            <span className="text-[8px] font-black uppercase tracking-widest">ISO 27001</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
