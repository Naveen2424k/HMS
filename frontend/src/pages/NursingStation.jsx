import { useState, useEffect } from 'react';
import { Activity, Thermometer, Wind, Heart, Clock, Search, ShieldCheck, ClipboardList, Zap, ArrowRight, User } from 'lucide-react';
import api from '../services/api';

const NursingStation = () => {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const fetchAdmissions = async () => {
        try {
            // Reusing occupancy to get patients
            const { data } = await api.get('/ipd/occupancy');
            const allAdmissions = data.flatMap(ward => ward.beds.filter(b => b.status === 'Occupied'));
            setAdmissions(allAdmissions);
            if (allAdmissions.length > 0) setSelectedPatient(allAdmissions[0]);
        } catch (error) {
            console.error('Error fetching admissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const vitalsCards = [
        { label: 'Heart Rate', icon: Heart, color: 'text-rose-500', value: '72', unit: 'BPM', status: 'Optimal' },
        { label: 'Temperature', icon: Thermometer, color: 'text-amber-500', value: '98.6', unit: '°F', status: 'Stable' },
        { label: 'Blood Oxygen', icon: Wind, color: 'text-blue-500', value: '98', unit: '%', status: 'Normal' },
        { label: 'Blood Pressure', icon: Activity, color: 'text-emerald-500', value: '120/80', unit: 'mmHg', status: 'Ideal' },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
            {/* Nursing Station Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                        <Activity className="text-rose-500" size={18} />
                        <span className="text-[11px] font-black uppercase text-rose-500 tracking-[0.2em]">Institutional Nursing Terminal</span>
                    </div>
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-[1000] text-slate-900 tracking-tight leading-none uppercase italic">
                            Nursing <span className="text-rose-600">Station.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 text-lg">
                            <ShieldCheck className="text-emerald-500" size={24} />
                            Critical Bio-Metric Monitoring & Care Matrix
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 bg-white p-4 rounded-[2.5rem] shadow-luxury-sm border border-slate-50">
                    <div className="flex items-center gap-4 px-6 border-r border-slate-100">
                        <Clock className="text-primary-600" size={20} />
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift Pulse</p>
                            <p className="font-black text-slate-900 uppercase italic">04:22:15 Remaining</p>
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-600 transition-all flex items-center gap-3 whitespace-nowrap group">
                        Enter Emergency Protocol
                        <Zap size={18} className="group-hover:animate-pulse text-amber-400" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Active Subjects List */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Active Wards Subjects</h3>
                        <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                            {admissions.length} ADMITTED
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[700px] overflow-y-auto no-scrollbar pb-10">
                        {admissions.map((bed) => (
                            <button
                                key={bed._id}
                                onClick={() => setSelectedPatient(bed)}
                                className={`w-full p-8 rounded-[2.5rem] text-left transition-all duration-700 border-2 group relative overflow-hidden ${selectedPatient?._id === bed._id
                                        ? 'bg-slate-950 text-white border-slate-950 shadow-2xl scale-[1.02]'
                                        : 'bg-white text-slate-600 border-slate-50 hover:border-primary-100 hover:shadow-luxury-sm'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className={`p-3 rounded-xl ${selectedPatient?._id === bed._id ? 'bg-primary-600' : 'bg-slate-50'}`}>
                                        <User size={20} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${selectedPatient?._id === bed._id ? 'bg-white/10' : 'bg-slate-100'
                                        }`}>
                                        Node {bed.bedNumber}
                                    </span>
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tighter italic relative z-10">{bed.patient?.user?.name}</h4>
                                <p className={`mt-2 text-[10px] font-black uppercase tracking-widest opacity-60 relative z-10 ${selectedPatient?._id === bed._id ? 'text-primary-400' : 'text-slate-400'
                                    }`}>
                                    Ward: {bed.ward?.name}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Patient Care Dashboard */}
                <div className="lg:col-span-3 space-y-10">
                    {selectedPatient ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {vitalsCards.map((vital, i) => (
                                    <div key={i} className="luxury-card p-10 bg-white border-none shadow-luxury-sm group hover:shadow-luxury-lg transition-all duration-700">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center bg-slate-50 ${vital.color} group-hover:scale-110 transition-transform duration-500`}>
                                                <vital.icon size={28} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">{vital.status}</span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{vital.label}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h4 className="text-4xl font-[900] text-slate-950 tracking-tighter italic">{vital.value}</h4>
                                            <span className="text-xs font-black text-slate-300 uppercase">{vital.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid lg:grid-cols-2 gap-10">
                                {/* Vitals Entry Node */}
                                <div className="luxury-card p-12 bg-white border-none shadow-luxury-lg rounded-[3.5rem] space-y-10">
                                    <h3 className="text-2xl font-[1000] text-slate-950 uppercase italic tracking-tighter flex items-center gap-4">
                                        <ClipboardList className="text-primary-600" size={24} />
                                        Log Vitals Snapshot
                                    </h3>
                                    <div className="grid grid-cols-2 gap-8">
                                        {['BP Systolic', 'BP Diastolic', 'Temperature', 'Oxygen Sat'].map((label) => (
                                            <div key={label} className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">{label}</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-100 rounded-3xl py-6 px-8 outline-none font-black text-xl text-slate-900 transition-all shadow-inner"
                                                    placeholder="---"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-8 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-primary-600 transition-all duration-700 shadow-2xl flex items-center justify-center gap-5 group">
                                        Transmit Vital Matrix <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>

                                {/* Medication Roadmap */}
                                <div className="luxury-card p-12 bg-slate-950 text-white border-none shadow-2xl rounded-[3.5rem] relative overflow-hidden">
                                    <div className="relative z-10 space-y-10">
                                        <h3 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter flex items-center gap-4">
                                            <Activity className="text-primary-400" size={24} />
                                            Active Roadmap
                                        </h3>

                                        <div className="space-y-8">
                                            {[
                                                { time: '08:00 AM', Task: 'Morphine Dosage (10mg)', status: 'COMPLETED' },
                                                { time: '12:00 PM', Task: 'Physical Therapy session', status: 'PENDING' },
                                                { time: '04:00 PM', Task: 'Dressing Change', status: 'PENDING' },
                                                { time: '08:00 PM', Task: 'Vital Monitoring', status: 'PENDING' },
                                            ].map((task, i) => (
                                                <div key={i} className="flex items-center gap-8 group">
                                                    <div className="text-center w-24">
                                                        <p className="text-xs font-black text-white/40 tracking-widest">{task.time}</p>
                                                    </div>
                                                    <div className="flex-1 p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all duration-500 flex items-center justify-between">
                                                        <span className="font-black uppercase italic tracking-tight text-sm">{task.Task}</span>
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary-500/20 text-primary-400'
                                                            }`}>
                                                            {task.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Neural Decor */}
                                    <div className="absolute right-[-40px] top-[-40px] opacity-[0.05] pointer-events-none">
                                        <Zap size={300} strokeWidth={1} className="text-primary-500" />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[600px] text-slate-300">
                            <Activity size={100} strokeWidth={1} className="animate-pulse mb-8" />
                            <p className="font-black uppercase tracking-[0.5em] text-lg italic">Select a Subject Node to Initialize Care Matrix</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NursingStation;
