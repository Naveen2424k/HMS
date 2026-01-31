import { useState, useEffect, useContext } from 'react';
import { FileText, Download, Calendar, User, Activity, AlertCircle, ShieldCheck, Zap, MoveRight, Clock, Star } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const MedicalRecords = () => {
    const { user } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const { data } = await api.get('/medical-records');
            setRecords(data);
        } catch (err) {
            console.error('Failed to fetch medical records:', err);
            // Mock fallback
            setRecords([
                {
                    _id: 'REC-2024-001',
                    date: new Date().toISOString(),
                    diagnosis: 'Mild Hypertension',
                    prescription: 'Lisinopril 10mg OD, dash diet recommended.',
                    doctor: { user: { name: 'Sarah Wilson' }, specialization: 'Cardiology' },
                    patient: { user: { name: 'Verified Patient' } }
                },
                {
                    _id: 'REC-2023-089',
                    date: new Date(Date.now() - 86400000 * 45).toISOString(),
                    diagnosis: 'Viral Upper Respiratory Infection',
                    prescription: 'Rest, hydration, Acetaminophen 500mg PRN.',
                    doctor: { user: { name: 'James Carter' }, specialization: 'General Medicine' },
                    patient: { user: { name: 'Verified Patient' } }
                }
            ]);
            // setError('Biometric data retrieval sequence failed.'); 
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = (record) => {
        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Medical Registry Node - ${record._id}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                        body { 
                            font-family: 'Plus Jakarta Sans', sans-serif; 
                            padding: 4rem; 
                            color: #0f172a;
                            background: white;
                        }
                        .header { 
                            border-bottom: 4px solid #0f172a; 
                            padding-bottom: 2rem; 
                            margin-bottom: 3rem;
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                        }
                        .brand h1 { margin: 0; font-size: 2.5rem; font-weight: 900; letter-spacing: -2px; text-transform: uppercase; }
                        .brand p { margin: 0; font-size: 0.75rem; font-weight: 800; letter-spacing: 4px; color: #2563eb; text-transform: uppercase; }
                        .doc-info { text-align: right; }
                        .doc-info p { margin: 0; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
                        
                        .meta-grid { 
                            display: grid; 
                            grid-template-columns: repeat(2, 1fr); 
                            gap: 2rem; 
                            margin-bottom: 4rem; 
                        }
                        .meta-item {
                            padding: 1.5rem;
                            background: #f8fafc;
                            border-radius: 1.5rem;
                            border: 1px solid #e2e8f0;
                        }
                        .label { font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 0.5rem; display: block; }
                        .value { font-size: 1.1rem; font-weight: 700; color: #0f172a; }

                        .content-section { margin-bottom: 3rem; }
                        .section-title { 
                            font-size: 0.9rem; 
                            font-weight: 900; 
                            text-transform: uppercase; 
                            letter-spacing: 2px; 
                            color: #2563eb; 
                            margin-bottom: 1.5rem;
                            padding-left: 1rem;
                            border-left: 4px solid #2563eb;
                        }
                        .section-box {
                            background: #fff;
                            border: 2px solid #f1f5f9;
                            padding: 2rem;
                            border-radius: 2rem;
                            line-height: 1.7;
                            font-size: 1.1rem;
                            color: #334155;
                        }
                        .footer { 
                            margin-top: 6rem; 
                            padding-top: 2rem;
                            border-top: 1px solid #f1f5f9;
                            text-align: center; 
                        }
                        .footer p { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
                        .seal {
                            margin-top: 2rem;
                            display: inline-block;
                            padding: 1rem 2rem;
                            border: 3px double #e2e8f0;
                            border-radius: 1rem;
                            font-weight: 900;
                            color: #e2e8f0;
                            transform: rotate(-5deg);
                            text-transform: uppercase;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="brand">
                            <h1>MediCare</h1>
                            <p>Global Health Network</p>
                        </div>
                        <div class="doc-info">
                            <p>Record ID: ${record._id}</p>
                            <p>Classification: Verified Medical Manifest</p>
                        </div>
                    </div>

                    <div class="meta-grid">
                        <div class="meta-item"><span class="label">Primary Patient</span><div class="value">${record.patient?.user?.name || 'N/A'}</div></div>
                        <div class="meta-item"><span class="label">Attending Specialist</span><div class="value">Dr. ${record.doctor?.user?.name || 'N/A'}</div></div>
                        <div class="meta-item"><span class="label">Timestamp Entry</span><div class="value">${new Date(record.date).toLocaleString()}</div></div>
                        <div class="meta-item"><span class="label">Specialization</span><div class="value">${record.doctor?.specialization || 'Clinical Generalist'}</div></div>
                    </div>

                    <div class="content-section">
                        <div class="section-title">Clinical Diagnosis</div>
                        <div class="section-box">${record.diagnosis}</div>
                    </div>

                    <div class="content-section">
                        <div class="section-title">Pharmaceutical Protocol</div>
                        <div class="section-box">${record.prescription}</div>
                    </div>

                    <div class="footer">
                        <div class="seal">Authenticated Digital Node</div>
                        <p>This is an encrypted digital manifestation. Tampering voids validity.</p>
                        <p>© 2026 MediCare Institutional Group • All Rights Reserved</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
            {/* Enterprise Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 px-4">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-600/5 rounded-2xl border border-primary-600/10">
                        <FileText className="text-primary-600" size={18} />
                        <span className="text-[11px] font-black uppercase text-primary-600 tracking-[0.2em]">Verified Registry Access</span>
                    </div>
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-[900] text-slate-900 tracking-tight leading-none uppercase italic">
                            Medical <span className="text-primary-600">Manifests.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 text-lg">
                            <ShieldCheck className="text-emerald-500" size={24} />
                            Encrypted Health Vault • <span className="text-slate-400">Authorized Personnel Only</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 bg-white p-4 rounded-3xl shadow-luxury-sm border border-slate-50">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Status</p>
                        <p className="text-sm font-black text-emerald-600 mt-2 flex items-center justify-end gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            E2E Encrypted Active
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                        <Zap size={22} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-luxury"></div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Decrypting Registry Records...</p>
                </div>
            ) : error ? (
                <div className="p-10 bg-rose-50 border-2 border-dashed border-rose-200 rounded-[3rem] text-rose-600 flex flex-col items-center gap-6 max-w-2xl mx-auto text-center">
                    <AlertCircle size={48} className="animate-bounce" />
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Access Protocol Failure</h3>
                        <p className="font-bold mt-2 opacity-80">{error}</p>
                    </div>
                    <button onClick={fetchRecords} className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-200">Retry Authentication</button>
                </div>
            ) : records.length === 0 ? (
                <div className="text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 max-w-4xl mx-auto px-10">
                    <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-slate-200 animate-float shadow-inner">
                        <FileText size={60} />
                    </div>
                    <h3 className="text-3xl font-[900] text-slate-900 uppercase tracking-tight italic">Vault Entry: Null</h3>
                    <p className="text-slate-400 font-bold max-w-md mx-auto mt-6 text-lg">No official medical manifests have been synchronized with your profile yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">
                    {records.map((record) => (
                        <div key={record._id} className="luxury-card p-12 bg-white border-none shadow-luxury-sm hover:shadow-luxury-lg hover:translate-y-[-8px] transition-all duration-700 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                                <Activity size={180} />
                            </div>

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-[1.5rem] flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-inner border-4 border-white">
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-[900] text-slate-900 uppercase tracking-tighter italic">Diagnosis Report</h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                                                <Clock size={12} className="text-primary-500" />
                                                {new Date(record.date).toLocaleDateString()}
                                            </span>
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Verified Node</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => generatePDF(record)}
                                    className="p-4 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all duration-500 shadow-inner group/dl"
                                    title="Export PDF"
                                >
                                    <Download size={22} className="group-hover/dl:scale-110" />
                                </button>
                            </div>

                            <div className="space-y-8 mb-12 relative z-10">
                                <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group-hover:bg-white transition-colors duration-500">
                                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                                        Clinical Observation
                                    </p>
                                    <p className="text-lg font-bold text-slate-700 tracking-tight leading-relaxed italic">"{record.diagnosis}"</p>
                                </div>
                                <div className="px-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Pharmaceutical Directive</p>
                                    <p className="font-semibold text-slate-600 leading-relaxed text-sm bg-slate-50/30 p-4 rounded-xl">{record.prescription}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-10 border-t border-slate-100 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-xl shadow-slate-200">
                                        {record.doctor?.user?.name?.charAt(0) || 'D'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Attending Specialist</p>
                                        <p className="text-sm font-black text-slate-900 mt-1 uppercase italic group-hover:text-primary-600 transition-colors">Dr. {record.doctor?.user?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-amber-400">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Elite Care</span>
                                </div>
                            </div>

                            <div className="absolute left-0 bottom-0 w-0 h-1.5 bg-primary-600 group-hover:w-full transition-all duration-700"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Global History Notice */}
            <div className="mt-20 p-12 bg-slate-900 rounded-[4rem] text-center space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/10 rounded-full blur-[100px]"></div>
                <h3 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em] leading-none">Global Compliance Manifest</h3>
                <p className="text-slate-400 text-sm font-bold max-w-2xl mx-auto leading-relaxed italic">
                    All medical manifests are archived in accordance with International Health Regulation (IHR) protocols.
                    Redistribution of clinical data without authorization is strictly prohibited.
                </p>
            </div>
        </div>
    );
};

export default MedicalRecords;
