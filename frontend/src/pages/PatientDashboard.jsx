import {
    Calendar,
    FileText,
    Clipboard,
    Heart,
    Bell,
    ChevronRight,
    CreditCard,
    User,
    Clock,
    Activity,
    History,
    Download
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';
import MedicalHistoryModal from '../components/MedicalHistoryModal';
import SettingsModal from '../components/SettingsModal';

const PatientDashboard = () => {
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const [alerts, setAlerts] = useState([
        { title: 'Medicine Reminder', time: '10 min ago', desc: 'Evening dosage: Atorvastatin.', icon: Bell, color: 'bg-amber-50 text-amber-500' },
        { title: 'Invoice Processed', time: '2 hours ago', desc: 'Ref #ORD-9428 has been paid.', icon: CreditCard, color: 'bg-emerald-50 text-emerald-500' },
        { title: 'Diagnostic Report', time: 'Yesterday', desc: 'Blood analysis is now available.', icon: FileText, color: 'bg-primary-50 text-primary-500' },
    ]);

    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'book') {
            setIsAppointmentModalOpen(true);
        } else if (action === 'history') {
            setIsHistoryModalOpen(true);
        } else if (action === 'settings') {
            setIsSettingsModalOpen(true);
        }
    }, [searchParams]);

    // Handle closing modals and clearing search params
    const handleCloseModal = (setter) => {
        setter(false);
        setSearchParams({});
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-[800] text-slate-900 tracking-tight">Your Health Overview</h1>
                    <p className="text-slate-500 font-medium mt-2">Welcome back! Here's a summary of your medical status.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="luxury-card px-6 py-3 flex items-center gap-4 bg-white">
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-sm shadow-rose-100 animate-pulse-subtle">
                            <Heart size={24} className="fill-rose-500" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-tight">Average Heart Rate</p>
                            <p className="font-extrabold text-slate-800 leading-none mt-1 text-xl">72 <span className="text-xs text-slate-400 font-bold uppercase ml-1">BPM</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    {/* Hero Banner */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-primary-200 group">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="max-w-xl">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                                    <Activity size={14} />
                                    <span>Premium Healthcare Access</span>
                                </div>
                                <h2 className="text-4xl font-black mb-6 leading-tight">Elite Specialist Consultations</h2>
                                <p className="text-primary-50 opacity-90 mb-10 text-lg font-medium leading-relaxed">Book a session with our board-certified experts and experience healthcare at its finest.</p>
                                <button
                                    onClick={() => setIsAppointmentModalOpen(true)}
                                    className="bg-white text-primary-600 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-50 transition-all active:scale-95 shadow-xl group-hover:shadow-white/10"
                                >
                                    Schedule Appointment
                                </button>
                            </div>
                            <div className="mt-12 md:mt-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 group-hover:scale-110">
                                <Calendar size={220} strokeWidth={1} />
                            </div>
                        </div>
                        {/* Abstract Shapes */}
                        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-white opacity-[0.03] rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary-400 opacity-[0.05] rounded-full blur-[80px]"></div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="luxury-card p-10 bg-white group">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-slate-900 text-xl tracking-tight">Next Appointment</h3>
                                <button
                                    onClick={() => setIsAppointmentModalOpen(true)}
                                    className="text-primary-600 text-sm font-black uppercase tracking-widest hover:underline"
                                >
                                    Full Schedule
                                </button>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-8 group-hover:border-primary-100 transition-colors">
                                <div className="text-center bg-white w-20 h-20 rounded-2xl shadow-luxury flex flex-col justify-center border border-slate-50 group-hover:scale-110 transition-transform">
                                    <span className="block text-primary-600 font-black text-2xl leading-none">24</span>
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 block">Jan</span>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-900 text-lg">Dr. Sarah Wilson</h4>
                                    <p className="text-slate-500 font-bold mt-1">Chief of Cardiology</p>
                                    <div className="flex items-center gap-3 mt-4 text-xs font-black text-primary-600 uppercase tracking-widest">
                                        <Clock size={14} />
                                        <span>09:30 AM (GMT +2)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="luxury-card p-10 bg-white">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-slate-900 text-xl tracking-tight">Recent Prescription</h3>
                                <button
                                    onClick={() => setIsHistoryModalOpen(true)}
                                    className="text-primary-600 text-sm font-black uppercase tracking-widest hover:underline font-jakarta"
                                >
                                    View Lab Results
                                </button>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center shadow-sm shadow-primary-100">
                                    <Clipboard size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-extrabold text-slate-900 text-lg">Atorvastatin 20mg</h4>
                                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Download size={18} /></button>
                                    </div>
                                    <p className="text-slate-500 font-bold mt-1">Regimen: 1 tablet daily, before bed</p>
                                    <div className="mt-4 flex gap-2">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg">Active</span>
                                        <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg">Refill #2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info Section */}
                <div className="space-y-8">
                    <div className="luxury-card p-10 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 text-xl tracking-tight">System Alerts</h3>
                            <div className="w-8 h-8 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center font-bold text-xs">3</div>
                        </div>
                        <div className="space-y-8">
                            {alerts.length > 0 ? (
                                alerts.map((notif, i) => (
                                    <div key={i} className="flex gap-5 group cursor-pointer border-b border-transparent hover:border-slate-50 pb-2 transition-all">
                                        <div className={`w-12 h-12 ${notif.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                            <notif.icon size={22} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-extrabold text-slate-800 text-[14px] leading-tight leading-none group-hover:text-primary-600 transition-colors">{notif.title}</h4>
                                                <span className="text-[10px] font-black text-slate-300 uppercase whitespace-nowrap">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-semibold line-clamp-1">{notif.desc}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 opacity-50">
                                    <Bell size={32} className="mx-auto mb-2 text-slate-300" />
                                    <p className="text-xs font-bold text-slate-400">No new alerts</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setAlerts([])}
                            disabled={alerts.length === 0}
                            className="w-full mt-8 py-4 border-2 border-slate-50 rounded-2xl text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Mark all as read
                        </button>
                    </div>

                    {/* Support Section */}
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200 group">
                        <h3 className="font-black text-xl tracking-tight mb-8">Support Services</h3>
                        <div className="space-y-4">
                            <button className="w-full bg-white/5 hover:bg-white/10 p-5 rounded-2xl flex items-center justify-between transition-all group/btn">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary-400">
                                        <Activity size={20} />
                                    </div>
                                    <span className="text-sm font-extrabold group-hover/btn:translate-x-1 transition-transform">Concierge Chat</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-600 group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-1" />
                            </button>
                            <button className="w-full bg-white/5 hover:bg-white/10 p-5 rounded-2xl flex items-center justify-between transition-all group/btn">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400">
                                        <Clock size={20} />
                                    </div>
                                    <span className="text-sm font-extrabold group-hover/btn:translate-x-1 transition-transform">Emergency Line</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-600 group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                        <div className="mt-10 p-6 bg-white/5 rounded-[2rem] border border-white/5 text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Member Since</p>
                            <p className="font-black text-primary-400">AUGUST 2024</p>
                        </div>
                    </div>
                </div>
            </div>

            <ScheduleAppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={() => handleCloseModal(setIsAppointmentModalOpen)}
                initialDoctorId={searchParams.get('doctorId')}
            />

            <MedicalHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => handleCloseModal(setIsHistoryModalOpen)}
            />

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => handleCloseModal(setIsSettingsModalOpen)}
            />
        </div>
    );
};

export default PatientDashboard;
