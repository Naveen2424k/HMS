import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
    Users, Activity, UserPlus,
    ShieldCheck, Search, Trash2,
    Plus, User, Mail, Lock,
    Settings, ChevronDown, CheckCircle, X,
    Calendar, DollarSign, Clock, RefreshCw,
    LayoutGrid, Package, Home, BarChart3, Binary, AlertCircle
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
    const { user: clerkUser } = useUser();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        totalStaff: 0,
        totalDepartments: 0,
        todayRevenue: 0,
        monthlyRevenue: 0,
        pendingBills: 0,
        bedOccupancyRate: 0,
        lowStockAlerts: 0,
        departmentLoad: []
    });
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [occupancy, setOccupancy] = useState([]);
    const [settings, setSettings] = useState({ hospitalName: '', address: '', phone: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Doctor' });

    useEffect(() => {
        fetchData();
        if (activeTab === 'security') fetchAuditLogs();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, invRes, settingsRes, occRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/users'),
                api.get('/admin/inventory'),
                api.get('/admin/settings'),
                api.get('/ipd/occupancy')
            ]);
            setStats(statsRes.data.stats || statsRes.data);
            setUsers(usersRes.data);
            setInventory(invRes.data);
            setSettings(settingsRes.data);
            setOccupancy(occRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAuditLogs = async () => {
        try {
            const res = await api.get('/admin/audit-logs');
            setAuditLogs(res.data);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setProcessingId('new');
        try {
            await api.post('/users', newUser);
            setNewUser({ name: '', email: '', password: '', role: 'Doctor' });
            setIsAddModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error adding user:', error);
            alert(error.response?.data?.message || 'Failed to add user');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        setProcessingId(userId);
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            fetchData();
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`Are you sure you want to delete ${userName}?`)) return;
        setProcessingId(userId);
        try {
            await api.delete(`/users/${userId}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            {/* Header with Navigation */}
            <header className="bg-white border-b-4 border-blue-600 sticky top-0 z-50 shadow-lg">
                <div className="max-w-[1700px] mx-auto px-6 py-6">
                    {/* Top Row: Title and User Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
                                <span className="text-blue-600">Admin</span> Dashboard
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">
                                Hospital Management Control Panel
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-100">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-semibold text-green-700">System Live</span>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-800">
                                    {clerkUser?.fullName || 'Admin User'}
                                </p>
                                <p className="text-[10px] text-blue-600 font-medium mt-0.5">Administrator Account</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 ring-4 ring-blue-50">
                                <ShieldCheck size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Tab Navigation */}
                    <nav className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 overflow-x-auto scrollbar-hide w-full">
                        {[
                            { id: 'overview', label: 'Overview', icon: LayoutGrid },
                            { id: 'identity', label: 'Users', icon: Users },
                            { id: 'finance', label: 'Finance', icon: DollarSign },
                            { id: 'resources', label: 'Status', icon: Home },
                            { id: 'inventory', label: 'Inventory', icon: Package },
                            { id: 'security', label: 'Security', icon: ShieldCheck },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <tab.icon size={15} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>


            <main className="max-w-[1700px] mx-auto p-6 md:p-8 space-y-8">
                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { label: 'Total Patients', val: stats.totalPatients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Doctors', val: stats.totalDoctors, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Today Revenue', val: `$${stats.todayRevenue}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Pending Bills', val: stats.pendingBills, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
                        { label: 'Employees', val: stats.totalStaff, icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'Monthly Revenue', val: `$${stats.monthlyRevenue}`, icon: BarChart3, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                        { label: 'Bed Capacity', val: `${stats.bedOccupancyRate}%`, icon: Home, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { label: 'Stock Alerts', val: stats.lowStockAlerts, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' }
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{s.val}</h3>
                                </div>
                                <div className={`${s.bg} p-2.5 rounded-lg`}>
                                    <s.icon size={20} className={s.color} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modular Content Area */}
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-8 space-y-10">
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl h-[400px] flex items-center justify-center text-slate-300 italic font-black uppercase">
                                    [ Analytics Dashboard - Chart Integration Pending ]
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-lg">
                                        <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-400 mb-6">Recent Activity</h3>
                                        <div className="space-y-4">
                                            {auditLogs.slice(0, 3).map((log, i) => (
                                                <div key={i} className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase">{log.action}: {log.target}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-blue-900 p-10 rounded-[3rem] text-white shadow-2xl">
                                        <h3 className="text-sm font-black uppercase italic tracking-widest text-blue-300 mb-6">System Status</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between border-b border-white/10 pb-3">
                                                <span className="text-[10px] uppercase font-black opacity-40">Database</span>
                                                <span className="text-[10px] uppercase font-black text-green-400">Connected</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/10 pb-3">
                                                <span className="text-[10px] uppercase font-black opacity-40">API Status</span>
                                                <span className="text-[10px] uppercase font-black text-blue-300">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-10">
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Alerts</h3>
                                    <div className="space-y-4">
                                        {stats.lowStockAlerts > 0 && (
                                            <div className="p-5 bg-amber-50 border border-amber-100 rounded-3xl flex items-center gap-6">
                                                <AlertCircle className="text-amber-600" size={32} />
                                                <div>
                                                    <p className="text-xs font-black text-amber-900 uppercase italic">Low Stock</p>
                                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">{stats.lowStockAlerts} Items</p>
                                                </div>
                                            </div>
                                        )}
                                        {stats.pendingBills > 10 && (
                                            <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-6">
                                                <DollarSign className="text-rose-600" size={32} />
                                                <div>
                                                    <p className="text-xs font-black text-rose-900 uppercase italic">Pending Bills</p>
                                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mt-1">{stats.pendingBills} Outstanding</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Identity Registry Tab */}
                    {activeTab === 'identity' && (
                        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-6 bg-slate-50/30">
                                <div className="text-center xl:text-left">
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Identity Registry</h3>
                                    <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">Manage system access and permissions</p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                                    <div className="relative w-full sm:w-72">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm font-medium transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-blue-200 active:scale-95 transition-all text-xs whitespace-nowrap"
                                    >
                                        <Plus size={16} /> Add New User
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 sticky top-0 z-10 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-8 py-4">Full Identity</th>
                                            <th className="px-8 py-4">Communication</th>
                                            <th className="px-8 py-4 text-center">Authorization</th>
                                            <th className="px-8 py-4 text-right">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="px-10 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <RefreshCw className="animate-spin text-blue-600" size={32} />
                                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading users...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : users.filter(u =>
                                            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                                        ).length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-10 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <Users className="text-slate-300" size={48} />
                                                        <div>
                                                            <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">No Users Found</p>
                                                            <p className="text-xs text-slate-300 mt-2">Click "Add User" to create a new account</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : users.filter(u =>
                                            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                                        ).map((u) => (
                                            <tr key={u._id} className="hover:bg-blue-50/10 transition-colors group border-b border-slate-50 last:border-0 font-medium">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                            {u.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-slate-900 block text-sm">{u.name}</span>
                                                            <span className="text-[10px] text-slate-400 uppercase font-medium">#{u._id.slice(-6)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-xs font-medium text-slate-500">{u.email}</td>
                                                <td className="px-8 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide ${u.role === 'Admin' ? 'bg-slate-900 text-white' :
                                                            u.role === 'Doctor' ? 'bg-indigo-600 text-white' :
                                                                u.role === 'Receptionist' ? 'bg-blue-100 text-blue-700' :
                                                                    u.role === 'Nurse' ? 'bg-emerald-100 text-emerald-700' :
                                                                        'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => handleRoleUpdate(u._id, e.target.value)}
                                                            disabled={processingId === u._id}
                                                            className="bg-transparent border-0 opacity-0 group-hover:opacity-100 focus:opacity-100 text-[10px] font-bold uppercase text-blue-600 cursor-pointer hover:underline outline-none transition-all"
                                                        >
                                                            {['Patient', 'Doctor', 'Admin', 'Receptionist', 'Nurse', 'LabTechnician', 'Pharmacist'].map(r =>
                                                                <option key={r} value={r} className="text-slate-900">{r}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id, u.name)}
                                                        disabled={processingId === u._id || u.email === clerkUser?.emailAddresses[0]?.emailAddress}
                                                        className="p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Security Audit Tab */}
                    {activeTab === 'security' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Security Audit</h3>
                                    <p className="text-xs text-slate-500 mt-1 font-medium italic">Operational Activity Logs</p>
                                </div>
                                <button onClick={fetchAuditLogs} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all border border-slate-200">
                                    <RefreshCw size={18} className="text-blue-600" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {auditLogs.length > 0 ? auditLogs.map((log, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-white transition-all group hover:shadow-sm">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm border border-slate-100 shrink-0">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">{log.action}</p>
                                                <p className="text-[9px] font-medium text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800 truncate">{log.target}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                Actor: {log.actorName || 'ID: ' + log.actor?.slice(-6)}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-slate-400 font-medium text-sm">
                                        No logs available
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Resources Tab */}
                    {activeTab === 'resources' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Facility Status</h3>
                                <p className="text-xs text-slate-500 mt-1 font-medium italic tracking-wide">Live Ward & Bed Occupancy</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {occupancy.map(ward => (
                                    <div key={ward._id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-slate-800 text-sm tracking-tight">{ward.name}</h4>
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 uppercase tracking-wider">{ward.beds?.filter(b => b.status === 'Occupied').length}/{ward.capacity} Beds</span>
                                        </div>
                                        <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-2">
                                            {ward.beds?.map(bed => (
                                                <div
                                                    key={bed._id}
                                                    title={`Bed ${bed.bedNumber} - ${bed.status}`}
                                                    className={`aspect-square rounded-lg border flex items-center justify-center transition-all cursor-help text-[10px] font-bold ${bed.status === 'Occupied'
                                                        ? 'bg-blue-600 border-blue-700 text-white shadow-sm'
                                                        : 'bg-white border-slate-200 text-slate-300 hover:border-blue-300'
                                                        }`}
                                                >
                                                    {bed.bedNumber}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Finance Tab */}
                    {activeTab === 'finance' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Proceeds & Accruals</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Daily Revenue</p>
                                    <h4 className="text-3xl font-bold text-emerald-900 tracking-tighter">${stats.todayRevenue.toLocaleString()}</h4>
                                </div>
                                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Monthly Accruals</p>
                                    <h4 className="text-3xl font-bold text-blue-900 tracking-tighter">${stats.monthlyRevenue.toLocaleString()}</h4>
                                </div>
                                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Awaiting Payment</p>
                                    <h4 className="text-3xl font-bold text-slate-900 tracking-tighter">{stats.pendingBills}</h4>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inventory Tab */}
                    {activeTab === 'inventory' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Supplies & Stock</h3>
                                <p className="text-xs text-slate-500 mt-1 font-medium italic">Asset Inventory Management</p>
                            </div>
                            <div className="p-8 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                                        <tr>
                                            <th className="pb-4">Asset Name</th>
                                            <th className="pb-4">Category</th>
                                            <th className="pb-4 text-center">In-Stock</th>
                                            <th className="pb-4 text-right">Condition</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {inventory.map(item => (
                                            <tr key={item._id} className="group hover:bg-blue-50/10 transition-all font-medium">
                                                <td className="py-4 font-bold text-slate-800 text-sm italic">{item.itemName}</td>
                                                <td className="py-4 text-slate-500 text-[10px] uppercase font-bold tracking-wide">{item.category}</td>
                                                <td className="py-4 text-center text-slate-700 text-sm font-bold">{item.quantity} {item.unit}</td>
                                                <td className="py-4 text-right">
                                                    <span className={`px-3 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide ${item.quantity < 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                        {item.quantity < 10 ? 'Low Stock' : 'Stable'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">System Parameters</h3>
                                <p className="text-xs text-slate-500 mt-1 font-medium italic">General Facility Configuration</p>
                            </div>
                            <div className="max-w-3xl space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 ml-1">Facility Name</label>
                                        <input
                                            value={settings.hospitalName}
                                            onChange={(e) => setSettings({ ...settings, hospitalName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm font-semibold transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 ml-1">Contact Details</label>
                                        <input
                                            value={settings.phone}
                                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm font-semibold transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 ml-1">Geographic Address</label>
                                    <input
                                        value={settings.address}
                                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm font-semibold transition-all"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await api.put('/admin/settings', settings);
                                                alert('Settings Synchronized');
                                            } catch (err) { alert('Update Failed'); }
                                        }}
                                        className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 active:scale-95 transition-all text-sm shadow-md"
                                    >
                                        Save Configuration
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/20 rounded-lg"><UserPlus size={24} /></div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">Create New User</h3>
                                    <p className="text-blue-100 text-[10px] font-semibold uppercase tracking-wider">System Registry Access</p>
                                </div>
                            </div>
                            <X onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/20 rounded-lg cursor-pointer transition-all" size={36} />
                        </div>
                        <form onSubmit={handleAddUser} className="p-8 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 ml-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm font-semibold transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="john@hospital.com"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm font-semibold transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 ml-1">Secure Password</label>
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm font-semibold transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 ml-1">Account Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm font-semibold transition-all cursor-pointer appearance-none"
                                >
                                    {['Patient', 'Doctor', 'Admin', 'Receptionist', 'Nurse', 'LabTechnician', 'Pharmacist'].map(r =>
                                        <option key={r} value={r}>{r}</option>
                                    )}
                                </select>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processingId === 'new'}
                                    className="w-full bg-blue-600 py-3 rounded-lg text-white font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all text-sm"
                                >
                                    {processingId === 'new' ? 'Processing...' : 'Register User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
