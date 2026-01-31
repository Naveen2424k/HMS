import { SignUp } from '@clerk/clerk-react';
import { Activity, ShieldCheck, Sparkles, ArrowRight, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#0f172a]">

            {/* Dynamic Background Engine */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute top-[30%] left-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            </div>

            {/* Main Register Node */}
            <div className="relative z-10 w-full max-w-[1250px] grid lg:grid-cols-2 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in duration-700">

                {/* Visual Branding Portal */}
                <div className="hidden lg:flex flex-col justify-between p-20 relative overflow-hidden border-r border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-16">
                            <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 relative group cursor-pointer">
                                <div className="absolute inset-0 bg-white rounded-3xl scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                                <Activity size={36} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">MediCare</h1>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] leading-none mt-2">Institutional Genesis</p>
                            </div>
                        </div>

                        <div className="space-y-8 max-w-md">
                            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
                                <UserPlus className="text-emerald-400" size={18} />
                                <span className="text-[10px] font-black uppercase text-emerald-100 tracking-[0.2em]">Quantum-Secure Registry Port</span>
                            </div>
                            <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter">
                                Begin Your <br />
                                <span className="text-emerald-500">Evolution.</span>
                            </h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed">
                                Join our elite medical network. Experience high-fidelity patient management and precision data control.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-10">
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status</p>
                                    <p className="text-white font-black uppercase tracking-tighter italic">Protocol Ready</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secure Registry Section */}
                <div className="p-12 lg:p-24 flex flex-col justify-center bg-white/5 items-center">
                    <div className="max-w-md w-full mx-auto space-y-12">
                        <div className="space-y-4 mb-8 text-center">
                            <h2 className="text-5xl font-black text-white tracking-tighter leading-none uppercase italic">Genesis Port</h2>
                            <p className="text-slate-400 font-bold flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em]">
                                <Sparkles size={16} className="text-emerald-400" />
                                Official Registry Protocol
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <SignUp
                                appearance={{
                                    elements: {
                                        formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-sm font-black uppercase tracking-widest py-4 rounded-2xl transition-all',
                                        card: 'bg-transparent shadow-none border-none p-0',
                                        headerTitle: 'hidden',
                                        headerSubtitle: 'hidden',
                                        socialButtonsBlockButton: 'bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all rounded-2xl py-4',
                                        socialButtonsBlockButtonText: 'text-white font-bold',
                                        dividerLine: 'bg-white/10',
                                        dividerText: 'text-slate-500 font-black uppercase tracking-widest text-[10px]',
                                        formFieldLabel: 'text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-4',
                                        formFieldInput: 'bg-white/5 border border-white/10 focus:border-emerald-500/50 px-6 py-4 rounded-2xl text-white placeholder:text-slate-600 transition-all outline-none',
                                        footerActionText: 'text-slate-500 font-bold',
                                        footerActionLink: 'text-emerald-400 hover:text-white font-black uppercase tracking-widest text-xs transition-colors',
                                        identityPreviewText: 'text-white font-bold',
                                        identityPreviewEditButtonIcon: 'text-emerald-400',
                                    }
                                }}
                                signInUrl="/login"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Infrastructure Badge */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-4 w-16 bg-white/20 rounded-sm"></div>
                    <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">ISO 27001 SECURE</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="h-4 w-16 bg-white/20 rounded-sm"></div>
                    <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">HIPAA COMPLANT</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
