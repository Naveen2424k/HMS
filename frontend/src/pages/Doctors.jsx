import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Search, Stethoscope, Clock, DollarSign, Star, Calendar, ArrowUpRight, Filter, MapPin, Zap, ShieldCheck, Globe, Activity, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

const Doctors = () => {
    const { user } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [specialization, setSpecialization] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors();
    }, [specialization]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const query = specialization ? `?specialization=${specialization}` : '';
            const res = await api.get(`/doctors${query}`);
            setDoctors(res.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDoctors();
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative min-h-screen bg-white">
            {/* Neural Background Engine for Index Pages */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-600/5 rounded-full blur-[150px] animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px] animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.05]"></div>
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 px-6 pb-40 pt-10">
                {/* Elite Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 px-6">
                    <div className="space-y-10">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-950 text-white rounded-[1.5rem] shadow-2xl group cursor-pointer hover:rotate-12 hover:scale-110 transition-all duration-500">
                                <Stethoscope size={28} />
                            </div>
                            <div className="inline-flex items-center gap-4 px-6 py-2 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm">
                                <ShieldCheck className="text-emerald-500" size={16} />
                                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em]">Verified Institutional Registry</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-7xl lg:text-9xl font-[1000] text-slate-950 tracking-tighter leading-none uppercase italic">
                                Institutional <br /> <span className="text-primary-600 drop-shadow-sm">Specialists.</span>
                            </h1>
                            <p className="text-2xl text-slate-500 font-bold max-w-2xl leading-relaxed italic border-l-4 border-slate-100 pl-8">
                                Connect with board-certified medical professionals utilizing the global Medicare excellence protocol.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 bg-white/80 backdrop-blur-3xl p-6 rounded-[4rem] shadow-luxury-lg border border-white">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                            <div className="relative group/field">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-primary-600 transition-colors" size={22} />
                                <input
                                    type="text"
                                    placeholder="Query Registry Node..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-slate-50 border-2 border-transparent rounded-[2rem] py-5 pl-16 pr-10 w-full lg:w-96 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-100 transition-all outline-none font-[1000] text-[13px] uppercase tracking-wide placeholder:text-slate-300 italic"
                                />
                            </div>
                            <div className="relative group/field">
                                <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={22} />
                                <select
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    className="bg-slate-50 border-2 border-transparent rounded-[2rem] py-5 pl-16 pr-14 w-full lg:w-72 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-100 transition-all outline-none font-[1000] text-[13px] uppercase tracking-wide appearance-none cursor-pointer italic"
                                >
                                    <option value="">Global Hierarchy</option>
                                    {['General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician'].map(spec => (
                                        <option key={spec} value={spec}>{spec.toUpperCase()}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Specialist Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-60 gap-10">
                        <div className="relative">
                            <div className="w-24 h-24 border-[6px] border-primary-500/10 border-t-primary-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Globe className="text-primary-600 animate-pulse" size={32} />
                            </div>
                        </div>
                        <p className="text-[11px] font-[1000] uppercase text-slate-400 tracking-[0.6em] animate-pulse italic text-center">Synchronizing Biogenic Staff Manifest...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor) => (
                                <div key={doctor._id} className="luxury-card p-12 bg-white/80 backdrop-blur-md border-2 border-white/50 shadow-luxury-md hover:shadow-luxury-2xl hover:translate-y-[-16px] transition-all duration-1000 group relative overflow-hidden rounded-[4rem]">
                                    {/* Background visual flourish */}
                                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 group-hover:scale-150 transition-all duration-1000">
                                        <Stethoscope size={250} strokeWidth={1} />
                                    </div>

                                    <div className="flex items-start justify-between mb-14 relative z-10">
                                        <div className="flex gap-8">
                                            <div className="w-24 h-24 bg-slate-950 text-white rounded-[2.2rem] flex items-center justify-center font-[1000] text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl relative overflow-hidden border-[6px] border-white ring-2 ring-slate-50">
                                                <div className="absolute inset-0 bg-primary-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 opacity-20"></div>
                                                {doctor.user?.name?.charAt(0) || 'D'}
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-[1000] text-slate-950 group-hover:text-primary-600 transition-colors uppercase tracking-tighter leading-none italic">{doctor.user?.name}</h3>
                                                <div className="flex items-center gap-3 mt-4">
                                                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shadow-glow-primary"></div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{doctor.specialization}</p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-5 text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={16} fill="currentColor" />
                                                    ))}
                                                    <span className="text-[10px] font-black text-slate-400 ml-3 uppercase tracking-widest italic opacity-50 group-hover:opacity-100 transition-opacity">Protocol Rank 1.0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-14 relative z-10">
                                        <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-white hover:bg-white transition-all duration-500 group/item">
                                            <div className="flex items-center gap-4 text-slate-400 mb-3">
                                                <Clock size={16} className="group-hover/item:text-primary-500 transition-colors" />
                                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Tenure</span>
                                            </div>
                                            <p className="text-xl font-[1000] text-slate-950 italic tracking-tighter">{doctor.experience}Y <span className="text-[10px] font-black text-slate-400 uppercase italic pl-1">Clinical</span></p>
                                        </div>
                                        <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-white hover:bg-white transition-all duration-500 group/item">
                                            <div className="flex items-center gap-4 text-slate-400 mb-3">
                                                <DollarSign size={16} className="group-hover/item:text-primary-500 transition-colors" />
                                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Session</span>
                                            </div>
                                            <p className="text-xl font-[1000] text-slate-950 italic tracking-tighter">${doctor.fees} <span className="text-[10px] font-black text-slate-400 uppercase italic pl-1">USD</span></p>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-slate-100 relative z-10">
                                        {(user?.role !== 'Receptionist') ? (
                                            <button
                                                onClick={() => navigate(`/?action=book&doctorId=${doctor._id}`)}
                                                className="w-full py-7 bg-slate-950 text-white rounded-[2.8rem] font-[1000] text-[11px] uppercase tracking-[0.5em] hover:bg-primary-600 shadow-2xl shadow-slate-900/10 hover:shadow-primary-600/20 transition-all duration-700 flex items-center justify-center gap-6 active:scale-95 group/btn italic relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                                                <Calendar size={22} className="group-hover/btn:scale-125 transition-transform" />
                                                <span>Initialize Session Link</span>
                                            </button>
                                        ) : (
                                            <div className="w-full py-7 bg-slate-100 text-slate-400 rounded-[2.8rem] font-[1000] text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-6 italic border-2 border-dashed border-slate-200">
                                                <ShieldCheck size={22} className="opacity-50" />
                                                <span>Restricted Node</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute left-0 bottom-0 w-0 h-2 bg-primary-600 group-hover:w-full transition-all duration-1000"></div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-56 bg-white/50 backdrop-blur-md rounded-[5rem] border-4 border-dashed border-slate-100 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-32 h-32 bg-white rounded-[3rem] shadow-luxury-md flex items-center justify-center mx-auto mb-12 text-slate-200 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 border-2 border-white">
                                        <Stethoscope size={64} />
                                    </div>
                                    <h3 className="text-4xl font-[1000] text-slate-950 uppercase italic tracking-tighter">Identity Gap Detected</h3>
                                    <p className="text-slate-400 font-bold mt-6 uppercase text-sm tracking-[0.4em] italic mb-12">No matching specialists found in the global Medicare registry.</p>
                                    <button onClick={() => setSpecialization('')} className="px-16 py-7 bg-slate-950 text-white shadow-luxury-lg rounded-[2.5rem] text-[11px] font-[1000] uppercase tracking-[0.5em] hover:bg-primary-600 transition-all duration-700 italic flex items-center gap-6 mx-auto group/btn">
                                        <Zap size={20} className="group-hover/btn:animate-pulse" />
                                        Clear Scan Protocol
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Visual Progress Bar (at very top) */}
            <div className="fixed top-0 left-0 h-1 bg-primary-600 z-[200] transition-all duration-1000" style={{ width: loading ? '30%' : '100%', opacity: loading ? 1 : 0 }}></div>
        </div>
    );
};

export default Doctors;
