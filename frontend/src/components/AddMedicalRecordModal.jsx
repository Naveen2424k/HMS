import { useState, useEffect } from 'react';
import { X, User, FileText, CheckCircle, Search, ShieldCheck, Stethoscope, ArrowRight } from 'lucide-react';
import api from '../services/api';

const AddMedicalRecordModal = ({ isOpen, onClose, onSuccess }) => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [formData, setFormData] = useState({
        diagnosis: '',
        prescription: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchPatients();
        }
    }, [isOpen]);

    const fetchPatients = async () => {
        try {
            const { data } = await api.get('/patients');
            setPatients(data);
        } catch (err) {
            console.error('Failed to fetch patients', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return;

        setLoading(true);
        try {
            await api.post('/medical-records', {
                patientId: selectedPatient._id,
                diagnosis: formData.diagnosis,
                prescription: formData.prescription
            });
            if (onSuccess) onSuccess();
            onClose();
            setFormData({ diagnosis: '', prescription: '' });
            setSelectedPatient(null);
            alert('Record created successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to create record');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-blue-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-blue-50 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-blue-600 px-10 py-8 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Stethoscope size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic uppercase leading-none">New Diagnosis</h2>
                            <p className="text-blue-100 text-[10px] font-bold mt-2 uppercase tracking-widest">Clinical Documentation Hub</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-10 overflow-y-auto flex-1 space-y-10 bg-blue-50/20">
                    {!selectedPatient ? (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="space-y-3">
                                <label className="text-sm font-black text-blue-900 uppercase tracking-widest ml-1">Find Patient</label>
                                <div className="relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-blue-100 rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 transition-all placeholder:text-blue-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {filteredPatients.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {filteredPatients.map((patient) => (
                                            <button
                                                key={patient._id}
                                                onClick={() => setSelectedPatient(patient)}
                                                className="flex items-center gap-5 p-6 bg-white hover:bg-blue-600 hover:text-white border-2 border-blue-50 rounded-[2rem] transition-all group shadow-sm text-left active:scale-95"
                                            >
                                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-2xl group-hover:bg-white transition-all">
                                                    {patient.user?.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-black italic uppercase text-lg group-hover:underline underline-offset-4 decoration-white">{patient.user?.name}</h4>
                                                    <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">{patient.user?.email}</p>
                                                </div>
                                                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-blue-100 text-blue-300 font-bold uppercase italic">
                                        No matches found in registry
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                            <div className="flex items-center justify-between bg-blue-600 p-8 rounded-3xl border-4 border-blue-200 shadow-xl shadow-blue-100 text-white relative overflow-hidden">
                                <Stethoscope size={100} className="absolute -right-10 -bottom-10 opacity-10" />
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/20">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Syncing Record for:</p>
                                        <h4 className="text-3xl font-black italic uppercase tracking-tighter">{selectedPatient.user?.name}</h4>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPatient(null)}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest border border-white/20 transition-all z-10"
                                >
                                    Switch
                                </button>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-blue-900 uppercase tracking-widest ml-1">Clinical Diagnosis</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter your observation..."
                                    value={formData.diagnosis}
                                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                                    className="w-full px-6 py-5 bg-white border-2 border-blue-100 rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 transition-all text-lg italic"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-blue-900 uppercase tracking-widest ml-1">Medical Protocol (Medications)</label>
                                <textarea
                                    required
                                    rows="5"
                                    placeholder="Describe medications and follow-up plan..."
                                    value={formData.prescription}
                                    onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                                    className="w-full px-6 py-5 bg-white border-2 border-blue-100 rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 transition-all text-lg italic resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-black italic uppercase tracking-widest py-6 rounded-[2rem] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-4 text-2xl active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Filing Record...' : <><CheckCircle size={28} /> Complete Report</>}
                            </button>
                        </form>
                    )}
                </div>

                <div className="p-8 bg-white border-t-2 border-blue-50 flex items-center justify-center gap-4 text-blue-400">
                    <ShieldCheck size={20} className="text-green-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure Medical Entry</span>
                </div>
            </div>
        </div>
    );
};

export default AddMedicalRecordModal;
