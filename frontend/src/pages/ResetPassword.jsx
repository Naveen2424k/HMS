import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, Loader2, ShieldCheck, Activity, CheckCircle2, Zap, Globe, Shield, RefreshCcw, Sparkles, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setMessage({ type: 'error', text: 'Security phrases do not match' });
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.post(`/auth/reset-password/${token}`, { password });
            setMessage({ type: 'success', text: data.message });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Access authorization failed'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#0f172a]">
            {/* Dynamic Background Engine */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl animate-in zoom-in duration-700">
                <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="p-12 md:p-20 space-y-12">
                        {/* Branding Header */}
                        <div className="text-center space-y-6">
                            <Link to="/" className="inline-flex items-center gap-4 group mb-8">
                                <div className="w-14 h-14 bg-primary-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-2xl shadow-primary-500/20 group-hover:rotate-6 transition-all duration-500 border-2 border-primary-400/20">
                                    <Activity size={30} />
                                </div>
                                <div className="text-left">
                                    <h1 className="text-2xl font-black text-white leading-none tracking-tighter uppercase italic">MediCare</h1>
                                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em] mt-1.5 leading-none">Override Facility</p>
                                </div>
                            </Link>

                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] italic">Security <br /><span className="text-primary-500">Upgrade.</span></h1>
                                <p className="text-slate-400 font-bold flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em]">
                                    <Sparkles size={16} className="text-blue-400" />
                                    Establish New Credentials
                                </p>
                            </div>
                        </div>

                        {message.type === 'success' ? (
                            <div className="text-center py-12 space-y-10 animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-luxury border-2 border-emerald-500/40 animate-bounce-slow">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{message.text}</h3>
                                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em] animate-pulse">Re-routing to Entry Portal Node in 3s...</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {message.type === 'error' && (
                                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-[2rem] text-sm flex items-center gap-4 animate-in shake duration-500">
                                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                                        <span className="font-bold tracking-tight uppercase text-[10px]">{message.text}</span>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 ml-4 uppercase tracking-[0.3em]">New Security Phrase</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                            <Lock size={22} className="text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-white/5 border border-white/10 focus:border-primary-500/50 px-16 py-6 rounded-[2.2rem] focus:ring-8 focus:ring-primary-500/10 transition-all outline-none font-black text-white placeholder:text-slate-600 tracking-tight normal-case text-lg"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 ml-4 uppercase tracking-[0.3em]">Confirm Protocol Match</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                            <Lock size={22} className="text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-white/5 border border-white/10 focus:border-primary-500/50 px-16 py-6 rounded-[2.2rem] focus:ring-8 focus:ring-primary-500/10 transition-all outline-none font-black text-white placeholder:text-slate-600 tracking-tight normal-case text-lg"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative group overflow-hidden bg-white text-slate-900 py-7 rounded-[2.2rem] flex items-center justify-center gap-6 text-xs font-black uppercase tracking-[0.4em] hover:bg-emerald-600 hover:text-white transition-all duration-500 shadow-xl active:scale-95 disabled:bg-slate-800 disabled:text-slate-600"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            <span>Deploy Upgrade</span>
                                            <ShieldCheck className="group-hover:rotate-12 transition-transform duration-500" size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="pt-10 text-center border-t border-white/5 flex flex-col items-center gap-6">
                            <Link to="/login" className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-all group">
                                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                                Abort Sequence
                            </Link>

                            <div className="flex items-center gap-8 opacity-20 grayscale">
                                <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">RSA 4096</span>
                                <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">ENCRYPTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
