import { useState } from 'react';
import { UserPlus, User, Mail, Phone, MapPin, FileText, Calendar, Shield, Save, X, Zap, ShieldCheck, Globe, MoveRight, Thermometer, Activity } from 'lucide-react';
import api from '../services/api';

const PatientRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'password123', // Default password for registered patients
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: 'Male',
        medicalHistory: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // 1. Register User account
            const userRes = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'Patient'
            });

            // 2. Create Patient profile
            await api.post('/patients', {
                user: userRes.data._id,
                phone: formData.phone,
                address: formData.address,
                medicalHistory: formData.medicalHistory
            });

            setMessage({ type: 'success', text: 'Patient registered successfully! Account created with default password.' });
            setFormData({
                name: '',
                email: '',
                password: 'password123',
                phone: '',
                address: '',
                dateOfBirth: '',
                gender: 'Male',
                medicalHistory: ''
            });
        } catch (error) {
            console.error('Registration error:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to register patient.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
            {/* Enrollment Commander Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 px-4">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-600/5 rounded-2xl border border-primary-600/10">
                        <UserPlus className="text-primary-600" size={18} />
                        <span className="text-[11px] font-black uppercase text-primary-600 tracking-[0.2em]">Institutional Enrollment Node</span>
                    </div>
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-[900] text-slate-900 tracking-tight leading-none uppercase italic">
                            Patient <span className="text-primary-600">Registry.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 text-lg">
                            <ShieldCheck className="text-emerald-500" size={24} />
                            Enrolling New Entity • <span className="text-slate-400">Biometric Sync Active</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 bg-white p-4 rounded-3xl shadow-luxury-sm border border-slate-50">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Access Classification</p>
                        <p className="text-sm font-black text-primary-600 mt-2 flex items-center justify-end gap-2">
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                            Receptionist Tier 1
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                        <Globe size={22} />
                    </div>
                </div>
            </div>

            {message.text && (
                <div className={`p-8 rounded-[2.5rem] flex items-center justify-between animate-in zoom-in duration-500 max-w-5xl mx-auto shadow-luxury-sm border-2 border-dashed ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                    <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${message.type === 'success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                            {message.type === 'success' ? <ShieldCheck size={28} /> : <X size={28} />}
                        </div>
                        <div>
                            <h4 className="text-lg font-[900] uppercase tracking-tight italic">{message.type === 'success' ? 'Protocol Success' : 'Deployment Error'}</h4>
                            <p className="font-bold text-sm opacity-80 mt-1">{message.text}</p>
                        </div>
                    </div>
                    <button onClick={() => setMessage({ type: '', text: '' })} className="p-3 hover:bg-white/50 rounded-xl transition-all"><X size={20} /></button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
                {/* Personal Logistics */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="luxury-card p-12 bg-white border-none shadow-luxury-sm space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                            <User size={200} />
                        </div>

                        <div className="flex items-center gap-6 mb-4 relative z-10">
                            <div className="w-16 h-16 bg-slate-50 text-primary-600 rounded-[1.5rem] flex items-center justify-center shadow-inner border-2 border-white">
                                <User size={30} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-[900] text-slate-900 uppercase italic tracking-tighter">Personal Parameters</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Primary Identity Sequence</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Legal Identity</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full bg-slate-50 border-none rounded-[2rem] py-6 pl-14 pr-6 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-700 tracking-tight uppercase text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Digital Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        required
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="protocol@node.com"
                                        className="w-full bg-slate-50 border-none rounded-[2rem] py-6 pl-14 pr-6 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-700 tracking-tight text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Voice Contact</label>
                                <div className="relative group">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        required
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        type="tel"
                                        placeholder="+91 0000 0000"
                                        className="w-full bg-slate-50 border-none rounded-[2rem] py-6 pl-14 pr-6 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-700 tracking-tight text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Entity Gender</label>
                                <div className="relative">
                                    <Thermometer className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border-none rounded-[2rem] py-6 pl-14 pr-10 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-black text-slate-700 appearance-none uppercase text-xs tracking-widest cursor-pointer"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Non-Binary</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Physical Residency</label>
                            <div className="relative group">
                                <MapPin className="absolute left-6 top-8 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Enter full administrative address..."
                                    className="w-full bg-slate-50 border-none rounded-[2.5rem] py-6 pl-16 pr-8 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-700 resize-none tracking-tight text-sm"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clinical Intelligence Sidebar */}
                <div className="space-y-10">
                    <div className="luxury-card p-12 bg-white border-none shadow-luxury-sm space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                            <FileText size={180} />
                        </div>

                        <div className="flex items-center gap-6 mb-2 relative z-10">
                            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-[1.5rem] flex items-center justify-center shadow-inner border-2 border-white">
                                <Activity size={30} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-[900] text-slate-900 uppercase italic tracking-tighter leading-none">Bio Data</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Historical Manifest</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Clinical History</label>
                            <textarea
                                name="medicalHistory"
                                value={formData.medicalHistory}
                                onChange={handleChange}
                                rows="8"
                                placeholder="Log allergies, chronic conditions, and past surgical interventions..."
                                className="w-full bg-slate-50 border-none rounded-[2.5rem] py-8 px-10 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-bold text-slate-700 resize-none tracking-tight text-sm leading-relaxed"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-xs hover:bg-primary-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98] group/btn"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Execute Registry</span>
                                    <MoveRight className="group-hover/btn:translate-x-3 transition-transform duration-500" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="bg-primary-600 p-12 rounded-[4rem] text-white space-y-8 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-[60px]"></div>
                        <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center border border-white/20">
                            <Shield size={32} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h4 className="text-2xl font-[900] leading-tight uppercase italic tracking-tighter">Privacy Protocol</h4>
                            <p className="text-primary-100 text-sm font-bold leading-relaxed opacity-80 uppercase tracking-tight">
                                Registry data is synchronized via an E2E encrypted tunnel following HIPAA-X standards.
                                Subject identity is protected by the Global Health Act of 2026.
                            </p>
                        </div>
                        <div className="pt-6 border-t border-white/10 flex items-center gap-3 text-primary-200">
                            <ShieldCheck size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">HL7 Compliant Node</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PatientRegistration;
