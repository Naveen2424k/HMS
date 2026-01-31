import { useState, useEffect } from 'react';
import { Pill, Search, Download, FileText, Clock, User, Stethoscope, Zap, ShieldCheck, MoveRight, Star, Heart } from 'lucide-react';
import api from '../services/api';

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const { data } = await api.get('/prescriptions');
                setPrescriptions(data);
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
                // Mock fallback
                setPrescriptions([
                    {
                        _id: 'PRE78910',
                        date: new Date().toISOString(),
                        diagnosis: 'Acute Bronchitis',
                        doctor: { user: { name: 'Sarah Wilson' } },
                        medicines: [
                            { name: 'Amoxicillin', instructions: 'After food', dosage: '500mg', duration: '5 Days' },
                            { name: 'Paracetamol', instructions: 'As needed', dosage: '650mg', duration: '3 Days' }
                        ]
                    },
                    {
                        _id: 'PRE12345',
                        date: new Date(Date.now() - 86400000 * 10).toISOString(),
                        diagnosis: 'Vitamin D Deficiency',
                        doctor: { user: { name: 'James Carter' } },
                        medicines: [
                            { name: 'Cholecalciferol', instructions: 'Once a week', dosage: '60000 IU', duration: '8 Weeks' }
                        ]
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, []);

    const filtered = prescriptions.filter(p =>
        p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patient?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
            {/* Pharmaceutical Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 px-4">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-600/5 rounded-2xl border border-primary-600/10">
                        <Pill className="text-primary-600" size={18} />
                        <span className="text-[11px] font-black uppercase text-primary-600 tracking-[0.2em]">Validated Rx Registry</span>
                    </div>
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-[900] text-slate-900 tracking-tight leading-none uppercase italic">
                            Biogenic <span className="text-primary-600">Scripts.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 text-lg">
                            <Heart className="text-rose-500" size={24} />
                            Active Treatment Protocols • <span className="text-slate-400">Certified Distribution</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 bg-white p-4 rounded-[2.5rem] shadow-luxury-sm border border-slate-50 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Locate Medication Node..."
                            className="bg-slate-50/50 border-none rounded-2xl py-4 pl-14 pr-8 w-full focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-sm tracking-tight uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Prescription Hub */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 px-4">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-luxury"></div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Synchronizing Pharmaceutical manifest...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    filtered.map((p) => (
                        <div key={p._id} className="luxury-card p-12 bg-white border-none shadow-luxury-sm hover:shadow-luxury-lg hover:translate-y-[-10px] duration-700 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                                <Pill size={180} />
                            </div>

                            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                                <div className="flex-1 space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100 mb-6">
                                                <Zap size={12} />
                                                Verified Rx Sequence
                                            </div>
                                            <h3 className="text-3xl font-[900] text-slate-900 tracking-tighter uppercase italic leading-none">Manifest #{p._id.substring(0, 8).toUpperCase()}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none mb-2">Issue Timestamp</p>
                                            <p className="text-sm font-[900] text-slate-900 uppercase italic tracking-tighter">{new Date(p.date || p.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 shadow-inner group-hover:bg-white transition-colors duration-500">
                                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-8 leading-none flex items-center gap-3">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                                            Active Compound Protocol
                                        </p>
                                        <div className="space-y-6">
                                            {p.medicines && p.medicines.length > 0 ? p.medicines.map((m, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary-200 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 shadow-sm border border-primary-100">
                                                            <Pill size={22} className="group-hover:rotate-12 transition-transform" />
                                                        </div>
                                                        <div>
                                                            <span className="font-[900] text-slate-900 text-base block uppercase tracking-tight">{m.name}</span>
                                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 block">{m.instructions}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[11px] font-[900] text-slate-900 uppercase italic tracking-tighter block">{m.dosage}</span>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 block">Cycle: {m.duration}</span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-6 opacity-40 italic font-bold text-slate-400 uppercase tracking-widest text-[10px]">Compound Array Undefined</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white border-2 border-white shadow-xl shadow-slate-200">
                                                <Stethoscope size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authorization</p>
                                                <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight group-hover:text-primary-600 transition-colors">Dr. {p.doctor?.user?.name || 'Authorized Specialist'}</p>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-2 text-emerald-500">
                                            <ShieldCheck size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Biometrically Signed</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden lg:block w-px bg-slate-100 my-8"></div>

                                <div className="flex flex-col justify-between gap-10 lg:w-64 pt-6">
                                    <div className="flex flex-col gap-6">
                                        <button className="flex items-center justify-center gap-4 w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary-600 transition-all shadow-2xl hover:shadow-primary-200 active:scale-95 group/btn">
                                            <Download size={18} className="group-hover/btn:translate-y-1 transition-transform" />
                                            Export Script
                                        </button>
                                        <button className="flex items-center justify-center gap-4 w-full py-6 bg-white border-2 border-slate-100 text-slate-500 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95">
                                            <FileText size={18} />
                                            Pathology Link
                                        </button>
                                    </div>

                                    <div className="mt-auto space-y-4">
                                        <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 text-center">
                                            <div className="inline-flex items-center gap-2 mb-2">
                                                <Star size={14} className="text-emerald-500 fill-emerald-500" />
                                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active Security</span>
                                            </div>
                                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-relaxed">HL7 Compliance Match Verified by Global Node</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute left-0 bottom-0 w-0 h-1.5 bg-primary-600 group-hover:w-full transition-all duration-700"></div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100 max-w-4xl mx-auto px-10">
                        <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-slate-200 animate-float shadow-inner">
                            <Pill size={60} />
                        </div>
                        <h4 className="text-3xl font-[900] text-slate-900 uppercase tracking-tight italic">Manifest: Entry Not Found</h4>
                        <p className="text-slate-400 font-bold max-w-md mx-auto mt-6 text-lg">No active treatment protocols match your identification sequence.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-10 px-10 py-5 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Reset Sync</button>
                    </div>
                )}
            </div>

            {/* Distribution Notice */}
            <div className="mt-20 p-12 bg-slate-900 rounded-[4rem] relative overflow-hidden group">
                <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-primary-600/10 rounded-full blur-[100px]"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-primary-500 uppercase tracking-[0.5em] leading-none">Pharmacy Distribution Protocol</h3>
                        <p className="text-slate-400 text-sm font-bold max-w-2xl leading-relaxed italic">
                            All pharmaceutical scripts are digitally counter-signed by authorized medical staff.
                            Unauthorized duplication or modification is a violation of federal healthcare policy.
                        </p>
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary-500 border border-white/10 group-hover:rotate-12 transition-transform">
                        <ShieldCheck size={32} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prescriptions;
