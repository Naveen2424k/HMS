import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, ArrowLeft, Loader2, ShieldCheck, Activity, Zap, Globe, Shield, MoveRight, Sparkles } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setMessage({
                type: 'success',
                text: `${data.message} Reset Token: ${data.resetToken} (Simulated Email)`
            });
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Access Protocol Initiation Failure'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#0f172a]">
            {/* Dynamic Background Engine */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-blob"></div>
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
                                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em] mt-1.5 leading-none">Security Node</p>
                                </div>
                            </Link>

                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] italic">Access <br /><span className="text-primary-500">Recovery.</span></h1>
                                <p className="text-slate-400 font-bold flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em]">
                                    <Sparkles size={16} className="text-primary-400" />
                                    Initiate Identity Sync
                                </p>
                            </div>
                        </div>

                        {message.text ? (
                            <div className="space-y-8 animate-in zoom-in duration-500">
                                <div className={`p-10 rounded-[2.5rem] border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                    <div className="flex flex-col items-center gap-6 text-center">
                                        <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center shadow-2xl border-2 ${message.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-rose-500/20 border-rose-500/40 text-rose-400'}`}>
                                            <ShieldCheck size={40} className={message.type === 'success' ? 'animate-pulse' : ''} />
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-2xl font-black uppercase tracking-tighter italic">{message.type === 'success' ? 'Protocol Synchronized' : 'Access Denial'}</h4>
                                            <p className="text-sm font-bold leading-relaxed opacity-80 break-all">{message.text}</p>
                                        </div>
                                    </div>
                                    {message.type === 'success' && (
                                        <Link
                                            to={`/reset-password/${message.text.split(': ')[1].split(' ')[0]}`}
                                            className="mt-10 w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 group/continue"
                                        >
                                            Execute Reset
                                            <MoveRight className="group-hover/continue:translate-x-4 transition-transform duration-500" size={18} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 ml-4 uppercase tracking-[0.3em]">Official Identifier</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                            <Mail size={22} className="text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-white/5 border border-white/10 focus:border-primary-500/50 px-16 py-6 rounded-[2.2rem] focus:ring-8 focus:ring-primary-500/10 transition-all outline-none font-black text-white placeholder:text-slate-600 tracking-tight normal-case text-lg"
                                            placeholder="node@nexus.global"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative group overflow-hidden bg-white text-slate-900 py-7 rounded-[2.2rem] flex items-center justify-center gap-6 text-xs font-black uppercase tracking-[0.4em] hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-xl active:scale-95 disabled:bg-slate-800 disabled:text-slate-600"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            <span>Initiate Recovery</span>
                                            <ShieldCheck className="group-hover:rotate-12 transition-transform duration-500" size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="pt-10 text-center border-t border-white/5 flex flex-col items-center gap-6">
                            <Link to="/login" className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-all group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                                Return to Entry Portal
                            </Link>

                            <div className="flex items-center gap-8 opacity-20 grayscale">
                                <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">ISO 27001</span>
                                <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">AES-256</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
