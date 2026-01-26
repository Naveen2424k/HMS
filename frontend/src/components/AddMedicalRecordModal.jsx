import { useState, useEffect } from 'react';
import { X, User, FileText, CheckCircle, Search, Clipboard } from 'lucide-react';
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
            // In a real app, we might search via API. Here we'll fetch recent appointments or all patients
            // For now, let's assume we can fetch all patients (admin/doctor privilege)
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
            // Reset
            setFormData({ diagnosis: '', prescription: '' });
            setSelectedPatient(null);
            alert('Medical record created successfully!');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Create Medical Record</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Official Clinical Report</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {/* Patient Selection Step */}
                    {!selectedPatient ? (
                        <div className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search patient by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-primary-100 transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Patient</p>
                                {filteredPatients.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {filteredPatients.map((patient) => (
                                            <button
                                                key={patient._id}
                                                onClick={() => setSelectedPatient(patient)}
                                                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all group text-left"
                                            >
                                                <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center font-black group-hover:bg-primary-200 group-hover:text-primary-700 transition-colors">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 group-hover:text-primary-700">{patient.user?.name}</h4>
                                                    <p className="text-xs font-semibold text-slate-400">{patient.user?.email}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-center py-8">No patients found.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                            <div className="flex items-center justify-between bg-primary-50 p-4 rounded-2xl border border-primary-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-primary-400 uppercase tracking-widest">Patient</p>
                                        <h4 className="font-bold text-primary-900">{selectedPatient.user?.name}</h4>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPatient(null)}
                                    className="text-xs font-bold text-primary-600 hover:underline"
                                >
                                    Change
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Diagnosis</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Acute Bacterial Sinusitis"
                                        value={formData.diagnosis}
                                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-primary-100 transition-all"
                                    />
                                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Prescription & Notes</label>
                                <div className="relative">
                                    <textarea
                                        required
                                        rows="6"
                                        placeholder="Enter detailed prescription instructions..."
                                        value={formData.prescription}
                                        onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-slate-200 hover:bg-emerald-600 hover:shadow-emerald-200 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? 'Saving...' : 'Issue Medical Record'}
                                {!loading && <CheckCircle size={20} />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddMedicalRecordModal;
