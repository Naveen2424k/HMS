import { useState, useEffect } from 'react';
import { X, User, FileText, CheckCircle, Search, Clipboard, ShieldCheck, Activity, Plus, ArrowRight, Zap, Stethoscope } from 'lucide-react';
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-blue-100 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-blue-600 px-8 py-6 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 rounded-xl text-white">
                            <Stethoscope size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white leading-none">
                                Quick Diagnosis
                            </h2>
                            <p className="text-blue-100 text-xs mt-1 font-medium">Create new clinical record</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1 space-y-8">
                    {/* Patient Selection Step */}
                    {!selectedPatient ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Search size={18} className="text-blue-600" />
                                    Search Patient
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Enter patient name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-bold text-gray-900 focus:border-blue-200 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Patient</p>
                                {filteredPatients.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {filteredPatients.map((patient) => (
                                            <button
                                                key={patient._id}
                                                onClick={() => setSelectedPatient(patient)}
                                                className="flex items-center gap-4 p-5 bg-white hover:bg-blue-50 border-2 border-blue-50 hover:border-blue-200 rounded-2xl transition-all duration-200 group text-left shadow-sm"
                                            >
                                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {patient.user?.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 text-lg decoration-blue-200 underline-offset-4 decoration-2 group-hover:underline">{patient.user?.name}</h4>
                                                    <p className="text-xs font-medium text-gray-500 mt-0.5">{patient.user?.role} • {patient.user?.email}</p>
                                                </div>
                                                <ArrowRight size={20} className="text-blue-300 group-hover:text-blue-600 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-100">
                                        <p className="text-gray-400 font-bold">No patients found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            {/* Selected Patient Card */}
                            <div className="flex items-center justify-between bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 relative overflow-hidden group">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-14 h-14 bg-white text-blue-600 rounded-xl flex items-center justify-center border-2 border-blue-100">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Selected Patient</p>
                                        <h4 className="text-xl font-bold text-gray-900 mt-0.5">{selectedPatient.user?.name}</h4>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPatient(null)}
                                    className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold border-2 border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    Change
                                </button>
                            </div>

                            {/* Diagnosis Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Activity size={18} className="text-blue-600" />
                                    Diagnosis
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter diagnosis details..."
                                    value={formData.diagnosis}
                                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                                    className="w-full px-5 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-bold text-gray-900 focus:border-blue-200 transition-all"
                                />
                            </div>

                            {/* Prescription Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <FileText size={18} className="text-blue-600" />
                                    Prescription & Notes
                                </label>
                                <textarea
                                    required
                                    rows="5"
                                    placeholder="Detail medications, dosage, and follow-up instructions..."
                                    value={formData.prescription}
                                    onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                                    className="w-full px-5 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-bold text-gray-900 focus:border-blue-200 transition-all resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Activity size={20} className="animate-spin" />
                                        Creating Record...
                                    </span>
                                ) : (
                                    <>
                                        <span>Complete Diagnosis</span>
                                        <CheckCircle size={22} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-blue-50 border-t-2 border-blue-100 flex items-center justify-center gap-3 flex-shrink-0">
                    <ShieldCheck size={16} className="text-green-600" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secure Clinical Documentation Node</span>
                </div>
            </div>
        </div>
    );
};

export default AddMedicalRecordModal;
