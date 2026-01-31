import { Heart, Brain, Bone, Eye, Stethoscope, Baby, Pill, Activity, ShieldCheck, Microscope, Thermometer, UserCheck, Zap, Globe, ArrowRight, MoveRight, Phone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
    const categories = [
        { title: 'Emergency Node', icon: Activity, count: '24/7 Rapid Response', color: 'rose', gradient: 'from-rose-600 to-pink-600' },
        { title: 'Digital Diagnostics', icon: Microscope, count: 'High-Fidelity Lab', color: 'blue', gradient: 'from-blue-600 to-indigo-600' },
        { title: 'Precision Surgery', icon: Stethoscope, count: 'Elite Surgical Core', color: 'indigo', gradient: 'from-indigo-600 to-purple-600' },
        { title: 'Biogenic Pharmacy', icon: Pill, count: 'Global Logistic Link', color: 'emerald', gradient: 'from-emerald-600 to-teal-600' },
    ];

    const services = [
        {
            icon: Heart,
            name: 'Cardiology Core',
            tag: 'Elite Performance',
            desc: 'Non-invasive cardiac mapping and high-precision interventional protocols.',
            features: ['ECG Biometry', 'Angiographic Node', 'Cardiac Restoration'],
            color: 'rose'
        },
        {
            icon: Brain,
            name: 'Neural Control',
            tag: 'Advanced Cognition',
            desc: 'High-fidelity mapping of neural pathways and complex brain disorder mitigation.',
            features: ['MRI High-Res', 'Neuro-Stroke Unit', 'Cognitive Sync'],
            color: 'indigo'
        },
        {
            icon: Bone,
            name: 'Orthopedic Hub',
            tag: 'Structural Integrity',
            desc: 'Robotic-assisted bone restoration and advanced musculoskeletal engineering.',
            features: ['Kinetic Surgery', 'Ligament Repair', 'Bio-Physical Rehab'],
            color: 'amber'
        },
        {
            icon: Baby,
            name: 'Pediatric Wing',
            tag: 'Future Generation',
            desc: 'Ultra-gentle medical support and developmental monitoring for infants.',
            features: ['Neonatal Node', 'Immune Sequence', 'Biometric Growth'],
            color: 'teal'
        },
        {
            icon: Eye,
            name: 'Optical Focus',
            tag: 'Visual Fidelity',
            desc: 'Quantum-level laser vision correction and advanced ocular pathology intervention.',
            features: ['Precision LASIK', 'Retinal Scanning', 'Glaucoma Logic'],
            color: 'sky'
        },
        {
            icon: Stethoscope,
            name: 'Internal Systems',
            tag: 'Bio-Management',
            desc: 'Comprehensive internal audit of human biological systems and wellness protocols.',
            features: ['Full Bio-Scan', 'Endocrine Logic', 'Metabolic Sync'],
            color: 'slate'
        }
    ];

    return (
        <div className="relative min-h-screen bg-white">
            {/* Neural Background Engine */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-600/5 rounded-full blur-[150px] animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px] animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.05]"></div>
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto pb-40 space-y-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 px-6 pt-10">
                {/* Immersive Header Block */}
                <div className="relative rounded-[5rem] overflow-hidden bg-slate-950 p-16 lg:p-24 text-white shadow-[0_80px_150px_-30px_rgba(15,23,42,0.4)] border border-white/5 group">
                    {/* Background bloom inside hero */}
                    <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary-600/10 rounded-full blur-[180px] -mr-80 -mt-80 animate-pulse pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]"></div>
                    <div className="relative z-10 grid lg:grid-cols-2 gap-32 items-center">
                        <div className="space-y-16">
                            <div className="flex flex-col gap-6">
                                <div className="inline-flex items-center gap-6 px-10 py-4 bg-white/5 rounded-[2rem] text-[12px] font-[1000] uppercase tracking-[0.5em] backdrop-blur-xl border border-white/10 italic shadow-2xl">
                                    <ShieldCheck size={20} className="text-primary-500" />
                                    <span>Authorized Institutional Capabilities</span>
                                </div>
                                <h1 className="text-6xl lg:text-7xl font-[1000] tracking-tighter leading-[0.8] uppercase italic opacity-10">Capabilities</h1>
                            </div>

                            <div className="space-y-8">
                                <h2 className="text-6xl lg:text-8xl font-[1000] tracking-tighter leading-[0.85] uppercase italic">
                                    Adaptive <br />
                                    <span className="text-primary-600 drop-shadow-2xl">Bio-System Core.</span>
                                </h2>
                                <p className="text-slate-400 text-3xl font-bold leading-snug max-w-2xl italic border-l-8 border-primary-600/20 pl-10">
                                    Our operational modules utilize high-fidelity computational diagnostics to redefine the boundaries of human vitality.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-10">
                                <Link to="/doctors" className="group bg-primary-600 text-white px-16 py-8 rounded-[3rem] font-[1000] text-[12px] uppercase tracking-[0.6em] flex items-center gap-8 hover:bg-white hover:text-slate-950 transition-all duration-700 shadow-[0_50px_100px_-20px_rgba(59,130,246,0.5)] active:scale-95 italic relative overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-950 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 opacity-10"></div>
                                    <span>Deploy Specialist</span>
                                    <ArrowRight className="group-hover:translate-x-4 transition-transform duration-700" size={24} />
                                </Link>
                                <div className="hidden sm:flex items-center gap-6 px-10 py-8 border-4 border-white/10 rounded-[3rem] opacity-40 hover:opacity-100 transition-opacity cursor-pointer group/node">
                                    <Globe size={24} className="group-hover/node:rotate-180 transition-transform duration-[2000ms]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global Sync Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block relative group/visual">
                            <div className="w-[600px] h-[600px] bg-white/5 rounded-[5rem] border-4 border-white/10 backdrop-blur-3xl flex items-center justify-center p-24 animate-float shadow-luxury-2xl group flex-col gap-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary-500/20 blur-[80px] animate-pulse rounded-full"></div>
                                    <Microscope size={280} className="text-primary-500 relative z-10 group-hover/visual:scale-110 transition-transform duration-1000" strokeWidth={1} />
                                </div>
                                <div className="flex items-center gap-4 bg-primary-600/20 px-8 py-3 rounded-2xl border border-primary-500/30">
                                    <Sparkles size={16} className="text-primary-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-400">High-Fidelity Optical Core</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-primary-600/10 rounded-full blur-[120px] pointer-events-none group-hover/visual:scale-125 transition-transform duration-[2000ms]"></div>
                        </div>
                    </div>
                </div>

                {/* Tactical Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-6">
                    {categories.map((cat, i) => (
                        <div key={i} className="luxury-card p-14 flex flex-col items-center text-center gap-10 group relative overflow-hidden bg-white/80 backdrop-blur-2xl border-2 border-white/50 shadow-luxury-md hover:shadow-luxury-2xl hover:translate-y-[-10px] transition-all duration-1000 rounded-[4rem]">
                            <div className={`p-8 bg-gradient-to-br ${cat.gradient} text-white rounded-[2.5rem] transition-all duration-1000 group-hover:scale-110 group-hover:rotate-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative z-10 border-4 border-white/20`}>
                                <cat.icon size={44} strokeWidth={1.5} />
                            </div>
                            <div className="relative z-10 space-y-3">
                                <h4 className="text-slate-950 font-[1000] text-3xl tracking-tighter uppercase italic leading-none group-hover:text-primary-600 transition-colors">{cat.title}</h4>
                                <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-950/5 rounded-full border border-slate-900/5">
                                    <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse"></div>
                                    <p className="text-primary-600 text-[10px] font-black uppercase tracking-[0.4em] italic">{cat.count}</p>
                                </div>
                            </div>
                            <div className="absolute right-[-40px] bottom-[-40px] opacity-[0.03] group-hover:scale-150 group-hover:rotate-12 transition-all duration-[2000ms] text-slate-950">
                                <cat.icon size={250} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Module Catalog Index */}
                <div className="space-y-24">
                    <div className="text-center space-y-10">
                        <div className="flex items-center justify-center gap-6">
                            <div className="h-px w-20 bg-slate-200"></div>
                            <h3 className="text-[12px] font-[1000] text-primary-600 uppercase tracking-[0.6em] leading-none italic">Institutional Catalog v4.0.1</h3>
                            <div className="h-px w-20 bg-slate-200"></div>
                        </div>
                        <h2 className="text-6xl lg:text-7xl font-[1000] text-slate-950 tracking-tighter uppercase leading-none italic">Clinical Superiority <br />Infrastructure.</h2>
                        <div className="w-48 h-2.5 bg-slate-950 mx-auto rounded-full shadow-inner opacity-10"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
                        {services.map((service, idx) => (
                            <div key={idx} className="luxury-card p-14 bg-white/70 backdrop-blur-xl border-4 border-white shadow-luxury-md hover:shadow-luxury-2xl hover:translate-y-[-16px] transition-all duration-1000 group relative flex flex-col justify-between rounded-[4.5rem] overflow-hidden">
                                {/* Grid overlay for individual cards */}
                                <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] opacity-[0.03] pointer-events-none"></div>

                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:rotate-12 group-hover:scale-150 transition-all duration-[3000ms] pointer-events-none text-slate-950">
                                    <service.icon size={280} strokeWidth={1} />
                                </div>

                                <div>
                                    <div className="flex justify-between items-start mb-16 relative z-10">
                                        <div className={`w-24 h-24 bg-slate-950 text-white rounded-[2.2rem] flex items-center justify-center group-hover:bg-primary-600 group-hover:shadow-glow-primary transition-all duration-700 shadow-2xl border-[6px] border-white ring-2 ring-slate-50 rotate-3 group-hover:rotate-[-6deg]`}>
                                            <service.icon size={44} strokeWidth={1.5} />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-[1000] text-slate-950 italic bg-white px-6 py-3 rounded-full border-2 border-slate-100 uppercase tracking-[0.4em] leading-none shadow-luxury-sm">
                                                {service.tag}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-4xl font-[1000] text-slate-950 mb-8 group-hover:text-primary-600 transition-colors tracking-tighter leading-none uppercase italic relative z-10">
                                        {service.name}
                                    </h3>
                                    <p className="text-slate-500 font-bold leading-relaxed mb-12 relative z-10 text-xl italic group-hover:text-slate-600">
                                        {service.desc}
                                    </p>

                                    <div className="space-y-6 mb-16 relative z-10">
                                        {service.features.map((feat, i) => (
                                            <div key={i} className="flex items-center gap-6 text-slate-400 group-hover:text-slate-600 transition-colors group/feat">
                                                <div className="w-2.5 h-2.5 bg-primary-500 rounded-full shadow-glow-primary group-hover/feat:scale-150 transition-transform"></div>
                                                <span className="text-[11px] font-[1000] uppercase tracking-[0.3em] italic">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Link to="/doctors" className="flex items-center justify-between w-full p-8 bg-slate-950 text-white rounded-[3.2rem] font-[1000] text-[12px] uppercase tracking-[0.5em] hover:bg-primary-600 transition-all duration-700 cursor-pointer shadow-luxury-lg group/btn relative z-10 italic overflow-hidden">
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                                    <span>Initialize Prototype Protocol</span>
                                    <ArrowRight size={22} className="group-hover/btn:translate-x-4 transition-transform duration-700" />
                                </Link>
                                <div className="absolute right-0 bottom-0 w-0 h-4 bg-primary-600 group-hover:w-full transition-all duration-[1500ms]"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Critical Box */}
                <div className="bg-slate-950 rounded-[6rem] p-16 lg:p-24 text-white relative overflow-hidden group border border-white/5 shadow-luxury-2xl">
                    {/* Background bloom inside box */}
                    <div className="absolute top-[-200px] left-[-200px] w-[800px] h-[800px] bg-primary-600 opacity-[0.2] rounded-full blur-[150px] transition-transform duration-[3000ms] group-hover:scale-125 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] opacity-[0.05] pointer-events-none"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-32 items-center">
                        <div className="space-y-16">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-6 px-10 py-4 bg-rose-500/10 text-rose-500 rounded-[2.5rem] text-[12px] font-[1000] uppercase tracking-[0.5em] border-2 border-rose-500/20 italic backdrop-blur-md">
                                    <Zap size={22} className="animate-pulse" />
                                    <span>Emergency Node Online</span>
                                </div>
                                <h1 className="text-6xl lg:text-7xl font-[1000] tracking-tighter leading-[0.8] uppercase italic opacity-20">24/7 Response</h1>
                            </div>

                            <h3 className="text-6xl lg:text-8xl font-[1000] tracking-tighter leading-[0.85] uppercase italic">
                                Biology Doesn't <br />
                                <span className="text-primary-600 drop-shadow-2xl">Acknowledge Delay.</span>
                            </h3>
                            <p className="text-slate-400 text-3xl font-bold leading-snug max-w-2xl italic border-l-8 border-rose-600/20 pl-10">
                                Our primary trauma unit is synchronized with institutional protocols to ensure clinical superiority in zero-time.
                            </p>

                            <div className="flex flex-wrap gap-10 pt-10">
                                <a href="tel:1066" className="px-16 py-8 bg-primary-600 text-white rounded-[3.5rem] font-[1000] text-[12px] uppercase tracking-[0.6em] hover:bg-white hover:text-slate-950 transition-all duration-700 flex items-center gap-10 shadow-[0_40px_80px_-20px_rgba(59,130,246,0.6)] active:scale-95 group/call italic relative overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-950 translate-x-[-100%] group-hover/call:translate-x-0 transition-transform duration-700 opacity-10"></div>
                                    <Phone size={24} className="group-hover/call:rotate-12 transition-transform duration-500" />
                                    <span>Trigger Override 1066</span>
                                </a>
                                <Link to="/contact" className="px-16 py-8 bg-white/5 border-4 border-white/10 text-white rounded-[3.5rem] font-[1000] text-[12px] uppercase tracking-[0.5em] hover:bg-white hover:text-slate-950 transition-all duration-700 flex items-center gap-8 italic">
                                    Support Manifest
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:flex items-center justify-center relative group/globe">
                            <div className="absolute inset-0 bg-primary-600/10 blur-[120px] rounded-full animate-pulse"></div>
                            <div className="relative group-hover:scale-110 transition-transform duration-[3000ms]">
                                <Globe size={550} strokeWidth={0.5} className="text-primary-500/20 animate-spin-slow" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Activity size={80} className="text-primary-500 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Progress Bar for the top */}
            <div className="fixed top-0 left-0 w-full h-1 bg-primary-600 z-[200] opacity-20 pointer-events-none"></div>
        </div>
    );
};

export default Services;
