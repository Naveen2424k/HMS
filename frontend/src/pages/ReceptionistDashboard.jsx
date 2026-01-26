import {
    Users,
    FileText,
    CreditCard,
    PlusCircle,
    Search,
    Filter,
    MoreHorizontal,
    ArrowRight,
    TrendingUp,
    UserPlus,
    Target
} from 'lucide-react';

const ReceptionistDashboard = () => {
    return (
        <div className="max-w-[1600px] mx-auto space-y-10 animate-in slide-in-from-right duration-1000">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-[800] text-slate-900 tracking-tight">Reception Analytics</h1>
                    <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Service Window Open • Main Desk 01
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="bg-white text-slate-600 px-6 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest border border-slate-100 hover:bg-slate-50 transition-all flex items-center gap-3">
                        <Filter size={18} />
                        Queues
                    </button>
                    <button className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 hover:scale-[1.02] transition-all flex items-center gap-3 active:scale-[0.98]">
                        <UserPlus size={20} />
                        New Registry
                    </button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'System Patients', val: '2,840', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Daily Boarding', val: '12', icon: Target, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Unsettled Bills', val: '08', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Certificates Gen', val: '45', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="luxury-card p-10 flex items-center gap-8 group">
                        <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-sm shadow-current/5`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight group-hover:translate-x-1 transition-transform">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Table Area */}
                <div className="lg:col-span-2 luxury-card overflow-hidden bg-white">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Patient Intake</h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">Real-time registration queue</p>
                        </div>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Locate patient..."
                                className="pl-12 pr-6 py-3.5 bg-slate-50 rounded-2xl border-none outline-none text-sm font-bold w-64 focus:ring-4 focus:ring-primary-50 transition-all font-jakarta"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 text-left text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
                                    <th className="px-10 py-6">Patient Identity</th>
                                    <th className="px-10 py-6">Registered On</th>
                                    <th className="px-10 py-6">Department</th>
                                    <th className="px-10 py-6">Insurance Status</th>
                                    <th className="px-10 py-6">Registry Unit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { name: 'Arlene McCoy', id: '#P-4928', phone: '+1 234 567 890', dept: 'Cardiology', status: 'Verified', time: '10:42 AM' },
                                    { name: 'Theresa Webb', id: '#P-3021', phone: '+1 987 654 321', dept: 'Neurology', status: 'Pending', time: '11:15 AM' },
                                    { name: 'Cody Fisher', id: '#P-8482', phone: '+1 456 789 012', dept: 'Pediatrics', status: 'Verified', time: '11:50 AM' },
                                    { name: 'Jane Cooper', id: '#P-2917', phone: '+1 112 334 556', dept: 'ER Reception', status: 'Verified', time: '12:05 PM' },
                                ].map((p, i) => (
                                    <tr key={i} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                                        <td className="px-10 py-6 flex items-center gap-5">
                                            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center font-black transition-transform group-hover:scale-110 duration-500">
                                                {p.name[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-800 text-[15px] group-hover:text-primary-600 transition-colors">{p.name}</h4>
                                                <p className="text-slate-400 text-xs font-bold leading-none mt-1 uppercase tracking-tighter">{p.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-slate-800 font-extrabold text-[13px]">Today</span>
                                                <span className="text-slate-400 text-[11px] font-black uppercase mt-0.5 tracking-tighter">{p.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-slate-500 font-bold text-[14px]">{p.dept}</td>
                                        <td className="px-10 py-6">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${p.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100' : 'bg-amber-50 text-amber-600 shadow-sm shadow-amber-100'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <button className="p-3 text-slate-400 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all">
                                                <ArrowRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-8 bg-slate-50/50 text-center">
                        <button className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary-600 transition-all">View All Registrations</button>
                    </div>
                </div>

                {/* Right Analytics Pane */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200 group">
                        <div className="relative z-10">
                            <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mb-4">Total Settled Revenue</h3>
                            <div className="flex items-center gap-3">
                                <p className="text-4xl font-black tracking-tight">$243,500.00</p>
                                <div className="p-1 px-2 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-1 text-[10px] font-black">
                                    <TrendingUp size={12} />
                                    +12%
                                </div>
                            </div>
                            <div className="mt-12 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">Surgical Units</p>
                                        <p className="text-2xl font-black mt-1">$142.2k</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary-400 group-hover:bg-white/10 transition-colors">
                                        <Target size={22} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">Consultation Fees</p>
                                        <p className="text-2xl font-black mt-1">$101.3k</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary-400 group-hover:bg-white/10 transition-colors">
                                        <CreditCard size={22} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
                    </div>

                    <div className="luxury-card p-10 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 text-xl tracking-tight">Queue Saturation</h3>
                            <button className="p-2 text-slate-300 hover:text-slate-600"><MoreHorizontal size={22} /></button>
                        </div>
                        <div className="space-y-8">
                            {[
                                { time: 'Emergency Units', val: 75, color: 'bg-primary-600', trend: '+4' },
                                { time: 'Routine Checkups', val: 92, color: 'bg-indigo-600', trend: '-2' },
                                { time: 'Specialist Tiers', val: 45, color: 'bg-blue-600', trend: '+8' },
                            ].map((t, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <span className="text-slate-800 font-extrabold text-[15px]">{t.time}</span>
                                            <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-1">Status: High Traffic</p>
                                        </div>
                                        <span className="text-[15px] font-black text-slate-900">{t.val}%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                                        <div className={`h-full ${t.color} rounded-full transition-all duration-1000 ease-out shadow-sm`} style={{ width: `${t.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-4 bg-primary-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-primary-50 hover:bg-primary-700 transition-all">Optimize Queues</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;
