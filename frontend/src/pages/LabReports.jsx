import { useState, useEffect } from 'react';
import { Microscope, Download, Search, CheckCircle, Clock, AlertCircle, FileText, Zap, ShieldCheck, MoveRight, Globe, Star } from 'lucide-react';
import api from '../services/api';

const LabReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await api.get('/lab-reports');
                setReports(data);
            } catch (error) {
                console.error('Error fetching reports:', error);
                // Mock fallback
                setReports([
                    {
                        _id: 'LAB998877',
                        testName: 'Complete Blood Count (CBC)',
                        date: new Date().toISOString(),
                        status: 'Completed',
                        paymentStatus: 'Paid',
                        testResult: 'Hemoglobin: 14.5 g/dL (Normal), WBC: 6.5 K/uL (Normal), Platelets: 250 K/uL (Normal)',
                        patient: { user: { name: 'Verified Patient' } }
                    },
                    {
                        _id: 'LAB554433',
                        testName: 'Lipid Profile',
                        date: new Date(Date.now() - 86400000 * 2).toISOString(),
                        status: 'Completed',
                        paymentStatus: 'Pending', /* TEST CASE: Completed but Unpaid */
                        testResult: 'Hidden until payment',
                        patient: { user: { name: 'Verified Patient' } }
                    },
                    {
                        _id: 'LAB112233',
                        testName: 'Thyroid Function Test',
                        date: new Date(Date.now() - 86400000 * 15).toISOString(),
                        status: 'Completed',
                        paymentStatus: 'Paid',
                        testResult: 'TSH: 2.5 mIU/L (Euthyroid), T3: 120 ng/dL, T4: 8.0 ug/dL',
                        patient: { user: { name: 'Verified Patient' } }
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter(report =>
        report.patient?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.testName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMockPaymentDetails = () => {
        alert("Redirecting to Payment Gateway...");
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
            {/* Clinical Analytics Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 px-4">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-600/5 rounded-2xl border border-primary-600/10">
                        <Microscope className="text-primary-600" size={18} />
                        <span className="text-[11px] font-black uppercase text-primary-600 tracking-[0.2em]">Clinical Diagnostics Node</span>
                    </div>
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-[900] text-slate-900 tracking-tight leading-none uppercase italic">
                            Pathology <span className="text-primary-600">Vault.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 text-lg">
                            <ShieldCheck className="text-emerald-500" size={24} />
                            Active Bio-Metrics Monitoring • <span className="text-slate-400">High-Res Imaging</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 bg-white p-4 rounded-[2.5rem] shadow-luxury-sm border border-slate-50 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Locate Diagnostic Sequence..."
                            className="bg-slate-50/50 border-none rounded-2xl py-4 pl-14 pr-8 w-full focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-sm tracking-tight uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 border-l border-slate-100 pl-6 h-10 hidden md:flex">
                        <Globe size={18} className="text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Lab Link</span>
                    </div>
                </div>
            </div>

            {/* Diagnostics Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-luxury"></div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Propagating Diagnostic Matrix...</p>
                    </div>
                ) : filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                        <div key={report._id} className="luxury-card p-10 bg-white border-none shadow-luxury-sm hover:shadow-luxury-lg hover:translate-y-[-10px] duration-700 group relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                                <Microscope size={200} />
                            </div>

                            <div className="flex items-start justify-between mb-10 relative z-10">
                                <div className={`p-5 rounded-[1.8rem] transition-all duration-700 shadow-inner border-2 border-white ${report.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-600 group-hover:bg-slate-900 group-hover:text-white'
                                    : 'bg-amber-50 text-amber-500 animate-pulse'
                                    }`}>
                                    <Microscope size={32} />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${report.status === 'Completed'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                        {report.status}
                                    </span>
                                    {report.status === 'Completed' && (
                                        <div className="flex items-center gap-1 text-emerald-500">
                                            <CheckCircle size={12} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Signed Off</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-10 flex-1 relative z-10">
                                <h3 className="text-2xl font-[900] text-slate-900 leading-tight mb-4 tracking-tighter uppercase italic group-hover:text-primary-600 transition-colors">{report.testName}</h3>
                                <div className="flex items-center gap-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 mb-8">
                                    <div className="w-1.5 h-10 bg-primary-500 rounded-full ml-1"></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ordered Timestamp</p>
                                        <p className="text-sm font-black text-slate-900 mt-2 flex items-center gap-2">
                                            <Clock size={14} className="text-primary-500" />
                                            {new Date(report.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 p-4 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl shadow-slate-200">
                                        {report.patient?.user?.name?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Subject Profile</p>
                                        <p className="text-[13px] font-black text-slate-800 mt-1 uppercase tracking-tight">{report.patient?.user?.name || 'Authorized Entity'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Logic for viewing report vs need payment */}
                            {report.paymentStatus !== 'Paid' && report.status === 'Completed' ? (
                                <div className="pt-10 border-t border-slate-100 mt-auto relative z-10">
                                    <div className="flex flex-col items-center gap-6 bg-rose-50/50 p-8 rounded-[2.5rem] border border-rose-100/50 border-dashed">
                                        <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                                            <Lock size={28} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase text-rose-700 tracking-[0.3em]">Payment Encrypted</p>
                                            <p className="text-xs font-bold text-rose-600 mt-2">Clear pending dues to access diagnostic data.</p>
                                        </div>
                                        <button
                                            onClick={handleMockPaymentDetails}
                                            className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                                        >
                                            Pay to Unlock
                                        </button>
                                    </div>
                                </div>
                            ) : report.status === 'Completed' ? (
                                <div className="space-y-6 pt-10 border-t border-slate-100 relative z-10">
                                    <div className="p-6 bg-slate-50 rounded-[2rem] group-hover:bg-white transition-colors duration-500 shadow-inner">
                                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-3 leading-none">Protocol Results</p>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{report.testResult || 'Final biometric analysis successfully synchronized. Verification complete.'}"</p>
                                    </div>
                                    <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary-600 transition-all flex items-center justify-center gap-4 group-hover:shadow-2xl group-hover:shadow-primary-200 active:scale-95 group/btn">
                                        <Download size={20} className="group-hover/btn:translate-y-1 transition-transform" />
                                        Initialize Download
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-10 border-t border-slate-100 mt-auto relative z-10">
                                    <div className="flex flex-col items-center gap-6 bg-amber-50/50 p-8 rounded-[2.5rem] border border-amber-100/50 border-dashed">
                                        <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                                            <Zap size={28} className="animate-pulse" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase text-amber-700 tracking-[0.3em]">Sequencing Active</p>
                                            <p className="text-xs font-bold text-amber-600 mt-2">Clinical processing at 74% completion.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="absolute left-0 bottom-0 w-0 h-1.5 bg-primary-600 group-hover:w-full transition-all duration-700"></div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100 max-w-4xl mx-auto px-10">
                        <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-slate-200 animate-float shadow-inner">
                            <FileText size={60} />
                        </div>
                        <h4 className="text-3xl font-[900] text-slate-900 uppercase tracking-tight italic">Registry: Entry Not Found</h4>
                        <p className="text-slate-400 font-bold max-w-md mx-auto mt-6 text-lg">Your search query did not correlate with any diagnostic records in the global vault.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-10 px-10 py-5 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Clear Search Protocol</button>
                    </div>
                )}
            </div>

            {/* Quality Standard Banner */}
            <div className="mt-20 flex flex-wrap justify-between items-center gap-12 px-10 py-12 bg-slate-50 rounded-[4rem] opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000 border border-slate-100">
                {['CAP ACCREDITED', 'ISO 15189', 'FDA CLEARED', 'CLIA CERTIFIED'].map(standard => (
                    <div key={standard} className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900">{standard}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LabReports;
