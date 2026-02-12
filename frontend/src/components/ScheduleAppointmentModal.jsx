import { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import api from '../services/api';

const ScheduleAppointmentModal = ({ isOpen, onClose, onSuccess, initialDoctorId }) => {
    const { user } = useUser();
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
            if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
                setDoctors([]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!user) {
            setError('User session not found. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            await api.post('/appointments', formData, {
                headers: { 'x-clerk-user-id': user.id }
            });

            if (onSuccess) onSuccess();
            // Call onClose which triggers fetchData in the dashboard
            onClose();
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-blue-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-blue-50 relative">

                {/* Simple Header */}
                <div className="bg-blue-600 px-10 py-8 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic uppercase leading-none">Book Appointment</h2>
                            <p className="text-blue-100 text-xs font-bold mt-2 uppercase tracking-widest">Medical Scheduler</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Simple Inputs */}
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    {error && (
                        <div className="p-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-sm font-black text-blue-900 uppercase tracking-widest ml-1">Select Doctor</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                            <select
                                required
                                value={formData.doctorId}
                                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                className="w-full pl-14 pr-10 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 focus:bg-white transition-all appearance-none text-lg"
                            >
                                <option value="">CHOOSE A SPECIALIST...</option>
                                {doctors.map((doc) => (
                                    <option key={doc._id} value={doc._id}>
                                        DR. {doc.user?.name?.toUpperCase()} • {doc.specialization?.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-blue-900 uppercase tracking-widest ml-1">Date & Time</label>
                        <div className="relative">
                            <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                            <input
                                required
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 focus:bg-white transition-all text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-blue-900 uppercase tracking-widest ml-1">Reason for Visit</label>
                        <div className="relative">
                            <FileText className="absolute left-5 top-5 text-blue-400" size={20} />
                            <textarea
                                required
                                rows="3"
                                placeholder="Tell us what's wrong..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 focus:bg-white transition-all resize-none text-lg"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-black italic uppercase tracking-widest py-6 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-4 text-xl active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Confirm Appointment'}
                        <ArrowRight size={24} />
                    </button>
                </form>

                {/* Footer */}
                <div className="px-10 py-6 bg-blue-50 border-t-2 border-blue-100 flex items-center justify-center gap-4">
                    <ShieldCheck size={20} className="text-green-600" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Secure Booking System Active</span>
                </div>
            </div>
        </div>
    );
};

export default ScheduleAppointmentModal;
