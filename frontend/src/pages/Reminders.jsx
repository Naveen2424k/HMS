import { useState, useEffect } from 'react';
import { Bell, Plus, Trash, Check, Clock, Calendar, Zap, ShieldCheck, Globe, MoveRight, X, Heart, AlertCircle, Activity } from 'lucide-react';

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newReminder, setNewReminder] = useState({ title: '', time: '', dosage: '' });

    useEffect(() => {
        const savedReminders = JSON.parse(localStorage.getItem('medicare_reminders')) || [];
        setReminders(savedReminders);
    }, []);

    const saveReminders = (updatedReminders) => {
        setReminders(updatedReminders);
        localStorage.setItem('medicare_reminders', JSON.stringify(updatedReminders));
    };

    const addReminder = (e) => {
        e.preventDefault();
        const updated = [{ ...newReminder, id: Date.now(), active: true }, ...reminders];
        saveReminders(updated);
        setNewReminder({ title: '', time: '', dosage: '' });
        setIsAdding(false);
    };

    const deleteReminder = (id) => {
        const updated = reminders.filter(r => r.id !== id);
        saveReminders(updated);
    };

    const toggleActive = (id) => {
        const updated = reminders.map(r => r.id === id ? { ...r, active: !r.active } : r);
        saveReminders(updated);
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
            {/* Vigilance Commander Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 px-4">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-600/5 rounded-2xl border border-primary-600/10">
                        <Bell className="text-primary-600" size={18} />
                        <span className="text-[11px] font-black uppercase text-primary-600 tracking-[0.2em]">Bio-Temporal Synchronizer</span>
                    </div>
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-[900] text-slate-900 tracking-tight leading-none uppercase italic">
                            Dosage <span className="text-primary-600">Alarms.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 text-lg">
                            <Activity className="text-emerald-500" size={24} />
                            Active Monitoring Protocol • <span className="text-slate-400">Zero-Latency Sync</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 bg-white p-4 rounded-3xl shadow-luxury-sm border border-slate-50 mr-2">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Node</p>
                            <p className="text-sm font-black text-emerald-600 mt-2 flex items-center justify-end gap-2 text-right">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                Live Sync
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                            <Globe size={22} />
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-[900] uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-2xl hover:shadow-primary-200 active:scale-95 group text-xs"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        Initialize Reminder
                    </button>
                </div>
            </div>

            {isAdding && (
                <div className="max-w-4xl mx-auto luxury-card p-12 bg-white border-none shadow-luxury-lg animate-in slide-in-from-top-12 duration-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                        <Bell size={200} />
                    </div>

                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-[1.5rem] flex items-center justify-center shadow-inner border-2 border-white">
                                <Plus size={30} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-[900] text-slate-900 uppercase italic tracking-tighter leading-none">New Protocol</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Define Temporal Sequence</p>
                            </div>
                        </div>
                        <button onClick={() => setIsAdding(false)} className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"><X size={24} /></button>
                    </div>

                    <form onSubmit={addReminder} className="space-y-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Compound Name</label>
                                <div className="relative group">
                                    <Heart className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. OMEGA QUANTUM"
                                        value={newReminder.title}
                                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-[2rem] py-6 pl-16 pr-8 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-[900] text-slate-900 uppercase tracking-tight text-sm placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Temporal Node (Time)</label>
                                <div className="relative group">
                                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        required
                                        type="time"
                                        value={newReminder.time}
                                        onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-[2rem] py-6 pl-16 pr-8 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-black text-slate-700 tracking-tight text-base"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Dosage Logistics / Instructions</label>
                                <div className="relative group">
                                    <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="e.g. 500mg via Oral Path, Post-Nutrient Sync"
                                        value={newReminder.dosage}
                                        onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-[2rem] py-6 pl-16 pr-8 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-700 tracking-tight text-sm placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-emerald-600 transition-all shadow-2xl hover:shadow-emerald-200 active:scale-[0.98] flex items-center gap-4 group/btn"
                            >
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                Activate Temporal Node
                                <MoveRight className="group-hover/btn:translate-x-3 transition-transform duration-500" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 px-4">
                {reminders.length === 0 ? (
                    <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100 max-w-4xl mx-auto px-10">
                        <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-slate-200 animate-float shadow-inner">
                            <Clock size={60} />
                        </div>
                        <h3 className="text-3xl font-[900] text-slate-900 uppercase tracking-tight italic">Reminders: Null</h3>
                        <p className="text-slate-400 font-bold max-w-md mx-auto mt-6 text-lg">Your bio-temporal manifest is currently clear. No dose alarms prioritized.</p>
                        <button onClick={() => setIsAdding(true)} className="mt-10 px-10 py-5 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3 mx-auto">
                            <Plus size={18} />
                            Create Initial Event
                        </button>
                    </div>
                ) : (
                    reminders.map((reminder) => (
                        <div key={reminder.id} className={`luxury-card p-10 bg-white border-none shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-700 group relative overflow-hidden ${!reminder.active && 'opacity-60 grayscale'}`}>
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                                <Clock size={150} />
                            </div>

                            <div className="flex flex-col h-full relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <button
                                        onClick={() => toggleActive(reminder.id)}
                                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-inner border-4 border-white ${reminder.active ? 'bg-emerald-50 text-emerald-500 hover:bg-slate-900 hover:text-white' : 'bg-slate-100 text-slate-300'}`}
                                    >
                                        <Check size={28} className={reminder.active ? 'scale-110' : ''} />
                                    </button>
                                    <div className="text-right">
                                        <div className={`p-4 rounded-2xl border-2 ${reminder.active ? 'bg-primary-50 text-primary-600 border-primary-100 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-100'} transition-all`}>
                                            <div className="flex items-center gap-3 text-xl font-[900] italic tracking-tighter">
                                                <Clock size={22} className={reminder.active ? 'animate-spin-slow' : ''} />
                                                {reminder.time}
                                            </div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.4em] mt-2 text-center">Daily Cycle</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group-hover:bg-white transition-colors duration-500">
                                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-3 leading-none flex items-center gap-2">
                                            {reminder.active ? (
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                                            ) : (
                                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                            )}
                                            Compound Entity
                                        </p>
                                        <h4 className={`text-2xl font-[900] uppercase tracking-tighter italic leading-tight ${reminder.active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>{reminder.title}</h4>
                                    </div>

                                    <div className="px-6 py-4 bg-slate-50/30 rounded-2xl">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Transmission Logic</p>
                                        <p className="text-sm font-bold text-slate-600 leading-relaxed italic">{reminder.dosage}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-50">
                                    <div className="flex items-center gap-4 text-amber-500">
                                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                            <Bell size={18} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{reminder.active ? 'Armed & Ready' : 'Standby Mode'}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteReminder(reminder.id)}
                                        className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300"
                                        title="Purge Node"
                                    >
                                        <Trash size={22} />
                                    </button>
                                </div>
                                <div className={`absolute left-0 bottom-0 h-1.5 transition-all duration-700 ${reminder.active ? 'bg-primary-600 w-full group-hover:bg-emerald-500' : 'bg-slate-200 w-1/4'}`}></div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Compliance Banner */}
            <div className="mt-20 p-12 bg-slate-900 rounded-[5rem] relative overflow-hidden group border border-white/5 shadow-22xl">
                <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-primary-600/10 rounded-full blur-[120px]"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="space-y-6 flex-1">
                        <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full border border-white/10">
                            <ShieldCheck size={16} className="text-primary-500" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Chronos Protocol v2.8</span>
                        </div>
                        <h3 className="text-3xl font-[900] text-white uppercase italic tracking-tighter leading-none">Security of Adherence</h3>
                        <p className="text-slate-400 text-sm font-bold leading-relaxed italic max-w-3xl">
                            Dosage alarms are synchronized with your local temporal node and backup global servers.
                            Institutional medicine adherence helps prevent bio-metric degredation and ensures protocol success.
                        </p>
                    </div>
                    <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-primary-500 border border-white/10 group-hover:rotate-12 transition-transform duration-700 shadow-2xl">
                        <AlertCircle size={48} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reminders;
