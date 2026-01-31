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

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const stats = [
        { label: 'Patient Pool', val: '2,840', sub: '+124 this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-100' },
        { label: 'Daily Admisson', val: '12', sub: 'Active queue', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-100' },
        { label: 'Pending Bills', val: '08', sub: 'Action required', icon: CreditCard, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-100' },
        { label: 'Reports Ready', val: '45', sub: 'Verified output', icon: FileText, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-100' },
    ];

    const recentPatients = [
        { name: 'Arlene McCoy', id: '#P-4928', dept: 'Cardiology', status: 'Verified', time: '10:42 AM', tier: 'Premium' },
        { name: 'Theresa Webb', id: '#P-3021', dept: 'Neurology', status: 'Pending', time: '11:15 AM', tier: 'Standard' },
        { name: 'Cody Fisher', id: '#P-8482', dept: 'Pediatrics', status: 'Verified', time: '11:50 AM', tier: 'Premium' },
        { name: 'Jane Cooper', id: '#P-2917', dept: 'ER Wing', status: 'Verified', time: '12:05 PM', tier: 'Emergency' },
    ];

    return (
        <div className="min-h-screen bg-blue-50 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-blue-900">
                                {greeting}, {user?.firstName || 'Receptionist'}
                            </h1>
                            <p className="text-gray-600 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Terminal 01 • Operational Registry Node
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="bg-white text-gray-700 px-6 py-3 rounded-xl font-bold border-2 border-blue-100 hover:bg-blue-50 transition-all shadow-md flex items-center gap-2">
                            <Filter size={20} />
                            Queue Manager
                        </button>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2">
                            <UserPlus size={20} />
                            New Patient
                        </button>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className={`bg-white p-6 rounded-xl shadow-md border-2 ${stat.border}`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className={`text-xs font-bold ${stat.color} uppercase tracking-wider`}>Live</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{stat.val}</h3>
                            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                            <p className={`text-xs font-bold mt-2 ${stat.color}`}>{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Patient Registry Stream */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-md border-2 border-blue-100 overflow-hidden min-h-[500px]">
                            <div className="p-6 border-b-2 border-blue-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                                <div>
                                    <h3 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                                        <Activity size={24} className="text-blue-600" />
                                        Intake Protocol Stream
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">Real-time daily manifest</p>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search identity..."
                                        className="pl-10 pr-4 py-2 bg-blue-50 border-2 border-transparent focus:border-blue-200 outline-none rounded-xl text-sm w-full md:w-64 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="divide-y-2 divide-blue-50">
                                {recentPatients.map((p, i) => (
                                    <div key={i} className="p-6 hover:bg-blue-50/50 transition-all group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-blue-50 rounded-xl border-2 border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 underline decoration-blue-200 underline-offset-4">{p.name}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.id}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.tier === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                                            {p.tier}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1 md:justify-items-center">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time</p>
                                                    <p className="text-sm font-bold text-gray-700">{p.time}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Department</p>
                                                    <p className="text-sm font-bold text-blue-600">{p.dept}</p>
                                                </div>
                                                <div className="hidden md:block">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 animate-pulse'}`}>
                                                        {p.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                <ArrowRight size={24} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-gray-50 border-t-2 border-blue-50 text-center">
                                <button className="text-blue-600 font-bold text-sm hover:underline flex items-center justify-center gap-2 mx-auto">
                                    <Globe size={18} />
                                    Synchronize Digital Registry
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Revenue & Saturation */}
                    <div className="space-y-8">
                        {/* Revenue Card */}
                        <div className="bg-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                                <TrendingUp size={150} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-blue-200 text-sm font-bold uppercase tracking-widest">Aggregate Revenue</h3>
                                    <div className="bg-white/10 p-2 rounded-lg">
                                        <CreditCard size={20} />
                                    </div>
                                </div>
                                <div className="flex items-end gap-3 mb-8">
                                    <h2 className="text-4xl font-black italic">$243,500</h2>
                                    <span className="text-emerald-400 font-bold text-sm mb-1">+12%</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                                        <span className="text-blue-200 text-xs font-bold uppercase">Surgical Units</span>
                                        <span className="font-bold">$142.2k</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                                        <span className="text-blue-200 text-xs font-bold uppercase">Clinical Fees</span>
                                        <span className="font-bold">$101.3k</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Operational Saturation */}
                        <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-blue-100">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-blue-900">Saturation</h3>
                                <Zap size={20} className="text-amber-500" />
                            </div>
                            <div className="space-y-6">
                                {[
                                    { label: 'Critical Care', val: 75, color: 'bg-blue-600' },
                                    { label: 'OPD Consults', val: 92, color: 'bg-green-600' },
                                    { label: 'Emergency', val: 45, color: 'bg-red-600' },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-bold text-gray-700">{s.label}</span>
                                            <span className="text-sm font-bold text-blue-600">{s.val}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${s.val}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                                <RefreshCw size={20} />
                                Re-balance Queue
                            </button>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-red-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Phone size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Emergency</h3>
                            </div>
                            <a href="tel:108" className="block w-full py-3 bg-white text-red-600 rounded-xl font-bold text-center hover:bg-red-50 transition-all">
                                📞 Call 108
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReceptionistDashboard;
