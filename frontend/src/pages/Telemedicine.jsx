import { useState, useEffect } from 'react';
import { Globe, Video, Mic, PhoneOff, MessageSquare, ShieldCheck, Activity, Users, MoreHorizontal, Sparkles } from 'lucide-react';

const Telemedicine = () => {
    const [isCalling, setIsCalling] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (isCalling) {
            interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isCalling]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
            {/* Virtual Sync Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-600/5 rounded-2xl border border-primary-600/10">
                        <Globe className="text-primary-600" size={18} />
                        <span className="text-[11px] font-black uppercase text-primary-600 tracking-[0.2em]">Quantum Telemedicine Node</span>
                    </div>
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-[1000] text-slate-900 tracking-tight leading-none uppercase italic">
                            Virtual <span className="text-primary-600">Consult.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 text-lg">
                            <ShieldCheck className="text-emerald-500" size={24} />
                            Encrypted Neural Video-Sync Link Established
                        </p>
                    </div>
                </div>

                {!isCalling && (
                    <button
                        onClick={() => setIsCalling(true)}
                        className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-primary-600 transition-all shadow-2xl flex items-center gap-4 group"
                    >
                        <Video size={20} className="group-hover:animate-pulse" />
                        Initiate Consultation Protocol
                    </button>
                )}
            </div>

            {isCalling ? (
                /* Active Call Matrix */
                <div className="grid lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-3 space-y-8">
                        <div className="relative aspect-video bg-slate-950 rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white group">
                            {/* Main Remote Video Stream (Placeholder) */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity size={100} className="text-primary-600/20 animate-pulse" />
                            </div>

                            {/* Call Interface Overlay */}
                            <div className="absolute inset-0 p-12 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="bg-black/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 flex items-center gap-6">
                                        <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Stream</p>
                                            <p className="text-white font-black uppercase italic tracking-tighter">Dr. Sarah Wilson</p>
                                        </div>
                                    </div>
                                    <div className="bg-black/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
                                        <p className="text-white font-black font-mono text-2xl">{formatTime(timer)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-8">
                                    <button className="p-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 text-white hover:bg-white/20 transition-all">
                                        <Mic size={24} />
                                    </button>
                                    <button
                                        onClick={() => setIsCalling(false)}
                                        className="p-10 bg-rose-500 rounded-[3rem] text-white shadow-2xl shadow-rose-500/40 hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <PhoneOff size={32} />
                                    </button>
                                    <button className="p-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 text-white hover:bg-white/20 transition-all">
                                        <Video size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Local Video Preview */}
                            <div className="absolute bottom-12 right-12 w-64 aspect-video bg-slate-900 rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                    <Users size={30} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <div className="luxury-card p-10 bg-white border-none shadow-luxury-lg h-full flex flex-col space-y-8">
                            <h3 className="text-xl font-[1000] text-slate-900 uppercase italic tracking-tighter flex items-center gap-4">
                                <MessageSquare className="text-primary-600" size={20} />
                                Context Chat
                            </h3>
                            <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2">
                                <div className="bg-slate-50 p-6 rounded-3xl rounded-tl-none border border-slate-100">
                                    <p className="text-xs font-bold text-slate-600">Greetings. Please share your recent vitals log for my review.</p>
                                    <span className="text-[8px] font-black text-slate-300 uppercase mt-2 block tracking-widest">DR. SARAH • 12:04</span>
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Transmit Data..."
                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 outline-none font-bold text-xs uppercase tracking-tight"
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-primary-600">
                                    <Sparkles size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Inactive State Visuals */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="luxury-card p-12 bg-slate-950 text-white border-none shadow-2xl flex flex-col items-center text-center space-y-8">
                        <div className="w-24 h-24 bg-primary-600/20 rounded-[2rem] flex items-center justify-center text-primary-400 border border-primary-600/20">
                            <Globe size={40} className="animate-spin-slow" />
                        </div>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter">Global Health Handshake</h4>
                        <p className="text-slate-400 font-bold leading-relaxed">Connect with leading specialists across the neural nexus from any node.</p>
                    </div>
                    {/* Additional info cards... */}
                </div>
            )}
        </div>
    );
};

export default Telemedicine;
