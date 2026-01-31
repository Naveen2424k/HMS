import { useState, useEffect } from 'react';
import { CreditCard, Download, Search, CheckCircle, XCircle, Clock, Filter, Printer, Zap, ShieldCheck, Globe, DollarSign, ArrowUpRight } from 'lucide-react';
import api from '../services/api';

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const { data } = await api.get('/billing');
                setBills(data);
            } catch (error) {
                console.error('Error fetching bills:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBills();
    }, []);

    const filteredBills = bills.filter(bill =>
        bill.patient?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill._id.includes(searchTerm)
    );

    const handlePrint = (bill) => {
        window.print();
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
            {/* Financial Command Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 px-4">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-600/5 rounded-2xl border border-primary-600/10">
                        <CreditCard className="text-primary-600" size={18} />
                        <span className="text-[11px] font-black uppercase text-primary-600 tracking-[0.2em]">Institutional Finance Hub</span>
                    </div>
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-[900] text-slate-900 tracking-tight leading-none uppercase italic">
                            Revenue <span className="text-primary-600">Nexus.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 text-lg">
                            <ShieldCheck className="text-emerald-500" size={24} />
                            Settled Transactions Archive • <span className="text-slate-400">Fiscal Integrity</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 bg-white p-4 rounded-[2.5rem] shadow-luxury-sm border border-slate-50 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Locate Transaction ID or Entity..."
                            className="bg-slate-50/50 border-none rounded-2xl py-4 pl-14 pr-8 w-full focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-sm tracking-tight uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Financial Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
                {[
                    { label: 'Total Settled', value: '$428.5k', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Pending Manifests', value: '14 Units', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Global Compliance', value: '99.9%', icon: Globe, color: 'text-primary-600', bg: 'bg-primary-50' },
                ].map((stat, i) => (
                    <div key={i} className="luxury-card p-10 bg-white border-none shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-700 group">
                        <div className="flex justify-between items-center">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon size={26} />
                            </div>
                            <div className="bg-slate-50 px-4 py-2 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Live Feedback</div>
                        </div>
                        <div className="mt-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                            <h4 className="text-4xl font-[900] text-slate-900 tracking-tighter italic">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transaction Ledger */}
            <div className="luxury-card bg-white border-none shadow-luxury-lg overflow-hidden mx-4 rounded-[3rem]">
                <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-[900] text-slate-900 uppercase italic tracking-tighter">Transaction Ledger</h3>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Access Only</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-glow-emerald"></div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50 text-left text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-10 py-8">Invoice ID</th>
                                <th className="px-10 py-8">Subject Entity</th>
                                <th className="px-10 py-8">Synchronization Date</th>
                                <th className="px-10 py-8">Fiscal Amount</th>
                                <th className="px-10 py-8">Status Node</th>
                                <th className="px-10 py-8 text-center">Protocol Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-luxury"></div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Querying financial database...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBills.length > 0 ? (
                                filteredBills.map((bill) => (
                                    <tr key={bill._id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                                        <td className="px-10 py-8 font-[900] text-slate-300 text-xs tracking-widest group-hover:text-primary-600 transition-colors">
                                            #{bill._id.substring(0, 10).toUpperCase()}
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-xl shadow-slate-200 uppercase group-hover:scale-110 transition-transform">
                                                    {bill.patient?.user?.name?.charAt(0) || 'P'}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Entity Name</p>
                                                    <p className="font-black text-slate-800 uppercase tracking-tight italic">{bill.patient?.user?.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Timestamp</p>
                                                <span className="text-sm font-bold text-slate-600 italic">{new Date(bill.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Settlement</p>
                                                <span className="text-xl font-[900] text-slate-900 italic tracking-tighter">${bill.amount.toLocaleString()} <span className="text-xs font-black text-slate-300 uppercase">USD</span></span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 w-fit border shadow-sm ${bill.status === 'Paid'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {bill.status === 'Paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => handlePrint(bill)}
                                                    className="p-4 bg-white border-2 border-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-2xl transition-all shadow-sm group-hover:scale-110"
                                                    title="Protocol Print"
                                                >
                                                    <Printer size={20} />
                                                </button>
                                                <button className="p-4 bg-white border-2 border-slate-50 text-slate-400 hover:bg-primary-600 hover:text-white hover:border-primary-600 rounded-2xl transition-all shadow-sm group-hover:scale-110" title="Digital Export">
                                                    <Download size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-10 py-40 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-8 opacity-20">
                                            <CreditCard size={80} className="animate-float" />
                                            <div className="space-y-2">
                                                <h4 className="text-3xl font-[900] uppercase tracking-tight italic">Fiscal Zero</h4>
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">No financial documents match current identification.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 bg-slate-900 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Synchronized with Global Financial Network • Protocol ID #TN-4982-FX</p>
                </div>
            </div>
        </div>
    );
};

export default Billing;
