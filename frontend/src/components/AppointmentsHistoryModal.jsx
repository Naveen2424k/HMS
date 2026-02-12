import { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle, Clock, Trash2, ShieldCheck, Activity } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import api from '../services/api';

const AppointmentsHistoryModal = ({ isOpen, onClose }) => {
    const { user } = useUser();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            fetchAppointments();
        }
    }, [isOpen, user]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/appointments', {
                headers: { 'x-clerk-user-id': user.id }
            });
            setAppointments(data.data || []);
        } catch (err) {
            console.error('Failed to fetch appointments', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("ARE YOU SURE YOU WANT TO CANCEL THIS BOOKING?")) return;
        try {
            await api.put(`/appointments/${id}/status`, { status: 'Cancelled' }, {
                headers: { 'x-clerk-user-id': user.id }
            });
            alert("BOOKING CANCELLED.");
            fetchAppointments();
        } catch (err) {
            alert("CANCELLATION FAILED.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-blue-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 border-4 border-blue-50">
                {/* Header */}
                <div className="bg-blue-600 px-10 py-8 flex justify-between items-center shrink-0">
                    <div className="text-white">
                        <div className="flex items-center gap-4">
                            <Calendar size={32} />
                            <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter">Booking Logs</h2>
                        </div>
                        <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mt-2">Comprehensive Consultation Registry</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-10 overflow-y-auto flex-1 space-y-8 no-scrollbar bg-blue-50/20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Activity className="animate-spin text-blue-600 mb-4" size={48} />
                            <p className="text-blue-300 font-black uppercase italic">Accessing Logs...</p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-20">
                            <Calendar className="mx-auto text-blue-100 mb-6" size={80} />
                            <p className="text-xl font-black text-blue-300 uppercase italic">No Appointment Records Found</p>
                        </div>
                    ) : (
                        appointments.map((apt) => (
                            <div key={apt._id} className="bg-white border-2 border-blue-50 rounded-[2rem] p-8 hover:border-blue-200 transition-all group relative overflow-hidden">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 relative z-10">
                                    <div className="flex gap-6">
                                        <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-white
                                            ${apt.status === 'Approved' ? 'bg-blue-600' :
                                                apt.status === 'Completed' ? 'bg-green-600' :
                                                    apt.status === 'Cancelled' ? 'bg-red-500' : 'bg-amber-500'}`}>
                                            <span className="text-3xl font-black italic">{new Date(apt.date).getDate()}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                {new Date(apt.date).toLocaleString('default', { month: 'short' })}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-blue-900 italic uppercase">Dr. {apt.doctor?.user?.name || 'Assigned Specialist'}</h3>
                                            <p className="text-blue-400 font-bold uppercase text-xs tracking-widest mt-1 italic">{apt.doctor?.specialization || 'Clinical Hub'}</p>
                                            <div className="flex items-center gap-3 mt-4 text-sm font-black text-gray-400 uppercase italic">
                                                <Clock size={16} className="text-blue-500" />
                                                {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic border-2
                                            ${apt.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                apt.status === 'Completed' ? 'bg-blue-900 text-white border-blue-800' :
                                                    apt.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            {apt.status}
                                        </span>
                                        {['Pending', 'Approved'].includes(apt.status) && (
                                            <button
                                                onClick={() => handleCancel(apt._id)}
                                                className="text-red-400 hover:text-red-700 font-black text-[10px] uppercase italic flex items-center gap-2 transition-colors mt-2"
                                            >
                                                <Trash2 size={16} /> Terminate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="px-10 py-6 bg-blue-50 border-t-2 border-blue-100 flex items-center justify-center gap-4 shrink-0">
                    <ShieldCheck size={20} className="text-blue-600" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Registry Data Synchronized</span>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsHistoryModal;
