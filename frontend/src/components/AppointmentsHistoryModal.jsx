import { useRef } from 'react';
import { X, Calendar, CheckCircle, Clock } from 'lucide-react';

const AppointmentsHistoryModal = ({ isOpen, onClose }) => {
    // Mock Appointments Data
    const appointments = [
        {
            id: 1,
            doctor: 'Dr. Sarah Wilson',
            specialization: 'Cardiologist',
            date: '2024-01-24',
            time: '09:30 AM',
            status: 'Confirmed'
        },
        {
            id: 2,
            doctor: 'Dr. James Carter',
            specialization: 'General Medicine',
            date: '2023-12-15',
            time: '11:00 AM',
            status: 'Completed'
        },
        {
            id: 3,
            doctor: 'Dr. Emily Chen',
            specialization: 'Dermatologist',
            date: '2023-11-20',
            time: '02:15 PM',
            status: 'Cancelled'
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-blue-600 px-8 py-6 flex justify-between items-center shrink-0">
                    <div className="text-white">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar /> Appointment History
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">Your past and upcoming consultations</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto flex-1 space-y-6">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold
                                        ${apt.status === 'Confirmed' ? 'bg-blue-600' : apt.status === 'Completed' ? 'bg-green-600' : 'bg-gray-400'}`}>
                                        <span className="text-2xl">{apt.date.split('-')[2]}</span>
                                        <span className="text-xs uppercase">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{apt.doctor}</h3>
                                        <p className="text-gray-500 font-medium">{apt.specialization}</p>
                                        <div className="flex items-center gap-2 mt-2 text-sm font-bold text-gray-400">
                                            <Clock size={16} />
                                            {apt.time}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider
                                    ${apt.status === 'Confirmed' ? 'bg-blue-50 text-blue-600' :
                                        apt.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {apt.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsHistoryModal;
