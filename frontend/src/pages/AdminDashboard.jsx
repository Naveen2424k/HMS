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
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
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
                            <h1 className="text-3xl font-[1000] tracking-tighter text-slate-800 leading-none uppercase italic">
                                <span className="text-blue-600">Admin</span> Page
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
                                Institutional Operational Control Active
                            </p>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-4 px-6 py-3 bg-green-50 rounded-full border border-green-100">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-green-600">System Online</span>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black italic text-slate-400 uppercase tracking-widest">
                                    {clerkUser?.fullName?.toUpperCase() || 'ADMIN'}
                                </p>
                                <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-1">Super Admin</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 border-2 border-white ring-4 ring-blue-50">
                                <ShieldCheck size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Tab Navigation */}
                    <nav className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto scrollbar-hide w-full">
                        {[
                            { id: 'overview', label: 'Oversight', icon: LayoutGrid },
                            { id: 'identity', label: 'Identity', icon: Users },
                            { id: 'finance', label: 'Ledger', icon: DollarSign },
                            { id: 'resources', label: 'Resources', icon: Home },
                            { id: 'inventory', label: 'Supply', icon: Package },
                            { id: 'security', label: 'Audit', icon: ShieldCheck },
                            { id: 'settings', label: 'Config', icon: Settings }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>


            <main className="max-w-[1700px] mx-auto p-6 md:p-10 space-y-10">
                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            label: 'Total Patients',
                            val: stats.totalPatients,
                            icon: Users,
                            bgGradient: 'from-blue-500 to-blue-600',
                            iconBg: 'bg-blue-100',
                            iconColor: 'text-blue-600',
                            textColor: 'text-blue-700'
                        },
                        {
                            label: 'Doctors',
                            val: stats.totalDoctors,
                            icon: Activity,
                            bgGradient: 'from-indigo-500 to-indigo-600',
                            iconBg: 'bg-indigo-100',
                            iconColor: 'text-indigo-600',
                            textColor: 'text-indigo-700'
                        },
                        {
                            label: 'Today Revenue',
                            val: `$${stats.todayRevenue}`,
                            icon: DollarSign,
                            bgGradient: 'from-emerald-500 to-emerald-600',
                            iconBg: 'bg-emerald-100',
                            iconColor: 'text-emerald-600',
                            textColor: 'text-emerald-700'
                        },
                        {
                            label: 'Pending Bills',
                            val: stats.pendingBills,
                            icon: AlertCircle,
                            bgGradient: 'from-rose-500 to-rose-600',
                            iconBg: 'bg-rose-100',
                            iconColor: 'text-rose-600',
                            textColor: 'text-rose-700'
                        },
                        {
                            label: 'Staff Members',
                            val: stats.totalStaff,
                            icon: UserPlus,
                            bgGradient: 'from-purple-500 to-purple-600',
                            iconBg: 'bg-purple-100',
                            iconColor: 'text-purple-600',
                            textColor: 'text-purple-700'
                        },
                        {
                            label: 'Monthly Revenue',
                            val: `$${stats.monthlyRevenue}`,
                            icon: BarChart3,
                            bgGradient: 'from-cyan-500 to-cyan-600',
                            iconBg: 'bg-cyan-100',
                            iconColor: 'text-cyan-600',
                            textColor: 'text-cyan-700'
                        },
                        {
                            label: 'Bed Occupancy',
                            val: `${stats.bedOccupancyRate}%`,
                            icon: Home,
                            bgGradient: 'from-orange-500 to-orange-600',
                            iconBg: 'bg-orange-100',
                            iconColor: 'text-orange-600',
                            textColor: 'text-orange-700'
                        },
                        {
                            label: 'Low Stock Items',
                            val: stats.lowStockAlerts,
                            icon: Package,
                            bgGradient: 'from-amber-500 to-amber-600',
                            iconBg: 'bg-amber-100',
                            iconColor: 'text-amber-600',
                            textColor: 'text-amber-700'
                        }
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border border-slate-100"
                        >
                            {/* Gradient Top Border */}
                            <div className={`h-2 bg-gradient-to-r ${s.bgGradient}`}></div>

                            {/* Card Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`${s.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                        <s.icon size={28} className={s.iconColor} strokeWidth={2.5} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className={`text-4xl font-bold ${s.textColor} tracking-tight`}>
                                        {s.val}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-600">
                                        {s.label}
                                    </p>
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
                            <div className="p-10 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-8 bg-slate-50/50">
                                <div className="text-center xl:text-left">
                                    <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter text-slate-800 leading-none">Identity Registry</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Access Management</p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                                    <div className="relative w-full sm:w-80">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="SEARCH..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-[10px] uppercase tracking-widest transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase italic tracking-widest flex items-center gap-3 shadow-lg hover:shadow-blue-200 active:scale-95 transition-all text-xs whitespace-nowrap"
                                    >
                                        <Plus size={18} /> Add User
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white sticky top-0 z-10 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic border-b border-slate-100">
                                        <tr>
                                            <th className="px-10 py-6">Name</th>
                                            <th className="px-10 py-6">Email</th>
                                            <th className="px-10 py-6 text-center">Role</th>
                                            <th className="px-10 py-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {users.filter(u =>
                                            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                                        ).map((u) => (
                                            <tr key={u._id} className="hover:bg-blue-50/20 transition-colors group">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                                            {u.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <span className="font-black text-lg text-slate-700 uppercase italic tracking-tighter block">{u.name}</span>
                                                            <span className="text-[10px] font-black text-slate-400">ID: {u._id.slice(-8).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 font-bold text-slate-400 text-xs italic">{u.email}</td>
                                                <td className="px-10 py-6 text-center">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${u.role === 'Admin' ? 'bg-blue-900 text-white' :
                                                            u.role === 'Doctor' ? 'bg-indigo-600 text-white' :
                                                                u.role === 'Receptionist' ? 'bg-blue-100 text-blue-600' :
                                                                    u.role === 'Nurse' ? 'bg-emerald-100 text-emerald-600' :
                                                                        'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => handleRoleUpdate(u._id, e.target.value)}
                                                            disabled={processingId === u._id}
                                                            className="bg-transparent border-0 opacity-0 group-hover:opacity-100 focus:opacity-100 text-[10px] font-black uppercase tracking-widest cursor-pointer text-blue-600 hover:underline outline-none transition-all w-24"
                                                        >
                                                            {['Patient', 'Doctor', 'Admin', 'Receptionist', 'Nurse', 'LabTechnician', 'Pharmacist'].map(r =>
                                                                <option key={r} value={r} className="text-slate-900">{r}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id, u.name)}
                                                        disabled={processingId === u._id || u.email === clerkUser?.emailAddresses[0]?.emailAddress}
                                                        className="p-3 text-red-300 hover:bg-rose-500 hover:text-white rounded-xl transition-all disabled:opacity-0 group-hover:opacity-100 opacity-0 active:scale-95"
                                                    >
                                                        <Trash2 size={20} />
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
                        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-10 space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter text-slate-800 leading-none">Security Audit</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Activity Log</p>
                                </div>
                                <button onClick={fetchAuditLogs} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                                    <RefreshCw size={24} className="text-blue-600" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {auditLogs.length > 0 ? auditLogs.map((log, i) => (
                                    <div key={i} className="flex gap-6 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white transition-all group">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 shrink-0 group-hover:scale-110 transition-transform">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{log.action}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase">{new Date(log.createdAt).toLocaleString()}</p>
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 uppercase italic truncate">{log.target}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mt-2 italic">
                                                Actor: {log.actorName || 'System ID: ' + log.actor?.slice(-6)}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 text-slate-300 font-black uppercase italic">
                                        No Audit Logs Available
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Placeholder Tabs */}
                    {['finance', 'resources', 'inventory', 'settings'].includes(activeTab) && (
                        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-20 text-center space-y-6">
                            <Binary size={80} className="mx-auto text-blue-100" />
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800">Module In Development</h3>
                            <p className="text-slate-400 font-bold max-w-sm mx-auto uppercase text-xs tracking-widest leading-relaxed">
                                {activeTab.toUpperCase()} module deployment in progress...
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[4rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-[12px] border-slate-50">
                        <div className="bg-blue-600 p-10 text-white flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/20 rounded-2xl"><UserPlus size={36} /></div>
                                <div>
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Add User</h3>
                                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mt-2">New Account</p>
                                </div>
                            </div>
                            <X onClick={() => setIsAddModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl cursor-pointer transition-all" size={44} />
                        </div>
                        <form onSubmit={handleAddUser} className="p-12 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="FULL NAME"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[2rem] font-black uppercase text-lg outline-none transition-all placeholder:opacity-30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Email</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="EMAIL@HOSPITAL.COM"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[2rem] font-black uppercase text-lg outline-none transition-all placeholder:opacity-30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Password</label>
                                <input
                                    required
                                    type="password"
                                    placeholder="MIN 8 CHARACTERS"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[2rem] font-black text-lg outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[2rem] font-black uppercase text-lg outline-none transition-all cursor-pointer appearance-none"
                                >
                                    {['Patient', 'Doctor', 'Admin', 'Receptionist', 'Nurse', 'LabTechnician', 'Pharmacist'].map(r =>
                                        <option key={r} value={r}>{r}</option>
                                    )}
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={processingId === 'new'}
                                className="w-full bg-blue-600 py-6 rounded-[2rem] text-white font-[1000] italic uppercase tracking-[0.3em] shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-xl"
                            >
                                {processingId === 'new' ? 'Creating...' : 'Create User'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
