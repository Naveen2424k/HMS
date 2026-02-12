import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';
import MedicalHistoryModal from '../components/MedicalHistoryModal';
import SettingsModal from '../components/SettingsModal';
import BillingHistoryModal from '../components/BillingHistoryModal';
import AppointmentsHistoryModal from '../components/AppointmentsHistoryModal';
import api from '../services/api';

import {
    Calendar,
    FileText,
    Clipboard,
    Heart,
    Bell,
    CreditCard,
    User,
    Clock,
    Activity,
    Pill,
    Bed,
    Phone,
    CheckCircle,
    TrendingUp,
    ShieldCheck,
    AlertTriangle,
    Zap,
    Thermometer,
    Droplet,
    MapPin,
    Stethoscope,
    Trash2,
    XCircle,
    RotateCcw,
    Home
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass = "bg-blue-100 text-blue-600" }) => (
    <div className="simple-card flex items-center gap-6 group hover:scale-[1.02] transition-transform">
        <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center shadow-lg`}>
            <Icon size={32} />
        </div>
        <div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{title}</p>
            <h3 className="text-2xl font-black text-blue-900 leading-none">{value}</h3>
        </div>
    </div>
);

const PatientDashboard = () => {
    const { user } = useUser();
    const [patientInfo, setPatientInfo] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [tokenStatus, setTokenStatus] = useState(null);
    const [pendingBill, setPendingBill] = useState({ amount: 1500, id: 'BILL123', status: 'pending' });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isBillingHistoryOpen, setIsBillingHistoryOpen] = useState(false);
    const [isAppointmentsHistoryOpen, setIsAppointmentsHistoryOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const headers = { 'x-clerk-user-id': user.id };

            // Fetch Patient Bio
            const patientRes = await api.get('/patients/me', { headers });
            setPatientInfo(patientRes.data);

            // Fetch Appointments
            const aptRes = await api.get('/appointments', { headers });
            const appointmentList = aptRes.data.data || [];
            const upcoming = appointmentList.filter(a => ['Approved', 'Pending'].includes(a.status));
            setAppointments(upcoming);

            // Fetch Notifications
            try {
                const notifRes = await api.get('/notifications', { headers });
                setNotifications(notifRes.data);
            } catch (nErr) {
                console.warn("Notifications feature might not be ready", nErr);
            }

            // Mock Token for first upcoming approved appointment
            const approved = upcoming.find(a => a.status === 'Approved');
            if (approved) {
                setTokenStatus({
                    tokenNumber: 15,
                    currentServing: 12,
                    wait: 4,
                    unit: 'Clinical Registry'
                });
            } else {
                setTokenStatus(null);
            }

        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        const action = searchParams.get('action');
        if (action === 'book') setIsAppointmentModalOpen(true);
        else if (action === 'history') setIsHistoryModalOpen(true);
        else if (action === 'settings') setIsSettingsModalOpen(true);
        fetchData();
    }, [user, searchParams]);

    const handleCancelAppointment = async (id) => {
        if (!window.confirm("ARE YOU SURE YOU WANT TO CANCEL THIS VISIT?")) return;
        try {
            await api.put(`/appointments/${id}/status`, { status: 'Cancelled' }, {
                headers: { 'x-clerk-user-id': user.id }
            });
            alert("APPOINTMENT CANCELLED SUCCESSFULLY.");
            fetchData();
        } catch (err) {
            alert("FAILED TO CANCEL APPOINTMENT.");
        }
    };

    const handleClearNotifications = async () => {
        if (!window.confirm("CLEAR ALL NOTIFICATIONS?")) return;
        try {
            await api.delete('/notifications', {
                headers: { 'x-clerk-user-id': user.id }
            });
            setNotifications([]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCloseModal = (setter) => {
        setter(false);
        setSearchParams({});
        setTimeout(() => fetchData(), 500);
    };

    const handlePayBill = async () => {
        alert("Connecting to Payment Gateway...");
        setTimeout(() => {
            alert("Payment Successful!");
            setPendingBill({ ...pendingBill, status: 'paid' });
            setShowPaymentModal(false);
        }, 1500);
    };

    const upcomingAppointment = appointments.length > 0 ? appointments[0] : null;

    return (
        <div className="min-h-screen bg-blue-50 pb-20">

            {/* Nav Header Unit */}
            <div className="bg-white border-b-4 border-blue-600 px-8 py-6 mb-12 shadow-md h-auto flex flex-col justify-center">
                <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-100">
                            <User size={48} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-blue-900 leading-none uppercase italic tracking-tighter">Welcome, {user?.firstName}</h1>
                            <div className="flex flex-wrap items-center gap-6 mt-3 text-blue-400 font-black text-xs uppercase tracking-widest italic">
                                <p>System ID: #{user?.id?.slice(-6).toUpperCase()}</p>
                                <div className="h-4 w-px bg-blue-100"></div>
                                <div className="flex items-center gap-2 text-green-600">
                                    <ShieldCheck size={16} /> Verified Protocol
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-8 bg-blue-50 px-8 py-4 rounded-3xl border-2 border-blue-100 shadow-sm">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Age</p>
                                <p className="text-xl font-black text-blue-900 leading-none italic">{patientInfo?.age || '24'}y</p>
                            </div>
                            <div className="w-px h-8 bg-blue-200"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Gender</p>
                                <p className="text-xl font-black text-blue-900 leading-none italic">{patientInfo?.gender?.charAt(0) || 'M'}</p>
                            </div>
                            <div className="w-px h-8 bg-blue-200"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Group</p>
                                <p className="text-xl font-black text-blue-900 leading-none italic">{patientInfo?.bloodGroup || 'B+'}</p>
                            </div>
                        </div>
                        <div className="bg-green-50 text-green-700 px-6 py-4 rounded-full border-2 border-green-100 font-black uppercase text-xs tracking-widest animate-pulse">
                            Node Linked
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-8">

                {/* Performance Stats Row */}
                <div className="grid-stats">
                    <StatCard
                        title="Upcoming Visit"
                        value={upcomingAppointment ? new Date(upcomingAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Bookings'}
                        icon={Calendar}
                        colorClass="bg-blue-600 text-white"
                    />
                    <StatCard
                        title="Liability"
                        value={`₹${pendingBill.status === 'paid' ? '0' : pendingBill.amount}`}
                        icon={CreditCard}
                        colorClass="bg-red-50 text-red-600"
                    />
                    <StatCard
                        title="Active Meds"
                        value="02 Units"
                        icon={Pill}
                        colorClass="bg-purple-50 text-purple-600"
                    />
                    <StatCard
                        title="Registry Status"
                        value="VERIFIED"
                        icon={ShieldCheck}
                        colorClass="bg-green-50 text-green-600"
                    />
                </div>

                {/* Major Grid Layout Partition */}
                <div className="grid-main">

                    <div className="col-span-content space-y-12">

                        {/* THE APPOINTMENT STATUS TRACKER */}
                        <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border-4 border-blue-50 relative overflow-hidden group">
                            <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-10">
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Activity size={24} /></div>
                                            <h2 className="text-3xl font-[1000] text-blue-900 italic uppercase tracking-tighter">Your Current Status</h2>
                                        </div>
                                        {upcomingAppointment && (
                                            <button
                                                onClick={() => handleCancelAppointment(upcomingAppointment._id)}
                                                className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-black text-sm uppercase italic tracking-widest border-2 border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                                            >
                                                <XCircle size={18} /> Cancel Visit
                                            </button>
                                        )}
                                    </div>

                                    {upcomingAppointment ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                                            <div className="space-y-4">
                                                <p className="text-xs font-black text-blue-300 uppercase tracking-widest italic">Attending Specialist</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border-2 border-blue-100 font-black text-2xl italic">D</div>
                                                    <h3 className="text-xl font-black text-blue-900 italic uppercase truncate">Dr. {upcomingAppointment.doctor?.user?.name || 'Assigned'}</h3>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-xs font-black text-blue-300 uppercase tracking-widest italic">Schedule Hub</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border-2 border-blue-100"><Clock size={28} /></div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-blue-900 italic uppercase">{new Date(upcomingAppointment.date).toLocaleDateString()}</h3>
                                                        <p className="text-blue-500 font-bold">{new Date(upcomingAppointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-xs font-black text-blue-300 uppercase tracking-widest italic">Location Node</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border-2 border-blue-100"><MapPin size={28} /></div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-blue-900 italic uppercase">Section A</h3>
                                                        <p className="text-blue-500 font-bold">Room 102 • Ground Floor</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-10 text-center bg-blue-50 rounded-3xl border-2 border-dashed border-blue-100">
                                            <Calendar className="mx-auto text-blue-200 mb-4" size={48} />
                                            <h3 className="text-2xl font-black text-blue-300 uppercase italic">No Active Appointments Found</h3>
                                            <p className="text-blue-300 font-bold mt-2 font-mono">Book a slot using the Directives Hub below.</p>
                                        </div>
                                    )}
                                </div>

                                {upcomingAppointment?.status === 'Approved' && tokenStatus && (
                                    <div className="bg-blue-900 text-white p-8 rounded-[3rem] border-4 border-blue-800 shadow-2xl shadow-blue-100 min-w-[320px] relative overflow-hidden">
                                        <Zap className="absolute -right-10 -top-10 opacity-10" size={150} />
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex justify-between items-center bg-blue-600/30 p-4 rounded-2xl">
                                                <span className="text-xs font-black uppercase tracking-widest italic text-blue-100">Queue Index</span>
                                                <span className="text-xs font-black uppercase tracking-widest italic text-green-400">Linked</span>
                                            </div>
                                            <div className="flex items-end justify-center gap-4">
                                                <p className="text-6xl font-black italic tracking-tighter">{tokenStatus.tokenNumber}</p>
                                                <p className="text-xl font-black text-blue-400 mb-3 italic tracking-widest">/ POSITION</p>
                                            </div>
                                            <div className="pt-4 border-t border-white/10 text-center">
                                                <p className="text-sm font-black text-blue-300 uppercase tracking-widest italic">Est. Wait: {tokenStatus.wait} Minutes</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Directives Hub */}
                        <div className="simple-card">
                            <h3 className="text-2xl font-[1000] text-blue-900 mb-10 pb-6 border-b-4 border-blue-50 uppercase italic tracking-tighter">Directives Hub</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                <button onClick={() => setIsAppointmentModalOpen(true)} className="p-10 bg-blue-600 text-white rounded-[2.5rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex flex-col items-center gap-6 group relative">
                                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Calendar size={48} /></div>
                                    <span className="text-xl font-black uppercase italic tracking-widest">Schedule Visit</span>
                                </button>
                                <button onClick={() => setIsAppointmentsHistoryOpen(true)} className="p-10 bg-white border-4 border-blue-100 text-blue-900 rounded-[2.5rem] hover:border-blue-200 transition-all flex flex-col items-center gap-6 group">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><RotateCcw size={48} /></div>
                                    <span className="text-xl font-black uppercase italic tracking-widest">Booking Logs</span>
                                </button>
                                <button onClick={() => navigate('/room-booking')} className="p-10 bg-white border-4 border-blue-100 text-blue-900 rounded-[2.5rem] hover:border-blue-200 transition-all flex flex-col items-center gap-6 group">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Home size={48} /></div>
                                    <span className="text-xl font-black uppercase italic tracking-widest">Room Booking</span>
                                </button>
                            </div>
                        </div>

                        {/* Liability Settlement */}
                        <div className="simple-card">
                            <div className="bg-blue-900 text-white p-10 rounded-[3.5rem] border-4 border-blue-800 flex flex-col xl:flex-row justify-between items-center gap-12 relative overflow-hidden shadow-2xl">
                                <CreditCard size={150} className="absolute -left-10 -bottom-10 opacity-10" />
                                <div className="relative z-10 text-center xl:text-left">
                                    <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter mb-2">Liability Settlement</h3>
                                    <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">Registry ID: {pendingBill.id}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10">
                                    <p className="text-5xl font-[1000] italic tracking-tighter">₹{pendingBill.amount}</p>
                                    <button
                                        onClick={() => setShowPaymentModal(true)}
                                        disabled={pendingBill.status === 'paid'}
                                        className={`px-12 py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl italic tracking-tighter uppercase
                                            ${pendingBill.status === 'paid' ? 'bg-green-500 text-white' : 'bg-white text-blue-900 hover:bg-blue-50'}`}
                                    >
                                        {pendingBill.status === 'paid' ? 'Settled' : 'Pay Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Sidebar */}
                    <div className="col-span-side space-y-12">

                        <div className="simple-card">
                            <div className="flex items-center justify-between mb-10 border-b-2 border-blue-50 pb-6">
                                <h3 className="text-2xl font-black text-blue-900 italic uppercase flex items-center gap-4">
                                    <Bell size={32} className="text-blue-600" /> Notifications
                                </h3>
                                {notifications.length > 0 && (
                                    <button onClick={handleClearNotifications} className="text-red-500 hover:text-red-700 transition-colors" title="Clear All">
                                        <Trash2 size={24} />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-12 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {notifications.length > 0 ? notifications.map((notif, i) => (
                                    <div key={i} className="flex gap-6 group hover:translate-x-2 transition-transform cursor-pointer">
                                        <div className={`mt-2 w-4 h-4 rounded-full shrink-0 shadow-lg ${notif.isRead ? 'bg-gray-300' : 'bg-blue-600 anim-pulse'}`}></div>
                                        <div>
                                            <p className="text-lg font-black text-blue-900 uppercase italic leading-none truncate w-48">{notif.title}</p>
                                            <p className="text-xs font-bold text-gray-400 mt-2 mb-2 italic uppercase">{new Date(notif.createdAt).toLocaleTimeString()}</p>
                                            <p className="text-base text-gray-600 font-bold leading-relaxed">{notif.message}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <Bell className="mx-auto text-blue-100 mb-4" size={48} />
                                        <p className="text-blue-300 font-black uppercase italic">No new updates</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-900 text-white rounded-[3.5rem] p-10 shadow-2xl border-4 border-blue-800">
                            <div className="flex items-center gap-4 mb-10">
                                <ShieldCheck className="text-blue-400" size={40} />
                                <h3 className="text-2xl font-black italic uppercase italic tracking-tighter">Registry Status</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center py-4 border-b border-white/10 italic font-black">
                                    <span className="text-blue-400 text-xs uppercase tracking-widest">Account Tier</span>
                                    <span className="uppercase">Voucher Patient</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-white/10 italic font-black">
                                    <span className="text-blue-400 text-xs uppercase tracking-widest">Security Link</span>
                                    <span className="text-green-400 uppercase">Synchronized</span>
                                </div>
                            </div>
                            <button onClick={() => setIsSettingsModalOpen(true)} className="w-full mt-10 py-6 bg-white/10 hover:bg-white hover:text-blue-900 rounded-[2rem] border-2 border-white/20 transition-all font-black uppercase italic tracking-widest">
                                Manage Profile
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modals */}
            <ScheduleAppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={() => handleCloseModal(setIsAppointmentModalOpen)}
                onSuccess={() => fetchData()}
            />
            <MedicalHistoryModal isOpen={isHistoryModalOpen} onClose={() => handleCloseModal(setIsHistoryModalOpen)} />
            <SettingsModal isOpen={isSettingsModalOpen} onClose={() => handleCloseModal(setIsSettingsModalOpen)} />
            <BillingHistoryModal isOpen={isBillingHistoryOpen} onClose={() => setIsBillingHistoryOpen(false)} />
            <AppointmentsHistoryModal isOpen={isAppointmentsHistoryOpen} onClose={() => setIsAppointmentsHistoryOpen(false)} />

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-blue-900/40 backdrop-blur-md">
                    <div className="bg-white rounded-[4rem] w-full max-w-xl shadow-2xl p-16 animate-in zoom-in-95 duration-300 border-[12px] border-blue-50">
                        <div className="text-center mb-12">
                            <div className="w-28 h-28 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl mx-auto mb-10 italic">₹</div>
                            <h2 className="text-5xl font-black text-blue-900 mb-4 italic uppercase tracking-tighter">Settlement</h2>
                            <p className="text-2xl text-gray-500 font-bold uppercase tracking-widest">Total Liability: ₹{pendingBill.amount}</p>
                        </div>
                        <div className="space-y-8">
                            <button onClick={handlePayBill} className="w-full bg-blue-600 text-white py-8 rounded-[2.5rem] font-black text-3xl hover:bg-blue-700 transition-all shadow-2xl italic uppercase tracking-tighter">
                                Authorize Pay
                            </button>
                            <button onClick={() => setShowPaymentModal(false)} className="w-full py-4 text-gray-400 font-black text-xl hover:text-gray-900 transition-colors uppercase italic tracking-widest">Abort Link</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
