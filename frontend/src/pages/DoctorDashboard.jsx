import { useState, useEffect } from 'react';
import {
    Calendar,
    User,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    MoreHorizontal,
    Activity,
    Zap,
    Clipboard,
    ShieldCheck,
    Award
} from 'lucide-react';
import AddMedicalRecordModal from '../components/AddMedicalRecordModal';

const DoctorDashboard = () => {
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    return (
        <div className="max-w-[1600px] mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-1000">
            {/* Header / Professional Profile */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary-200">
                            <Award size={36} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-sm"></div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-[800] text-slate-900 tracking-tight">Dr. Clinical Review</h1>
                        <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                            Board Certified Specialist • <span className="text-primary-600 font-bold uppercase text-xs tracking-widest">Medical Wing A</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="luxury-card px-6 py-4 bg-white hidden lg:flex items-center gap-4 border-primary-50">
                        <ShieldCheck className="text-primary-500" size={24} />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Security Status</p>
                            <p className="text-[13px] font-extrabold text-slate-800 mt-1">Encrypted Link Active</p>
                        </div>
                    </div>
                    <button className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all flex items-center gap-3">
                        <Zap size={18} />
                        Quick Diagnosis
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Next Patient Premium Card */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-10 rounded-[3rem] text-white overflow-hidden relative shadow-2xl shadow-primary-200 group">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-10">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                <Activity size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-300 border border-emerald-500/20">Active Session</span>
                        </div>
                        <h3 className="text-primary-100/70 font-black text-xs uppercase tracking-[0.2em]">Current Engagement</h3>
                        <p className="text-4xl font-black mt-3 group-hover:translate-x-1 transition-transform duration-500">Robert Fox</p>
                        <div className="mt-8 flex items-center gap-4 py-4 px-6 bg-white/5 rounded-2xl border border-white/5">
                            <Clock size={20} className="text-primary-300" />
                            <div>
                                <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest opacity-60">Entry Time</p>
                                <p className="text-lg font-bold leading-none mt-1">10:30 AM <span className="text-xs opacity-60 ml-2 font-medium">Standard Patient Slot</span></p>
                            </div>
                        </div>
                        <button className="w-full mt-10 bg-white text-primary-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-50 transition-all active:scale-[0.98] shadow-xl group-hover:shadow-white/5">
                            Focus Session
                        </button>
                    </div>
                    {/* Background Visuals */}
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 bg-primary-400/20 rounded-full blur-[80px]"></div>
                </div>

                <div className="luxury-card p-10 flex flex-col justify-center gap-1">
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">Boarded In</p>
                    <p className="text-6xl font-[900] text-slate-900 tracking-tighter mt-2">24</p>
                    <div className="mt-8 flex items-center gap-3 py-3 px-5 bg-emerald-50 rounded-2xl border border-emerald-100/50 w-fit">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200"></div>
                        <span className="text-emerald-700 text-xs font-black uppercase tracking-widest">08 Remaining Today</span>
                    </div>
                </div>

                <div className="luxury-card p-10 flex flex-col justify-center gap-1">
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">Clinical History</p>
                    <p className="text-6xl font-[900] text-slate-900 tracking-tighter mt-2">1,402</p>
                    <div className="mt-8 flex items-center gap-3 py-3 px-5 bg-primary-50 rounded-2xl border border-primary-100/50 w-fit">
                        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full shadow-sm shadow-primary-200"></div>
                        <span className="text-primary-700 text-xs font-black uppercase tracking-widest">Total Resolved Cases</span>
                    </div>
                </div>
            </div>

            {/* Main Schedule Area */}
            <div className="luxury-card overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Today's Medical Chart</h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">Prioritized patient sequence</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">AM Bloc</button>
                        <button className="px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-100 transition-all">PM Bloc</button>
                    </div>
                </div>
                <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { id: '1', name: 'Jenny Wilson', time: '10:30 AM', type: 'Clinical Scan', status: 'Upcoming', img: 'JW' },
                            { id: '2', name: 'Robert Fox', time: '11:15 AM', type: 'VIP Consultation', status: 'In Review', img: 'RF' },
                            { id: '3', name: 'Cameron Williamson', time: '01:00 PM', type: 'Pathology Rev', status: 'Staged', img: 'CW' },
                            { id: '4', name: 'Jerome Bell', time: '02:30 PM', type: 'Full Bio Scan', status: 'Staged', img: 'JB' },
                        ].map((apt) => (
                            <div key={apt.id} className="flex items-center justify-between p-8 rounded-[2.5rem] border border-slate-50 hover:border-primary-100 hover:shadow-luxury transition-all group relative overflow-hidden bg-white cursor-pointer">
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all duration-500 font-black text-lg group-hover:scale-110">
                                        {apt.img}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-primary-600 transition-colors uppercase tracking-tight">{apt.name}</h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                                <Clock size={12} />
                                                <span>{apt.time}</span>
                                            </div>
                                            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                            <span className="text-primary-500 font-black text-[10px] uppercase tracking-widest leading-none">{apt.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${apt.status === 'In Review' ? 'bg-amber-50 text-amber-600 shadow-sm shadow-amber-100' :
                                        apt.status === 'Upcoming' ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100' : 'bg-slate-50 text-slate-500'
                                        }`}>
                                        {apt.status}
                                    </span>
                                    <div className="flex gap-3 scale-0 group-hover:scale-100 transition-all origin-right duration-500">
                                        <button className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all shadow-sm" title="Complete Record">
                                            <CheckCircle size={20} />
                                        </button>
                                        <button className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all shadow-sm" title="Cancel Bloc">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                                {/* Decorative line */}
                                <div className="absolute left-0 top-0 w-[4px] h-0 bg-primary-500 group-hover:h-full transition-all duration-500"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-8 bg-slate-50/50 flex items-center justify-center gap-6">
                    <button
                        onClick={() => setIsRecordModalOpen(true)}
                        className="flex items-center gap-2 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-primary-600 transition-all"
                    >
                        <Clipboard size={14} />
                        Create New Record
                    </button>
                </div>
            </div>

            <AddMedicalRecordModal
                isOpen={isRecordModalOpen}
                onClose={() => setIsRecordModalOpen(false)}
            />
        </div>
    );
};

export default DoctorDashboard;
