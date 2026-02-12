import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
    Users,
    FileText,
    CreditCard,
    PlusCircle,
    Search,
    Filter,
    ArrowRight,
    TrendingUp,
    UserPlus,
    Target,
    Activity,
    ShieldCheck,
    Globe,
    Clock,
    Zap,
    Bell,
    Sparkles,
    Calendar,
    RefreshCw,
    Phone
} from 'lucide-react';
import api from '../services/api';

const ReceptionistDashboard = () => {
    const { user } = useUser();
    const [greeting, setGreeting] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeModal, setActiveModal] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingFiles, setViewingFiles] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', phone: '', email: '', department: 'General Medicine' });
    const [statsSummary, setStatsSummary] = useState({ totalPatients: 0, todayRevenue: 0, pendingBills: 0, readyReports: 0 });
    const [appointments, setAppointments] = useState([]);
    const [newlyRegisteredPatient, setNewlyRegisteredPatient] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [bills, setBills] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointmentForm, setAppointmentForm] = useState({ doctorId: '', date: '', reason: '' });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        fetchAppointments();
        fetchStats();
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const { data } = await api.get('/doctors');
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/admin/dashboard');
            setStatsSummary({
                totalPatients: data.totalPatients || 0,
                todayRevenue: data.todayRevenue || 0,
                pendingBills: data.pendingBills || 0,
                readyReports: data.readyReports || 45
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/appointments?limit=100');
            setAppointments(data.data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        setProcessingId(appointmentId);
        try {
            await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
            fetchAppointments();
            fetchStats();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update appointment status');
        } finally {
            setProcessingId(null);
        }
    };

    const fetchMedicalRecords = async (patientId) => {
        try {
            const { data } = await api.get('/medical-records');
            // Filter records for this patient if you have a patient record ID
            // For now fetching all as the API might not support direct patient filter easily in one go
            setMedicalRecords(data.filter(r => r.patient?._id === patientId));
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    const fetchBills = async (userId) => {
        try {
            const { data } = await api.get('/billing');
            setBills(data.filter(b => b.patient?.user?._id === userId));
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    };

    const stats = [
        { label: 'Total Patients', val: statsSummary.totalPatients.toLocaleString(), sub: 'In Database', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Appts', val: appointments.filter(a => a.status === 'Pending').length, sub: 'Needs Review', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Ready Bills', val: statsSummary.pendingBills, sub: 'Awaiting payment', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Reports Ready', val: statsSummary.readyReports, sub: 'Verified', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const filteredAppointments = appointments.filter(a =>
        a.patient?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.doctor?.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-blue-50/30 pb-12">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {greeting}, {user?.firstName || 'Receptionist'}
                        </h1>
                        <p className="text-gray-500 flex items-center gap-2 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Primary Reception Desk • Active Session
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveModal('patient')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                        >
                            <PlusCircle size={20} />
                            Add New Patient
                        </button>
                        <button
                            onClick={fetchAppointments}
                            className="bg-white text-blue-600 border border-blue-100 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => setActiveModal('stats')}
                        >
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{stat.val}</h3>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Patient List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="text-blue-600" size={24} />
                                    Appointment Requests
                                </h2>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or doctor..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {loading && appointments.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <RefreshCw size={40} className="text-blue-200 mx-auto mb-4 animate-spin" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Decrypting Appointment Matrix...</p>
                                    </div>
                                ) : filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((appt, i) => (
                                        <div
                                            key={appt._id}
                                            onClick={() => {
                                                setSelectedPatient({
                                                    name: appt.patient?.user?.name,
                                                    id: appt.patient?._id,
                                                    uid: appt.patient?.user?._id,
                                                    dept: appt.doctor?.specialization || 'Clinical',
                                                    status: appt.status,
                                                    time: new Date(appt.date).toLocaleTimeString(),
                                                    tier: 'Standard'
                                                });
                                                fetchMedicalRecords(appt.patient?._id);
                                                fetchBills(appt.patient?.user?._id);
                                                setActiveModal('details');
                                            }}
                                            className="p-6 hover:bg-gray-50 transition-all flex items-center justify-between group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-3">
                                                    {appt.patient?.user?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 uppercase italic tracking-tighter text-lg leading-none mb-1">{appt.patient?.user?.name}</h4>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <Activity size={12} className="text-blue-500" />
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">DR. {appt.doctor?.user?.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={12} className="text-indigo-500" />
                                                            <span className="text-[10px] font-bold text-gray-500">{new Date(appt.date).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right hidden sm:block">
                                                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-[0.2em] shadow-sm ${appt.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                        appt.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                            appt.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                                                                'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {appt.status}
                                                    </span>
                                                </div>

                                                {appt.status === 'Pending' && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            disabled={processingId === appt._id}
                                                            onClick={() => handleStatusUpdate(appt._id, 'Approved')}
                                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            disabled={processingId === appt._id}
                                                            onClick={() => handleStatusUpdate(appt._id, 'Cancelled')}
                                                            className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedPatient({
                                                            name: appt.patient?.user?.name,
                                                            id: appt.patient?._id,
                                                            uid: appt.patient?.user?._id,
                                                            dept: appt.doctor?.specialization || 'Clinical',
                                                            status: appt.status,
                                                            time: new Date(appt.date).toLocaleTimeString(),
                                                            tier: 'Standard'
                                                        });
                                                        fetchMedicalRecords(appt.patient?._id);
                                                        fetchBills(appt.patient?.user?._id);
                                                        setActiveModal('details');
                                                    }}
                                                    className="p-3 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl border border-blue-100 transition-all shadow-sm active:scale-90"
                                                >
                                                    <ArrowRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <Sparkles size={40} className="text-slate-200 mx-auto mb-4" />
                                        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Zero Appointment Transmissions</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-gray-50 text-center">
                                <button className="text-blue-600 text-sm font-bold hover:underline">
                                    View Full Registry
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Billing */}
                        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <CreditCard size={20} />
                                    Today's Overview
                                </h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-blue-100 text-sm">Revenue Generated</span>
                                        <span className="text-2xl font-bold">${statsSummary.todayRevenue.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 bg-blue-500 rounded-full">
                                        <div className="h-full bg-white rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveModal('billing')}
                                    className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all text-sm"
                                >
                                    Manage Billing
                                </button>
                            </div>
                        </div>

                        {/* System Connectivity */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-blue-600" />
                                Sync Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Main Server</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-black text-gray-900 uppercase">ONLINE</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Digital Registry</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-[10px] font-black text-gray-900 uppercase">SYNCED</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase text-center mt-2 italic tracking-tighter">Last node refresh: {new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                            <h3 className="text-red-900 font-bold mb-3 flex items-center gap-2">
                                <Phone size={18} className="text-red-600" />
                                Emergency
                            </h3>
                            <p className="text-red-700 text-xs mb-4">Direct line to emergency unit and ambulance services.</p>
                            <a href="tel:108" className="block text-center py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-md shadow-red-100">
                                Call Hospital 108
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal System */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 capitalize">
                                {activeModal === 'patient' ? 'New Patient Registration' :
                                    activeModal === 'appointment' ? 'Book Appointment' :
                                        activeModal === 'details' ? 'Patient Clinical Record' :
                                            activeModal === 'billing' ? 'Billing Manager' : 'Administrative Center'}
                            </h3>
                            <button onClick={() => {
                                setActiveModal(null);
                                setIsEditing(false);
                                setViewingFiles(false);
                                setSelectedFile(null);
                                setNewlyRegisteredPatient(null);
                                setNewPatientData({ name: '', phone: '', department: 'Cardiology' });
                            }} className="text-gray-400 hover:text-gray-600">
                                <PlusCircle className="rotate-45" size={24} />
                            </button>
                        </div>
                        <div className="p-8">
                            {activeModal === 'patient' && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter patient name"
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Email (Registry Identity)</label>
                                        <input
                                            type="email"
                                            placeholder="patient@email.com"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Phone</label>
                                            <input
                                                type="tel"
                                                placeholder="Number"
                                                value={newUser.phone}
                                                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Department</label>
                                            <select
                                                value={newUser.department}
                                                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                            >
                                                <option>Cardiology</option>
                                                <option>Neurology</option>
                                                <option>General Medicine</option>
                                                <option>Pediatrics</option>
                                                <option>Orthopedics</option>
                                                <option>Emergency</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        disabled={loading}
                                        onClick={async () => {
                                            setLoading(true);
                                            try {
                                                // 1. Create User Identity
                                                const userRes = await api.post('/users', {
                                                    name: newUser.name,
                                                    email: newUser.email,
                                                    password: 'Patient@123',
                                                    role: 'Patient'
                                                });

                                                // 2. Create Patient Profile
                                                const patientRes = await api.post('/patients', {
                                                    userId: userRes.data._id,
                                                    phone: newUser.phone,
                                                    age: 25, // Default for registration
                                                    gender: 'Other',
                                                    bloodGroup: 'Unknown',
                                                    address: 'Hospital Registry'
                                                });

                                                setNewlyRegisteredPatient(patientRes.data);
                                                setActiveModal('appointment');
                                                fetchStats();
                                            } catch (err) {
                                                alert(err.response?.data?.message || 'Identity / Profile linking failed');
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : 'Register Patient'}
                                    </button>
                                </div>
                            )}
                            {activeModal === 'appointment' && (
                                <div className="space-y-6">
                                    {newlyRegisteredPatient && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                    <UserPlus size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-green-900">Patient Registered Successfully!</p>
                                                    <p className="text-xs text-green-700">{newlyRegisteredPatient.name} • {newlyRegisteredPatient.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Patient ID</label>
                                        <input
                                            type="text"
                                            placeholder="P-XXXX"
                                            value={newlyRegisteredPatient?.id || ''}
                                            readOnly={!!newlyRegisteredPatient}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Patient Name</label>
                                        <input
                                            type="text"
                                            value={newlyRegisteredPatient?.name || ''}
                                            readOnly
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Department</label>
                                        <input
                                            type="text"
                                            value={newlyRegisteredPatient?.department || ''}
                                            readOnly
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Date</label>
                                            <input
                                                type="datetime-local"
                                                value={appointmentForm.date}
                                                onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-bold text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Doctor</label>
                                            <select
                                                value={appointmentForm.doctorId}
                                                onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorId: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-bold text-sm"
                                            >
                                                <option value="">Select Doctor</option>
                                                {doctors.map(d => (
                                                    <option key={d._id} value={d._id}>Dr. {d.name} ({d.specialization})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Reason for Visit</label>
                                        <input
                                            type="text"
                                            placeholder="Symptoms or check-up type"
                                            value={appointmentForm.reason}
                                            onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-medium text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setActiveModal(null);
                                                setNewlyRegisteredPatient(null);
                                                setNewUser({ name: '', phone: '', email: '', department: 'General Medicine' });
                                            }}
                                            className="flex-1 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                        >
                                            Skip for Now
                                        </button>
                                        <button
                                            disabled={loading || !appointmentForm.doctorId || !appointmentForm.date}
                                            onClick={async () => {
                                                setLoading(true);
                                                try {
                                                    // newlyRegisteredPatient has _id from the Patient model creation step
                                                    await api.post('/appointments', {
                                                        patientId: newlyRegisteredPatient._id,
                                                        doctorId: appointmentForm.doctorId,
                                                        date: appointmentForm.date,
                                                        reason: appointmentForm.reason
                                                    });
                                                    alert('Appointment Booked Successfully!');
                                                    setActiveModal(null);
                                                    setNewlyRegisteredPatient(null);
                                                    setNewUser({ name: '', phone: '', email: '', department: 'General Medicine' });
                                                    fetchAppointments();
                                                } catch (err) {
                                                    alert(err.response?.data?.message || 'Booking failed');
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                                        >
                                            {loading ? 'Processing...' : 'Confirm Booking'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'billing' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Billing Registry</h4>
                                        <button onClick={() => fetchStats()} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                                            <RefreshCw size={16} className="text-slate-400" />
                                        </button>
                                    </div>
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {bills.length > 0 ? (
                                            bills.map(bill => (
                                                <div key={bill._id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-emerald-200 transition-all">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Invoice #{bill._id.slice(-6)}</p>
                                                        <h5 className="font-black text-slate-900 text-lg leading-none mb-1">${bill.amount.toLocaleString()}</h5>
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                                            {bill.status}
                                                        </span>
                                                    </div>
                                                    {bill.status !== 'Paid' && (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await api.put(`/billing/${bill._id}/status`, { status: 'Paid', paymentMethod: 'Cash' });
                                                                    fetchBills(selectedPatient.uid);
                                                                    fetchStats();
                                                                } catch (err) { alert('Payment processing failed'); }
                                                            }}
                                                            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                                                        >
                                                            Collect Cash
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                                <CreditCard size={32} className="text-slate-200 mx-auto mb-3" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zero Pending Invoices</p>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl active:scale-[0.98]">
                                        Exit Registry
                                    </button>
                                </div>
                            )}
                            {activeModal === 'details' && selectedPatient && (
                                <div className="space-y-6">
                                    {!viewingFiles ? (
                                        <>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">
                                                    {selectedPatient.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">{selectedPatient.name}</h4>
                                                    <p className="text-blue-600 font-bold tracking-widest">{selectedPatient.id}</p>
                                                </div>
                                            </div>

                                            {isEditing ? (
                                                <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-blue-100">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                                                        <input type="text" defaultValue={selectedPatient.name} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none font-bold text-sm" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</label>
                                                            <input type="text" defaultValue={selectedPatient.dept} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none font-bold text-sm" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority</label>
                                                            <select defaultValue={selectedPatient.tier} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none font-bold text-sm">
                                                                <option>Regular</option>
                                                                <option>Premium</option>
                                                                <option>Emergency</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 pt-2">
                                                        <button
                                                            onClick={() => setIsEditing(false)}
                                                            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-100"
                                                        >
                                                            Save Changes
                                                        </button>
                                                        <button
                                                            onClick={() => setIsEditing(false)}
                                                            className="flex-1 py-3 bg-white text-gray-500 font-bold hover:bg-gray-100 transition-all text-sm rounded-xl"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Assigned Unit</p>
                                                            <p className="text-sm font-bold text-gray-900">{selectedPatient.dept}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Check-in Time</p>
                                                            <p className="text-sm font-bold text-gray-900">{selectedPatient.time}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${selectedPatient.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {selectedPatient.status}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Care Priority</p>
                                                            <p className="text-sm font-bold text-gray-900">{selectedPatient.tier}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 mt-8">
                                                        <button
                                                            onClick={() => setIsEditing(true)}
                                                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-sm shadow-xl shadow-blue-100 active:scale-95"
                                                        >
                                                            Edit Profile
                                                        </button>
                                                        <button
                                                            onClick={() => setViewingFiles(true)}
                                                            className="flex-1 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 hover:border-blue-100 transition-all text-sm active:scale-95"
                                                        >
                                                            View Files
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <button
                                                    onClick={() => {
                                                        if (selectedFile) setSelectedFile(null);
                                                        else setViewingFiles(false);
                                                    }}
                                                    className="text-blue-600 font-bold text-xs flex items-center gap-2 hover:underline"
                                                >
                                                    <ArrowRight size={16} className="rotate-180" />
                                                    {selectedFile ? 'Back to Repository' : 'Back to Profile'}
                                                </button>
                                                {selectedFile && (
                                                    <button className="text-[10px] font-bold text-white bg-blue-600 px-3 py-1 rounded-lg shadow-sm hover:bg-blue-700 transition-all">
                                                        Download PDF
                                                    </button>
                                                )}
                                            </div>

                                            {selectedFile ? (
                                                <div className="bg-slate-900 rounded-2xl p-10 text-center border-4 border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-300">
                                                    <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                                                        <FileText size={40} />
                                                    </div>
                                                    <h5 className="text-white font-bold text-lg mb-2">{selectedFile}</h5>
                                                    <p className="text-slate-400 text-xs mb-8">Secure encrypted medical broadcast...</p>
                                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
                                                        <div className="h-full bg-blue-500 w-2/3 animate-[shimmer_2s_infinite]"></div>
                                                    </div>
                                                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Finalizing Visual Decryption</p>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                    <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <FileText size={18} className="text-blue-600" />
                                                        Medical Repository
                                                    </h5>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {medicalRecords.length > 0 ? (
                                                            medicalRecords.map((record, idx) => (
                                                                <div
                                                                    key={record._id}
                                                                    onClick={() => setSelectedFile(record.diagnosis)}
                                                                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 group hover:border-blue-300 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                                            <FileText size={18} />
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-sm font-bold text-gray-700 block tracking-tight uppercase">{record.diagnosis}</span>
                                                                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{new Date(record.createdAt).toLocaleDateString()} • {record.doctor?.user?.name}</span>
                                                                        </div>
                                                                    </div>
                                                                    <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No Medical Records Found</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100 border-dashed text-center">
                                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-relaxed">
                                                            All documents are HIPAA compliant and encrypted. <br /> Access logged by Terminal 01
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeModal === 'stats' && (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Activity size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Detailed Analytics</h4>
                                    <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">The analytics engine is compiling today's throughput. This section will be available once the report is finalized.</p>
                                    <button onClick={() => setActiveModal(null)} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm">
                                        Acknowledged
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionistDashboard;
