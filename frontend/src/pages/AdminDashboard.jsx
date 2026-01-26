import { useState, useEffect } from 'react';
import {
    Users,
    Stethoscope,
    CalendarCheck,
    TrendingUp,
    ArrowUpRight,
    Plus,
    Search,
    MoreVertical,
    Filter
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const data = [
    { name: 'Mon', appointments: 400, revenue: 2400 },
    { name: 'Tue', appointments: 300, revenue: 1398 },
    { name: 'Wed', appointments: 200, revenue: 9800 },
    { name: 'Thu', appointments: 278, revenue: 3908 },
    { name: 'Fri', appointments: 489, revenue: 4800 },
    { name: 'Sat', appointments: 239, revenue: 3800 },
    { name: 'Sun', appointments: 150, revenue: 2200 },
];

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <div className="luxury-card p-8 group overflow-hidden relative">
        <div className="flex items-center justify-between relative z-10">
            <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 text-slate-800 transition-transform group-hover:scale-110 duration-500`}>
                <Icon size={26} className="text-primary-600" />
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowUpRight size={14} className="rotate-90" />}
                {Math.abs(trend)}%
            </div>
        </div>
        <div className="mt-6 relative z-10">
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">{title}</h3>
            <p className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight transition-transform group-hover:translate-x-1 duration-500">{value}</p>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-primary-50 transition-colors duration-500"></div>
    </div>
);

const AdminDashboard = () => {
    return (
        <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-[800] text-slate-900 tracking-tight">Executive Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        System status: Operational • <span className="text-primary-600">MediCare Royal Hospital</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                        <input type="text" placeholder="Search records..." className="bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-6 w-64 focus:ring-4 focus:ring-primary-100 outline-none shadow-sm transition-all" />
                    </div>
                    <button className="bg-primary-600 text-white p-4 rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95">
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Total Patients" value="12,842" icon={Users} trend={12.5} colorClass="bg-primary-500" />
                <StatCard title="Available Doctors" value="148" icon={Stethoscope} trend={4.2} colorClass="bg-blue-500" />
                <StatCard title="Active Sessions" value="2,456" icon={CalendarCheck} trend={-2.4} colorClass="bg-indigo-500" />
                <StatCard title="Gross Revenue" value="$422.3M" icon={TrendingUp} trend={8.1} colorClass="bg-emerald-500" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Charts Section */}
                <div className="xl:col-span-2 luxury-card p-10 bg-white">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Patient Demographics</h3>
                            <p className="text-slate-400 font-medium text-sm mt-1">Weekly registration overview</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-primary-600 transition-colors"><Filter size={20} /></button>
                            <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-primary-600 transition-colors"><MoreVertical size={20} /></button>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3d55ef" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#3d55ef" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                                    cursor={{ stroke: '#3d55ef', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="appointments" stroke="#3d55ef" strokeWidth={5} fillOpacity={1} fill="url(#colorApp)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* List Card */}
                <div className="luxury-card p-10 flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Recent Activities</h3>
                    <div className="space-y-8 flex-1">
                        {[
                            { name: 'Dr. Sarah Wilson', type: 'Surgery Scheduled', time: '2m ago', color: 'bg-primary-500' },
                            { name: 'Cardiac Dept', type: 'Emergency Alert', time: '5m ago', color: 'bg-rose-500' },
                            { name: 'New Patient', type: 'Registration Complete', time: '12m ago', color: 'bg-emerald-500' },
                            { name: 'Receptionist', type: 'Billing Processed', time: '15m ago', color: 'bg-amber-500' },
                            { name: 'Dr. Michael Chen', type: 'Report Uploaded', time: '22m ago', color: 'bg-indigo-500' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform duration-300">
                                <div className={`w-3 h-3 rounded-full mt-2 ${activity.color} shadow-lg shadow-current/20`}></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-[15px]">{activity.name}</h4>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">{activity.type}</p>
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase mt-1">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-8 py-4 bg-slate-50 rounded-2xl text-primary-600 font-bold text-sm hover:bg-primary-50 transition-colors">View All Logs</button>
                </div>
            </div>

            {/* Modern Analytics Table */}
            <div className="luxury-card overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Medical Staffing</h3>
                    <div className="flex gap-4">
                        <button className="text-[13px] font-bold text-primary-600 px-4 py-2 hover:bg-primary-50 rounded-xl transition-all">Export Report</button>
                        <button className="text-[13px] font-bold text-slate-400 px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">Manage All</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50 text-left text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                                <th className="px-10 py-6">Medical Professional</th>
                                <th className="px-10 py-6">Department</th>
                                <th className="px-10 py-6">Experience</th>
                                <th className="px-10 py-6">Performance</th>
                                <th className="px-10 py-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[
                                { name: 'Dr. Sarah Wilson', special: 'Cardiology', exp: '12 Years', status: 'On Duty', img: 'SW', perf: 98 },
                                { name: 'Dr. Michael Chen', special: 'Neurology', exp: '8 Years', status: 'Off Duty', img: 'MC', perf: 92 },
                                { name: 'Dr. Emily Brown', special: 'Pediatrics', exp: '5 Years', status: 'On Duty', img: 'EB', perf: 95 },
                                { name: 'Dr. Robert Fox', special: 'Orthopedics', exp: '15 Years', status: 'In Surgery', img: 'RF', perf: 99 },
                            ].map((doc, i) => (
                                <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-10 py-6 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-black transition-transform group-hover:scale-110 duration-500">
                                            {doc.img}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 text-[15px]">{doc.name}</h4>
                                            <p className="text-slate-400 text-xs font-bold font-jakarta leading-none mt-1">Staff ID: #MD-{2000 + i}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-slate-500 font-bold">{doc.special}</td>
                                    <td className="px-10 py-6 text-slate-500 font-bold">{doc.exp}</td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3 w-32">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${doc.perf}%` }}></div>
                                            </div>
                                            <span className="text-xs font-black text-slate-400">{doc.perf}%</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider ${doc.status === 'On Duty' ? 'bg-emerald-50 text-emerald-600' :
                                                doc.status === 'In Surgery' ? 'bg-primary-50 text-primary-600' : 'bg-rose-50 text-rose-600'
                                            }`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
