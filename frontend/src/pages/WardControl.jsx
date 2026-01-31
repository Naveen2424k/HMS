import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Activity, ShieldCheck, Bed, Plus, Clock, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const WardControl = () => {
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWard, setSelectedWard] = useState(null);

    useEffect(() => {
        fetchOccupancy();
    }, []);

    const fetchOccupancy = async () => {
        try {
            const { data } = await api.get('/ipd/occupancy');
            setWards(data);
            if (data.length > 0 && !selectedWard) setSelectedWard(data[0]);
        } catch (error) {
            console.error('Error fetching occupancy:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Occupied': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'Maintenance': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
            {/* IPD Command Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-600/5 rounded-2xl border border-primary-600/10">
                        <Activity className="text-primary-600" size={18} />
                        <span className="text-[11px] font-black uppercase text-primary-600 tracking-[0.2em]">Institutional Ward Management</span>
                    </div>
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-[1000] text-slate-900 tracking-tight leading-none uppercase italic">
                            Ward <span className="text-primary-600">Control.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 text-lg">
                            <ShieldCheck className="text-emerald-500" size={24} />
                            Real-time Bed Occupancy Monitoring Node
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 bg-white p-4 rounded-[2.5rem] shadow-luxury-sm border border-slate-50">
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-600 transition-all flex items-center gap-3">
                        <Plus size={18} />
                        Initialize Admission
                    </button>
                </div>
            </div>

            {/* Ward Navigation Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Available Units</h3>
                    <div className="space-y-4">
                        {wards.map((ward) => (
                            <button
                                key={ward._id}
                                onClick={() => setSelectedWard(ward)}
                                className={`w-full p-8 rounded-[2.5rem] text-left transition-all duration-500 border-2 group ${selectedWard?._id === ward._id
                                        ? 'bg-slate-950 text-white border-slate-950 shadow-2xl scale-[1.02]'
                                        : 'bg-white text-slate-600 border-slate-50 hover:border-primary-100 hover:shadow-luxury-sm'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${selectedWard?._id === ward._id ? 'bg-primary-600' : 'bg-slate-50'}`}>
                                        <LayoutDashboard size={20} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${selectedWard?._id === ward._id ? 'bg-white/10' : 'bg-slate-100'
                                        }`}>
                                        {ward.type}
                                    </span>
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tighter italic">{ward.name}</h4>
                                <div className="mt-6 flex items-center justify-between opacity-60">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Occupancy</span>
                                    <span className="text-sm font-bold">{ward.beds.filter(b => b.status === 'Occupied').length} / {ward.capacity}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bed Mapping Console */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="luxury-card bg-white p-12 border-none shadow-luxury-lg rounded-[4rem] min-h-[600px] relative overflow-hidden">
                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div>
                                <h3 className="text-3xl font-[1000] text-slate-950 uppercase italic tracking-tighter">{selectedWard?.name} Matrix</h3>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Zone: Floor {selectedWard?.floor} • Status: Active</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-black uppercase text-slate-400">Available</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    <span className="text-[10px] font-black uppercase text-slate-400">Occupied</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10">
                            {selectedWard?.beds.map((bed) => (
                                <div
                                    key={bed._id}
                                    className={`p-8 rounded-[3rem] border-2 transition-all duration-700 group hover:translate-y-[-8px] flex flex-col items-center text-center gap-6 ${bed.status === 'Occupied'
                                            ? 'bg-rose-50 border-rose-100/50 shadow-luxury-sm'
                                            : 'bg-white border-slate-50 hover:shadow-luxury-lg hover:border-primary-100'
                                        }`}
                                >
                                    <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${bed.status === 'Occupied' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <Bed size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className={`text-2xl font-[1000] tracking-tighter uppercase italic leading-none ${bed.status === 'Occupied' ? 'text-rose-900' : 'text-slate-900'
                                            }`}>Node {bed.bedNumber}</h5>
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${getStatusColor(bed.status)}`}>
                                            {bed.status}
                                        </span>
                                    </div>

                                    {bed.status === 'Occupied' ? (
                                        <div className="pt-4 border-t border-rose-100 w-full mt-2">
                                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Subject</p>
                                            <p className="text-xs font-black text-rose-900 uppercase italic truncate">{bed.patient?.user?.name}</p>
                                        </div>
                                    ) : (
                                        <button className="mt-4 text-[9px] font-black uppercase text-primary-600 tracking-widest hover:text-primary-800 flex items-center gap-2">
                                            Allocate <MoveRight size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Background Decor */}
                        <div className="absolute right-[-100px] bottom-[-100px] opacity-[0.02] rotate-12 pointer-events-none">
                            <Activity size={600} strokeWidth={1} className="text-slate-900" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WardControl;
