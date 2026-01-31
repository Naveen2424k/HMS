import { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, Clock, ChevronDown, Sparkles, ShieldCheck, Globe, Zap, ArrowRight } from 'lucide-react';
import api from '../services/api';

const ScheduleAppointmentModal = ({ isOpen, onClose, onSuccess, initialDoctorId }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        reason: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
            if (initialDoctorId) {
                setFormData(prev => ({ ...prev, doctorId: initialDoctorId }));
            }
        }
    }, [isOpen, initialDoctorId]);

    const fetchDoctors = async () => {
        try {
            const { data } = await api.get('/doctors');
            setDoctors(data);
        } catch (err) {
            console.error('Failed to fetch doctors', err);
            // Fallback for demo if backend has no doctors yet
            if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
                setDoctors([]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/appointments', formData);
            if (onSuccess) onSuccess();
            onClose();
            // Reset form
            setFormData({ doctorId: '', date: '', reason: '' });
            alert('Appointment scheduled successfully!');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to schedule appointment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-2xl animate-in fade-in duration-700">
            {/* Background Abstract Art Inside Modal */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute top-1/4 right-1/4 w-[40%] h-[40%] bg-primary-600/30 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[40%] h-[40%] bg-indigo-600/30 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
            </div>

            <div className="bg-white/80 backdrop-blur-3xl rounded-[4.5rem] w-full max-w-2xl shadow-[0_80px_150px_-30px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-1000 relative border border-white/50 group">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-950 to-slate-900 px-14 py-12 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary-600/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-primary-600/30 transition-all duration-1000"></div>
                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/10 text-primary-400">
                                <Calendar size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-[1000] text-white tracking-tighter uppercase italic leading-none">
                                    New Session
                                </h2>
                                <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.6em] mt-3">Advanced Scheduler Node</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-16 h-16 rounded-[1.8rem] bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 transition-all duration-500 group/close relative z-10"
                    >
                        <X size={28} className="group-hover/close:rotate-90 transition-transform" />
                    </button>
                    {/* Visual Flourish */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
                        <Globe size={300} strokeWidth={1} className="animate-spin-slow" />
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-14 space-y-10 relative z-10 no-scrollbar overflow-y-auto max-h-[70vh]">
                    {error && (
                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-[2rem] text-sm font-black uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <label className="text-[10px] font-[1000] text-slate-400 uppercase tracking-[0.5em] ml-2 flex items-center gap-2">
                            <div className="w-1 h-4 bg-primary-600 rounded-full"></div>
                            Target Specialist
                        </label>
                        <div className="relative group/field">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-primary-600 transition-colors" size={24} />
                            <select
                                required
                                value={formData.doctorId}
                                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                className="w-full pl-16 pr-14 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-[1000] text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-100 transition-all appearance-none text-xl italic tracking-tighter cursor-pointer"
                            >
                                <option value="">SELECT SPECIALIST NODE...</option>
                                {doctors.map((doc) => (
                                    <option key={doc._id} value={doc._id}>
                                        DR. {doc.user?.name?.toUpperCase() || 'UNKNOWN'} • {doc.specialization.toUpperCase()} • ${doc.fees}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                <ArrowRight size={24} className="rotate-90" />
                            </div>
                        </div>
                        {doctors.length === 0 && (
                            <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                System Alert: No active specialists detected
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-[1000] text-slate-400 uppercase tracking-[0.5em] ml-2 flex items-center gap-2">
                            <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
                            Chronos Timestamp
                        </label>
                        <div className="relative group/field">
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-primary-600 transition-colors" size={24} />
                            <input
                                required
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-[1000] text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-100 transition-all text-xl italic tracking-tighter"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-[1000] text-slate-400 uppercase tracking-[0.5em] ml-2 flex items-center gap-2">
                            <div className="w-1 h-4 bg-amber-600 rounded-full"></div>
                            Subjective Rationale
                        </label>
                        <div className="relative group/field">
                            <FileText className="absolute left-6 top-7 text-slate-300 group-focus-within/field:text-primary-600 transition-colors" size={24} />
                            <textarea
                                required
                                rows="3"
                                placeholder="Describe symptoms or clinical requirements..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-[1000] text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-100 transition-all resize-none text-xl italic tracking-tighter"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-950 text-white font-[1000] uppercase tracking-[0.5em] py-8 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.4)] hover:bg-primary-600 transition-all duration-700 flex items-center justify-center gap-6 mt-12 group/btn relative overflow-hidden active:scale-95"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                        {loading ? (
                            <span className="animate-pulse flex items-center gap-4">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Transmitting...
                            </span>
                        ) : (
                            <>
                                <span>Finalize Boarding</span>
                                <Clock size={24} className="group-hover/btn:scale-125 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Secure Footer Bar */}
                <div className="px-14 py-8 bg-slate-50/50 backdrop-blur-md border-t border-slate-100 flex items-center justify-center gap-6">
                    <ShieldCheck size={18} className="text-primary-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Session Link Encrypted • Verified Security Node</span>
                </div>
            </div>
        </div>
    );
};

export default ScheduleAppointmentModal;
