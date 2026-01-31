import { Shield, Activity, Users, Award, Zap, Globe, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const About = () => {
    return (
        <div className="relative min-h-screen bg-white">
            {/* Neural Background Engine */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-600/5 rounded-full blur-[150px] animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px] animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.05]"></div>
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto pb-40 space-y-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 px-6 pt-10">
                {/* Elite Mission Header */}
                <div className="text-center space-y-16 pt-20">
                    <div className="flex flex-col items-center gap-8">
                        <div className="p-5 bg-slate-950 text-white rounded-[1.8rem] shadow-2xl group transition-all duration-700 hover:rotate-12 hover:scale-110">
                            <Shield size={36} strokeWidth={1.5} />
                        </div>
                        <div className="inline-flex items-center gap-4 px-8 py-3 bg-primary-600/5 rounded-[2rem] border border-primary-600/10 shadow-sm backdrop-blur-md">
                            <Zap className="text-primary-600 animate-pulse" size={20} />
                            <span className="text-[12px] font-[1000] uppercase text-primary-600 tracking-[0.5em] italic">Infrastructure Manifest v4.0.1</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-8xl lg:text-[11rem] font-[1000] text-slate-950 tracking-tighter uppercase leading-[0.8] italic opacity-10">Revolution.</h1>
                        <h2 className="text-8xl lg:text-[10rem] font-[1000] text-slate-950 tracking-tighter uppercase leading-[0.85] -mt-12 lg:-mt-24 drop-shadow-sm">
                            Redefining <br />
                            <span className="text-primary-600 italic">Humanity Hub.</span>
                        </h2>
                    </div>

                    <p className="text-3xl text-slate-500 font-bold max-w-3xl mx-auto leading-snug italic border-x-4 border-slate-100 px-12">
                        We are constructing the future of biological management through high-fidelity technology and uncompromising clinical excellence protocols.
                    </p>
                </div>

                {/* Core Directives Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-6 italic">
                    <div className="luxury-card p-20 bg-white/80 backdrop-blur-3xl border-4 border-white shadow-luxury-md group relative overflow-hidden transition-all duration-1000 hover:translate-y-[-16px] rounded-[5rem]">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 group-hover:scale-150 transition-all duration-[3000ms] pointer-events-none text-slate-950">
                            <Shield size={300} strokeWidth={1} />
                        </div>
                        <div className="w-24 h-24 bg-slate-950 text-white rounded-[2.2rem] flex items-center justify-center mb-14 shadow-2xl group-hover:bg-primary-600 group-hover:rotate-12 transition-all duration-700 border-[6px] border-white ring-2 ring-slate-50">
                            <Shield size={44} strokeWidth={1.5} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <h3 className="text-5xl font-[1000] text-slate-950 tracking-tighter uppercase leading-none italic group-hover:text-primary-600 transition-colors">Our Mission Node</h3>
                            <p className="text-slate-500 text-xl leading-relaxed font-bold italic group-hover:text-slate-600 transition-colors">
                                To deploy absolute, high-fidelity medical services to the global population. We believe that elite biological maintenance is a fundamental human right encoded in our DNA.
                            </p>
                            <div className="pt-10 flex items-center gap-5 text-primary-600 font-[1000] text-[11px] uppercase tracking-[0.5em] italic opacity-50 group-hover:opacity-100 transition-opacity">
                                <span>Protocol Initialized</span>
                                <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse shadow-glow-primary"></div>
                            </div>
                        </div>
                    </div>

                    <div className="luxury-card p-20 bg-white/80 backdrop-blur-3xl border-4 border-white shadow-luxury-md group relative overflow-hidden transition-all duration-1000 hover:translate-y-[-16px] rounded-[5rem]">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 group-hover:scale-150 transition-all duration-[3000ms] pointer-events-none text-slate-950">
                            <Activity size={300} strokeWidth={1} />
                        </div>
                        <div className="w-24 h-24 bg-slate-950 text-white rounded-[2.2rem] flex items-center justify-center mb-14 shadow-2xl group-hover:bg-emerald-600 group-hover:rotate-[-12deg] transition-all duration-700 border-[6px] border-white ring-2 ring-slate-50">
                            <Activity size={44} strokeWidth={1.5} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <h3 className="text-5xl font-[1000] text-slate-950 tracking-tighter uppercase leading-none italic group-hover:text-emerald-600 transition-colors">Our Pulse Vision</h3>
                            <p className="text-slate-500 text-xl leading-relaxed font-bold italic group-hover:text-slate-600 transition-colors">
                                To serve as the primary global hub for digital healthcare, establishing a high-performance standard for biological safety, innovation, and clinical mastery.
                            </p>
                            <div className="pt-10 flex items-center gap-5 text-emerald-600 font-[1000] text-[11px] uppercase tracking-[0.5em] italic opacity-50 group-hover:opacity-100 transition-opacity">
                                <span>Horizon Horizon 2030</span>
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-glow-emerald"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Elite Stats Command Banner */}
                <div className="bg-slate-950 rounded-[6rem] p-32 lg:p-40 text-white overflow-hidden relative group shadow-[0_80px_150px_-30px_rgba(15,23,42,0.4)] border border-white/5">
                    {/* Background bloom */}
                    <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary-600/10 rounded-full blur-[180px] -mr-80 -mt-80 animate-pulse pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]"></div>
                    <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] opacity-[0.05] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 justify-between items-center gap-32">
                        <div className="space-y-20">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-6 px-10 py-4 bg-white/5 rounded-[2.5rem] border border-white/10 italic text-[12px] font-[1000] uppercase tracking-[0.5em]">
                                    <Sparkles className="text-primary-500" size={20} />
                                    <span>Infrastructure Asset Manifest</span>
                                </div>
                                <h1 className="text-8xl lg:text-9xl font-[1000] tracking-tighter leading-none uppercase italic">Clinical <br /> Superiority.</h1>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                                {[
                                    { icon: Users, label: 'Specialist Core', text: 'Institutional Staff Node' },
                                    { icon: Award, label: 'Sovereign Rank', text: 'Global Precision Tier' },
                                    { icon: Activity, label: 'Quantum Tech', text: 'High-Fidelity Scanning' },
                                    { icon: Globe, label: 'System Node', text: 'Universal Access Uplink' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-8 group/item cursor-pointer">
                                        <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-white/10 group-hover/item:bg-primary-600 group-hover/item:border-primary-600 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-700 shadow-2xl">
                                            <item.icon size={28} strokeWidth={1.5} className="text-primary-400 group-hover/item:text-white transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-lg font-[1000] uppercase tracking-widest text-white leading-none italic">{item.label}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-primary-600 rounded-full"></div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{item.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative w-full flex flex-col items-center lg:items-end group/pulse">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none group-hover/pulse:scale-110 transition-transform duration-[3000ms] text-white">
                                <ShieldCheck size={700} strokeWidth={0.5} className="animate-spin-slow" />
                            </div>
                            <div className="relative text-right space-y-4">
                                <p className="text-[14rem] md:text-[20rem] font-[1000] leading-none opacity-20 select-none italic tracking-tighter uppercase group-hover:text-primary-600 transition-colors duration-1000">24/7</p>
                                <div className="flex items-center justify-end gap-6 bg-primary-600/10 px-10 py-5 rounded-full border border-primary-500/20 backdrop-blur-md">
                                    <div className="w-3 h-3 bg-primary-500 rounded-full animate-ping"></div>
                                    <p className="text-3xl font-[1000] text-primary-500 uppercase tracking-[0.4em] italic leading-none">Global Pulse Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Progress bar visual */}
            <div className="fixed top-0 left-0 w-full h-1 bg-primary-600 z-[200] opacity-20 pointer-events-none"></div>
        </div>
    );
};

export default About;
