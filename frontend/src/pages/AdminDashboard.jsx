import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
    Users,
    Stethoscope,
    CalendarCheck,
    TrendingUp,
    Activity,
    ShieldCheck,
    Bell,
    Search,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import UserManagementTable from '../components/UserManagementTable';

const data = [
    { name: 'Mon', appointments: 400, revenue: 2400 },
    { name: 'Tue', appointments: 300, revenue: 1398 },
    { name: 'Wed', appointments: 200, revenue: 9800 },
    { name: 'Thu', appointments: 278, revenue: 3908 },
    { name: 'Fri', appointments: 489, revenue: 4800 },
    { name: 'Sat', appointments: 239, revenue: 3800 },
    { name: 'Sun', appointments: 150, revenue: 2200 },
];

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className={`p - 3 rounded - lg ${colorClass} bg - opacity - 10 text - gray - 700`}>
                <Icon size={24} className="text-blue-600" />
            </div>
            {trend && (
                <span className={`text - xs font - bold px - 2 py - 1 rounded - full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} `}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
);

const AdminDashboard = () => {
    const { user } = useUser();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    return (
        <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {greeting}, {user?.firstName}
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-blue-600" />
                            Administrator Dashboard
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search dashboard..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64 text-sm"
                            />
                        </div>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Patients"
                        value="12,842"
                        icon={Users}
                        trend={12.5}
                        colorClass="bg-blue-100"
                    />
                    <StatCard
                        title="Doctors Active"
                        value="148"
                        icon={Stethoscope}
                        trend={4.2}
                        colorClass="bg-green-100"
                    />
                    <StatCard
                        title="Appointments"
                        value="2,456"
                        icon={CalendarCheck}
                        trend={-2.4}
                        colorClass="bg-purple-100"
                    />
                    <StatCard
                        title="Revenue"
                        value="$422.3K"
                        icon={TrendingUp}
                        trend={8.1}
                        colorClass="bg-yellow-100"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Activity Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Activity size={20} className="text-blue-600" />
                                Hospital Performance
                            </h2>
                            <select className="border border-gray-300 rounded-lg text-sm px-3 py-1 outline-none text-gray-600">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity Log */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Clock size={20} className="text-blue-600" />
                            Recent Activity
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: 'New Registration', desc: 'Patient #4092 registered', time: '5 mins ago', type: 'success' },
                                { title: 'Emergency Alert', desc: 'Cardiac team requested in Ward A', time: '15 mins ago', type: 'danger' },
                                { title: 'System Update', desc: 'Server maintenance scheduled', time: '2 hours ago', type: 'info' },
                                { title: 'Billing Generated', desc: 'Invoice #INV-2024-001 created', time: '3 hours ago', type: 'warning' },
                                { title: 'New Staff', desc: 'Dr. Sarah Wilson added', time: '5 hours ago', type: 'success' },
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className={`mt - 1 w - 2 h - 2 rounded - full flex - shrink - 0 ${item.type === 'success' ? 'bg-green-500' :
                                        item.type === 'danger' ? 'bg-red-500' :
                                            item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                        } `}></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-sm text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                            View All Logs
                        </button>
                    </div>
                </div>

                {/* User Role Management Section */}
                <div className="mt-8">
                    <UserManagementTable />
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
