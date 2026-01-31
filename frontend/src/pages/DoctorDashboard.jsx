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
    Award,
    Stethoscope,
    Users,
    TrendingUp,
    Phone,
    User,
    RefreshCw,
    Check
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
            alert('Sync failed. Please try again.');
        } finally {
            setIsSyncing(false);
        }
    };

    // Fetch real data from backend
    const fetchData = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/doctor/appointments', {
                headers: { 'x-clerk-user-id': user.id }
            });
            const data = response.data;
            setAppointments(data);

            // Calculate Stats
            const pending = data.filter(a => a.status === 'Pending').length;
            const accepted = data.filter(a => a.status === 'Approved').length;
            const completedToday = data.filter(a => a.status === 'Completed' && new Date(a.date).toDateString() === new Date().toDateString()).length;
            const completedTotal = data.filter(a => a.status === 'Completed').length;

            setStats({
                pending,
                accepted,
                completedToday,
                totalResolved: completedTotal
            });

            // Update Queue
            const activeQueue = data.filter(a => ['Approved', 'Pending'].includes(a.status));
            if (activeQueue.length > 0) {
                const current = activeQueue[0];
                const next = activeQueue[1];
                setQueueState({
                    currentPatient: current.patient?.user?.name || 'Anonymous',
                    tokenNumber: current._id.toString().slice(-3).toUpperCase(),
                    status: current.status === 'Approved' ? 'Ready' : 'Pending Approval',
                    nextPatient: next?.patient?.user?.name || 'None Scheduled',
                    waitingCount: activeQueue.length
                });
            } else {
                setQueueState({
                    currentPatient: '---',
                    tokenNumber: '-',
                    status: 'No Active Patients',
                    nextPatient: '---',
                    waitingCount: 0
                });
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
            fetchData(); // Refresh data
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Stethoscope size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-blue-900">
                                {greeting}, Dr. {user?.lastName || user?.firstName || 'Doctor'}
                            </h1>
                            <p className="text-gray-600 font-medium">Chief Medical Specialist • Level 7 Access</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={syncAccount}
                            disabled={isSyncing}
                            className="bg-white text-gray-700 px-6 py-3 rounded-xl font-bold border-2 border-blue-100 hover:bg-blue-50 transition-all shadow-md flex items-center gap-2"
                        >
                            <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
                            {isSyncing ? 'Syncing...' : 'Sync Dashboard'}
                        </button>
                        <button
                            onClick={() => setIsRecordModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
                        >
                            <Zap size={20} />
                            Quick Diagnosis
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Queue</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.accepted}</h3>
                        <p className="text-sm text-gray-600 font-medium">Accepted Patients</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-2 border-amber-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                                <Clock size={24} />
                            </div>
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.pending}</h3>
                        <p className="text-sm text-gray-600 font-medium">Awaiting Approval</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-2 border-green-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                <CheckCircle size={24} />
                            </div>
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Today</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.completedToday}</h3>
                        <p className="text-sm text-gray-600 font-medium">Completed Today</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                <Award size={24} />
                            </div>
                            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Lifetime</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.totalResolved}</h3>
                        <p className="text-sm text-gray-600 font-medium">Total Resolutions</p>
                    </div>
                </div>

                {/* Queue & List Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Queue Control */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl h-full relative overflow-hidden">
                            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                                <Activity size={180} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Activity className="text-green-400 animate-pulse" /> Live Queue
                                    </h2>
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">Sector Alpha</span>
                                </div>

                                <div className="mb-10">
                                    <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Current Patient</p>
                                    <h3 className="text-4xl font-extrabold mb-4 uppercase truncate">{queueState.currentPatient}</h3>

                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-blue-200 text-xs font-bold uppercase">Token Number</span>
                                            <span className="text-2xl font-black text-white">{queueState.tokenNumber}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-200 text-xs font-bold uppercase">Status</span>
                                            <span className="text-sm font-bold bg-green-500 text-white px-2 py-0.5 rounded">{queueState.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={fetchData}
                                        className="w-full bg-white text-blue-700 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg"
                                    >
                                        <Users size={20} />
                                        Update Local Queue
                                    </button>
                                    <p className="text-center text-blue-200 text-sm font-medium">
                                        {queueState.waitingCount} Patients in active queue
                                    </p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-blue-200 text-xs font-bold uppercase mb-2">Next Scheduled</p>
                                    <p className="font-bold text-white truncate">{queueState.nextPatient}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Appointment List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-md border-2 border-blue-100 overflow-hidden min-h-[500px]">
                            <div className="p-6 border-b-2 border-blue-50 flex items-center justify-between bg-white">
                                <h3 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                                    <Clipboard size={24} className="text-blue-600" />
                                    Clinical Chart Stream
                                </h3>
                                <div className="flex gap-2 text-xs font-bold uppercase">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Real-time</span>
                                </div>
                            </div>

                            <div className="p-0">
                                {loading && appointments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                        <Activity size={48} className="animate-spin mb-4" />
                                        <p className="font-bold uppercase tracking-wider">Loading Registry...</p>
                                    </div>
                                ) : appointments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                        <Calendar size={64} className="mb-4 opacity-20" />
                                        <p className="font-bold uppercase tracking-wider">No Appointments Found</p>
                                    </div>
                                ) : (
                                    <div className="divide-y-2 divide-blue-50">
                                        {appointments.map((apt) => (
                                            <div key={apt._id} className="p-6 hover:bg-blue-50/50 transition-colors group">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 bg-white rounded-xl border-2 border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm group-hover:border-blue-300">
                                                            {apt.patient?.user?.name?.charAt(0) || 'P'}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{apt.patient?.user?.name}</h4>
                                                            <p className="text-gray-500 font-medium text-sm">{apt.reason || 'General Checkup'}</p>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
                                                                    <Clock size={14} />
                                                                    {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                                <div className="text-gray-500 text-xs font-bold">
                                                                    {new Date(apt.date).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${apt.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                            apt.status === 'Pending' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                                                                apt.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {apt.status}
                                                        </span>

                                                        <div className="flex gap-2">
                                                            {apt.status === 'Pending' && (
                                                                <button
                                                                    onClick={() => handleAction(apt._id, 'accept')}
                                                                    className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                                                                    title="Accept"
                                                                >
                                                                    <Check size={20} />
                                                                </button>
                                                            )}
                                                            {apt.status === 'Approved' && (
                                                                <button
                                                                    onClick={() => handleAction(apt._id, 'complete')}
                                                                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                                                                    title="Mark Completed"
                                                                >
                                                                    <Zap size={20} />
                                                                </button>
                                                            )}
                                                            {(apt.status === 'Pending' || apt.status === 'Approved') && (
                                                                <button
                                                                    onClick={() => handleAction(apt._id, 'reject')}
                                                                    className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                                    title="Reject"
                                                                >
                                                                    <XCircle size={20} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-gray-50 border-t-2 border-blue-50 text-center">
                                <button
                                    onClick={() => fetchData()}
                                    className="text-blue-600 font-bold text-sm hover:underline flex items-center justify-center gap-2 mx-auto"
                                >
                                    <RefreshCw size={16} />
                                    Synchronize Digital Registry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 flex items-center gap-4 cursor-pointer hover:bg-blue-50 transition-all group">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Clipboard size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Health Records</h4>
                            <p className="text-sm text-gray-500 font-medium">Manage unified patient data</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-green-100 flex items-center gap-4 cursor-pointer hover:bg-green-50 transition-all group">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Performance</h4>
                            <p className="text-sm text-gray-500 font-medium">View efficiency analytics</p>
                        </div>
                    </div>

                    <div className="bg-red-600 p-6 rounded-xl shadow-md text-white flex items-center gap-4 cursor-pointer hover:bg-red-700 transition-all shadow-red-200">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold">Emergency</h4>
                            <p className="text-sm text-red-100 font-medium">Immediate support line</p>
                        </div>
                    </div>
                </div>

            </div >

            <AddMedicalRecordModal
                isOpen={isRecordModalOpen}
                onClose={() => setIsRecordModalOpen(false)}
            />
        </div >
    );
};

export default DoctorDashboard;
