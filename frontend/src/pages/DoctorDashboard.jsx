import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Activity,
    Zap,
    Clipboard,
    Stethoscope,
    Users,
    TrendingUp,
    Phone,
    RefreshCw,
    Check,
    Bell,
    ChevronRight,
    Search
} from 'lucide-react';
import AddMedicalRecordModal from '../components/AddMedicalRecordModal';

const DoctorDashboard = () => {
    const { user } = useUser();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pending: 0,
        accepted: 0,
        completedToday: 0,
        totalResolved: 0
    });

    const [queueState, setQueueState] = useState({
        currentPatient: '---',
        tokenNumber: '-',
        status: 'Idle',
        nextPatient: '---',
        waitingCount: 0
    });

    const [isSyncing, setIsSyncing] = useState(false);

    const syncAccount = async () => {
        if (!user) return;
        try {
            setIsSyncing(true);
            await axios.post('http://localhost:5000/api/set-role', {
                userId: user.id,
                role: 'Doctor'
            });
            await fetchData();
            alert('Dashboard synced successfully!');
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    const fetchData = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/doctor/appointments', {
                headers: { 'x-clerk-user-id': user.id }
            });
            const data = response.data;
            setAppointments(data);

            const pending = data.filter(a => a.status === 'Pending').length;
            const accepted = data.filter(a => a.status === 'Approved').length;
            const completedToday = data.filter(a => a.status === 'Completed' && new Date(a.date).toDateString() === new Date().toDateString()).length;
            const completedTotal = data.filter(a => a.status === 'Completed').length;

            setStats({ pending, accepted, completedToday, totalResolved: completedTotal });

            const activeQueue = data.filter(a => ['Approved', 'Pending'].includes(a.status));
            if (activeQueue.length > 0) {
                const current = activeQueue[0];
                const next = activeQueue[1];
                setQueueState({
                    currentPatient: current.patient?.user?.name || 'Anonymous',
                    tokenNumber: current._id.toString().slice(-3).toUpperCase(),
                    status: current.status === 'Approved' ? 'Ready' : 'Pending',
                    nextPatient: next?.patient?.user?.name || 'None Scheduled',
                    waitingCount: activeQueue.length
                });
            } else {
                setQueueState({ currentPatient: '---', tokenNumber: '-', status: 'Idle', nextPatient: '---', waitingCount: 0 });
            }
        } catch (error) {
            console.error('Error fetching doctor data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleAction = async (id, action) => {
        try {
            await axios.put(`http://localhost:5000/api/doctor/appointments/${id}/${action}`);
            fetchData();
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 pb-20">

            {/* Header Unit */}
            <div className="bg-white border-b-4 border-blue-600 flex items-center justify-between px-8 py-6 h-24 sticky top-0 z-50 shadow-md">
                <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-100">🏥</div>
                        <div>
                            <h1 className="text-2xl font-black text-blue-900 leading-none">Console.Practitioner</h1>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mt-2 italic">Sector Active Status: Verified</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="hidden md:flex items-center bg-blue-50 border-2 border-blue-100 rounded-2xl px-5 py-3 h-14">
                            <Search size={22} className="text-blue-400 mr-3" />
                            <input type="text" placeholder="Omni-Search..." className="bg-transparent border-none outline-none text-lg font-bold w-64 text-blue-900 placeholder:text-blue-200" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-blue-400 hover:text-blue-600 p-2"><Bell size={32} /></button>
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                                {user?.firstName?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-8 pt-12">

                {/* Protocol Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
                    <div>
                        <h2 className="text-6xl font-black text-blue-900 leading-none mb-3 tracking-tighter italic">{greeting}, Dr. {user?.lastName || user?.firstName}</h2>
                        <p className="text-2xl text-gray-500 font-bold tracking-wide italic uppercase">Queue Status: {stats.pending + stats.accepted} Patients Linked</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={syncAccount}
                            disabled={isSyncing}
                            className="flex items-center gap-3 px-8 py-4 bg-white border-4 border-blue-50 rounded-2xl font-black text-blue-700 hover:border-blue-200 transition-all text-lg shadow-sm"
                        >
                            <RefreshCw size={24} className={isSyncing ? 'animate-spin' : ''} />
                            Sync Registry
                        </button>
                        <button
                            onClick={() => setIsRecordModalOpen(true)}
                            className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                        >
                            <Zap size={24} />
                            Flash Diagnosis
                        </button>
                    </div>
                </div>

                {/* Performance Stats Grid */}
                <div className="grid-stats">
                    <div className="simple-card">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={36} /></div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Subject Queue</p>
                                <h3 className="text-4xl font-black text-blue-900 leading-none">{stats.accepted}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="simple-card">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center"><Clock size={36} /></div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Auth Pending</p>
                                <h3 className="text-4xl font-black text-blue-900 leading-none">{stats.pending}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="simple-card">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle size={36} /></div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Resolved Today</p>
                                <h3 className="text-4xl font-black text-blue-900 leading-none">{stats.completedToday}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="simple-card">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100"><TrendingUp size={36} /></div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Mission Total</p>
                                <h3 className="text-4xl font-black text-blue-900 leading-none">{stats.totalResolved}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Operations Grid Partition */}
                <div className="grid-main">

                    {/* Live Pulse Sidebar */}
                    <div className="col-span-side">
                        <div className="bg-blue-900 text-white p-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(30,58,138,0.3)] relative overflow-hidden h-full flex flex-col gap-10">
                            <Activity size={250} className="absolute -right-20 -bottom-20 opacity-5" />
                            <h3 className="text-3xl font-black italic mb-4 flex items-center gap-4">
                                <Stethoscope size={40} className="text-blue-400" /> LIVE PULSE
                            </h3>

                            <div className="space-y-10 relative z-10 flex-1">
                                <div className="p-8 bg-white/10 rounded-3xl border border-white/10">
                                    <p className="text-xs font-black text-blue-300 mb-4 uppercase tracking-[0.2em] italic">Current Active Subject</p>
                                    <h4 className="text-4xl font-black mb-6 tracking-tighter uppercase italic truncate">{queueState.currentPatient}</h4>
                                    <div className="flex justify-between items-center bg-blue-600/30 p-4 rounded-2xl">
                                        <span className="font-black italic">TOKEN: {queueState.tokenNumber}</span>
                                        <span className="font-black text-green-400 uppercase tracking-widest">{queueState.status}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <p className="text-xs text-blue-300 mb-2 font-black uppercase tracking-widest italic text-center">In Queue</p>
                                        <p className="text-4xl font-black text-center italic">{queueState.waitingCount}</p>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <p className="text-xs text-blue-300 mb-2 font-black uppercase tracking-widest italic text-center">Next Up</p>
                                        <p className="text-base font-black text-center italic truncate">{queueState.nextPatient}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={fetchData}
                                    className="w-full py-6 mt-10 bg-white text-blue-900 rounded-[1.5rem] font-black text-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 italic"
                                >
                                    FORCE HUB SYNC
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Registry Content Column */}
                    <div className="col-span-content">
                        <div className="simple-card !p-0 overflow-hidden min-h-[600px] flex flex-col">
                            <div className="p-10 border-b-4 border-blue-600 bg-white flex justify-between items-center">
                                <h3 className="text-3xl font-black text-blue-900 italic uppercase flex items-center gap-4">
                                    <Clipboard size={36} className="text-blue-600" /> Clinical Registry
                                </h3>
                                <div className="px-6 py-3 bg-green-50 text-green-700 rounded-full text-sm font-black uppercase tracking-widest italic border-2 border-green-100 animate-pulse">
                                    Live Protocol Link Active
                                </div>
                            </div>

                            <div className="flex-1">
                                {loading && appointments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-32">
                                        <div className="w-16 h-16 border-8 border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
                                        <p className="text-lg font-black text-gray-400 uppercase tracking-[0.4em] italic">Accessing Neural Registry...</p>
                                    </div>
                                ) : (
                                    <div className="divide-y-4 divide-blue-50">
                                        {appointments.map((apt) => (
                                            <div key={apt._id} className="p-10 hover:bg-blue-50/50 transition-all group">
                                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                                                    <div className="flex items-center gap-10 text-left">
                                                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-4xl font-black text-blue-900 border-4 border-blue-100 group-hover:border-blue-600 group-hover:scale-110 transition-all shadow-sm">
                                                            {apt.patient?.user?.name?.charAt(0) || 'P'}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-3xl font-black text-blue-900 mb-3 italic uppercase group-hover:text-blue-600 transition-colors">{apt.patient?.user?.name}</h4>
                                                            <div className="flex flex-wrap gap-8 text-lg font-black text-gray-400 uppercase italic">
                                                                <span className="flex items-center gap-2"><Clock size={20} className="text-blue-500" /> {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                <span className="flex items-center gap-2"><Calendar size={20} className="text-blue-500" /> {new Date(apt.date).toLocaleDateString()}</span>
                                                                <span className="text-blue-300">ID: {apt._id.slice(-6).toUpperCase()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <span className={`px-8 py-4 rounded-2xl text-base font-black uppercase italic tracking-widest transition-all ${apt.status === 'Approved' ? 'bg-green-100 text-green-700 border-4 border-green-200 shadow-lg shadow-green-100' :
                                                                apt.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-4 border-blue-50 animate-pulse' :
                                                                    apt.status === 'Completed' ? 'bg-blue-900 text-white' :
                                                                        'bg-gray-100 text-gray-500'
                                                            }`}>
                                                            {apt.status}
                                                        </span>

                                                        <div className="flex gap-4">
                                                            {apt.status === 'Pending' && (
                                                                <button onClick={() => handleAction(apt._id, 'accept')} className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center hover:bg-green-700 transition shadow-xl active:scale-95"><Check size={32} /></button>
                                                            )}
                                                            {apt.status === 'Approved' && (
                                                                <button onClick={() => handleAction(apt._id, 'complete')} className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition shadow-xl active:scale-95"><Zap size={32} /></button>
                                                            )}
                                                            {(apt.status === 'Pending' || apt.status === 'Approved') && (
                                                                <button onClick={() => handleAction(apt._id, 'reject')} className="w-14 h-14 bg-white border-4 border-blue-50 text-blue-200 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"><XCircle size={32} /></button>
                                                            )}
                                                            <button className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-100 transition shadow-sm"><ChevronRight size={32} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <AddMedicalRecordModal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} />
        </div>
    );
};

export default DoctorDashboard;
