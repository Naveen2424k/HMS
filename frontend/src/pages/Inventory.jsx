import { useState, useEffect } from 'react';
import { Pill, Search, Filter, Plus, AlertTriangle, CheckCircle2, Package, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import api from '../services/api';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const { data } = await api.get('/inventory');
            setItems(data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockStatus = (item) => {
        if (item.quantity <= 0) return { label: 'Out of Stock', color: 'text-rose-600', bg: 'bg-rose-50' };
        if (item.quantity <= item.minStockLevel) return { label: 'Low Stock', color: 'text-amber-600', bg: 'bg-amber-50' };
        return { label: 'In Stock', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
            {/* Pharmacy Hub Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-600/5 rounded-2xl border border-primary-600/10">
                        <Pill className="text-primary-600" size={18} />
                        <span className="text-[11px] font-black uppercase text-primary-600 tracking-[0.2em]">Institutional Pharmacy Hub</span>
                    </div>
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-[1000] text-slate-900 tracking-tight leading-none uppercase italic">
                            Medicine <span className="text-primary-600">Stock.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 text-lg">
                            <TrendingUp className="text-emerald-500" size={24} />
                            Inventory Management & Bio-Scrip Index Node
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 bg-white p-4 rounded-[2.5rem] shadow-luxury-sm border border-slate-50 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Locate Bio-Scrip or Category..."
                            className="bg-slate-50/50 border-none rounded-2xl py-4 pl-14 pr-8 w-full focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-sm tracking-tight uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-600 transition-all flex items-center gap-3 whitespace-nowrap">
                        <Plus size={18} />
                        Register New Stock
                    </button>
                </div>
            </div>

            {/* Inventory Statistics Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {[
                    { label: 'Total Inventory', value: items.length, icon: Package, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Low Stock Alerts', value: items.filter(i => i.quantity <= i.minStockLevel && i.quantity > 0).length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Out of Stock', value: items.filter(i => i.quantity <= 0).length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Estimated Value', value: '$124k', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="luxury-card p-10 bg-white border-none shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-700 group">
                        <div className="flex justify-between items-center mb-6">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon size={26} />
                            </div>
                            <ArrowUpRight className="text-slate-200 group-hover:text-primary-400 transition-colors" size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                        <h4 className="text-4xl font-[900] text-slate-900 tracking-tighter italic">{stat.value}</h4>
                    </div>
                ))}
            </div>

            {/* Stock Registry Ledger */}
            <div className="luxury-card bg-white border-none shadow-luxury-lg overflow-hidden rounded-[3rem]">
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="text-xl font-[1000] text-slate-900 uppercase italic tracking-tighter flex items-center gap-4">
                        Stock Registry Ledger
                        <span className="text-[9px] font-black bg-emerald-500 text-white px-3 py-1 rounded-full not-italic tracking-widest">LIVE</span>
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50 text-left text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-10 py-8">Medical Identification</th>
                                <th className="px-10 py-8">Category Node</th>
                                <th className="px-10 py-8">Manifest Level</th>
                                <th className="px-10 py-8">Unit Price</th>
                                <th className="px-10 py-8">System Status</th>
                                <th className="px-10 py-8">Batch Node</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-32 text-center">
                                        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredItems.map((item) => {
                                const status = getStockStatus(item);
                                return (
                                    <tr key={item._id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-xl group-hover:scale-110 transition-transform">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 uppercase tracking-tight italic text-lg leading-none mb-1">{item.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manufacturer: {item.manufacturer || 'Institutional'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="px-5 py-2.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-200">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-2xl font-black text-slate-900 tracking-tighter italic">{item.quantity}</span>
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.unit}s</span>
                                                </div>
                                                <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${item.quantity <= item.minStockLevel ? 'bg-rose-500' : 'bg-emerald-500'
                                                            }`}
                                                        style={{ width: `${Math.min((item.quantity / 100) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xl font-black text-slate-900 italic tracking-tighter">${item.pricePerUnit} <span className="text-xs text-slate-300 uppercase">USD</span></span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className={`px-5 py-2.5 rounded-2xl ${status.bg} ${status.color} flex items-center gap-3 w-fit border border-current/10`}>
                                                <div className={`w-2 h-2 rounded-full animate-pulse bg-current`}></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[.2em]">{item.batchNumber}</p>
                                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mt-1">EXP: {new Date(item.expiryDate).toLocaleDateString()}</p>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
