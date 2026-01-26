import { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, Clock, ChevronDown } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">New Appointment</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Book a consultation</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 text-rose-500 rounded-xl text-sm font-bold border border-rose-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select Specialist</label>
                        <div className="relative">
                            <select
                                required
                                value={formData.doctorId}
                                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-primary-100 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Choose a doctor...</option>
                                {doctors.map((doc) => (
                                    <option key={doc._id} value={doc._id}>
                                        Dr. {doc.user?.name || 'Unknown'} - {doc.specialization} (${doc.fees})
                                    </option>
                                ))}
                            </select>
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                        {doctors.length === 0 && (
                            <p className="text-[10px] text-amber-500 font-bold ml-1">No doctors found. Please contact admin.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Date & Time</label>
                        <div className="relative">
                            <input
                                required
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-primary-100 transition-all"
                            />
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Reason for Visit</label>
                        <div className="relative">
                            <textarea
                                required
                                rows="3"
                                placeholder="Briefly describe your symptoms..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                            ></textarea>
                            <FileText className="absolute left-4 top-6 text-slate-400" size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-primary-200 hover:bg-primary-700 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? 'Confirming...' : 'Confirm Appointment'}
                        {!loading && <Clock size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleAppointmentModal;
