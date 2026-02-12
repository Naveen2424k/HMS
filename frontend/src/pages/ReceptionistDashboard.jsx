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

const ReceptionistDashboard = () => {
    const { user } = useUser();
    const [greeting, setGreeting] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeModal, setActiveModal] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingFiles, setViewingFiles] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newPatientData, setNewPatientData] = useState({ name: '', phone: '', department: 'Cardiology' });
    const [newlyRegisteredPatient, setNewlyRegisteredPatient] = useState(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const stats = [
        { label: 'Total Patients', val: '2,840', sub: '+124 this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'New Admissions', val: '12', sub: 'In process', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Bills', val: '08', sub: 'Awaiting payment', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Reports Ready', val: '45', sub: 'Verified', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    const recentPatients = [
        { name: 'Arlene McCoy', id: 'P-4928', dept: 'Cardiology', status: 'Verified', time: '10:42 AM', tier: 'Regular' },
        { name: 'Theresa Webb', id: 'P-3021', dept: 'Neurology', status: 'Pending', time: '11:15 AM', tier: 'Regular' },
        { name: 'Cody Fisher', id: 'P-8482', dept: 'Pediatrics', status: 'Verified', time: '11:50 AM', tier: 'Regular' },
        { name: 'Jane Cooper', id: 'P-2917', dept: 'Emergency', status: 'Verified', time: '12:05 PM', tier: 'Emergency' },
    ];

    const filteredPatients = recentPatients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
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
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{stat.val}</h3>
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
                                    <Users className="text-blue-600" size={24} />
                                    Today's Patients
                                </h2>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((p, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setSelectedPatient(p);
                                                setActiveModal('details');
                                            }}
                                            className="p-6 hover:bg-gray-50 transition-all flex items-center justify-between group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-blue-600 font-bold">{p.id}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-xs text-gray-500 font-medium">{p.dept}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-6">
                                                <div className="hidden sm:block">
                                                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider text-right">Status</p>
                                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm ${p.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {p.status}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedPatient(p);
                                                        setActiveModal('details');
                                                    }}
                                                    className="p-2 bg-transparent hover:bg-white rounded-xl border border-transparent hover:border-gray-200 text-gray-400 hover:text-blue-600 transition-all shadow-sm group-hover:text-blue-600 group-hover:border-gray-200 group-hover:bg-white active:scale-95"
                                                >
                                                    <ArrowRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">Zero patients found</p>
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
                                        <span className="text-2xl font-bold">$243.5K</span>
                                    </div>
                                    <div className="h-1.5 bg-blue-500 rounded-full">
                                        <div className="h-full bg-white rounded-full" style={{ width: '80%' }}></div>
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
                                            value={newPatientData.name}
                                            onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Phone</label>
                                            <input
                                                type="tel"
                                                placeholder="Number"
                                                value={newPatientData.phone}
                                                onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Department</label>
                                            <select
                                                value={newPatientData.department}
                                                onChange={(e) => setNewPatientData({ ...newPatientData, department: e.target.value })}
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
                                        onClick={() => {
                                            // Simulate patient registration
                                            const newPatient = {
                                                name: newPatientData.name,
                                                phone: newPatientData.phone,
                                                department: newPatientData.department,
                                                id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
                                                status: 'Pending',
                                                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                            };
                                            setNewlyRegisteredPatient(newPatient);
                                            setActiveModal('appointment');
                                        }}
                                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                    >
                                        Register Patient
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
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Time</label>
                                            <input
                                                type="time"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setActiveModal(null);
                                                setNewlyRegisteredPatient(null);
                                                setNewPatientData({ name: '', phone: '', department: 'Cardiology' });
                                            }}
                                            className="flex-1 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                        >
                                            Skip for Now
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Handle appointment booking
                                                alert(`Appointment booked for ${newlyRegisteredPatient?.name}`);
                                                setActiveModal(null);
                                                setNewlyRegisteredPatient(null);
                                                setNewPatientData({ name: '', phone: '', department: 'Cardiology' });
                                            }}
                                            className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                        >
                                            Confirm Booking
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeModal === 'billing' && (
                                <div className="text-center py-10">
                                    <CreditCard size={48} className="text-blue-200 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium mb-6">Redirecting to payment gateway or finalizing invoice...</p>
                                    <button onClick={() => setActiveModal(null)} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-sm">
                                        Close Manager
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
                                                        {['Lab_Report_Jan.pdf', 'X-Ray_UpperChest.jpg', 'Admission_Note.docx'].map((file, idx) => (
                                                            <div
                                                                key={idx}
                                                                onClick={() => setSelectedFile(file)}
                                                                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 group hover:border-blue-300 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                                        <FileText size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-sm font-bold text-gray-700 block">{file}</span>
                                                                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Secure Document • 2.4 MB</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase">Open Record</span>
                                                                    <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                                                </div>
                                                            </div>
                                                        ))}
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
