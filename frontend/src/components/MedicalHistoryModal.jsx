import { useState, useEffect } from 'react';
import { X, Activity, FileText, AlertCircle, Plus, Trash } from 'lucide-react';
import api from '../services/api';

const MedicalHistoryModal = ({ isOpen, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [patientId, setPatientId] = useState(null);

    // Form state for adding new history
    const [newItem, setNewItem] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    const fetchHistory = async () => {
        setLoading(true);
        setError('');
        try {
            // First get the patient profile to get the ID and existing history
            const { data } = await api.get('/patients/me');
            setPatientId(data._id);
            setHistory(data.medicalHistory || []);
        } catch (err) {
            console.error('Failed to fetch history', err);
            setError('Could not load medical records. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddHistory = async (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        try {
            const updatedHistory = [...history, newItem];
            // Update the patient record
            await api.put(`/patients/${patientId}`, { medicalHistory: updatedHistory });
            setHistory(updatedHistory);
            setNewItem('');
            setIsAdding(false);
        } catch (err) {
            console.error(err);
            setError('Failed to update medical history');
        }
    };

    const handleDeleteHistory = async (index) => {
        if (!window.confirm('Are you sure you want to remove this record?')) return;
        try {
            const updatedHistory = history.filter((_, i) => i !== index);
            await api.put(`/patients/${patientId}`, { medicalHistory: updatedHistory });
            setHistory(updatedHistory);
        } catch (err) {
            console.error(err);
            setError('Failed to delete record');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Activity className="text-primary-600" size={24} />
                            Medical History
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Your Personal Health Records</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-slate-400">Loading records...</p>
                        </div>
                    ) : error ? (
                        <div className="p-6 bg-rose-50 text-rose-500 rounded-2xl flex items-center gap-4 border border-rose-100">
                            <AlertCircle size={24} />
                            <span className="font-bold">{error}</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {history.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <FileText size={40} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800">No Records Found</h3>
                                    <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">You haven't added any medical history entries yet.</p>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {history.map((item, index) => (
                                        <li key={index} className="group flex items-start gap-4 p-5 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-lg hover:shadow-slate-100/50 rounded-2xl transition-all">
                                            <div className="w-10 h-10 bg-white text-primary-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 font-black text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 pt-2">
                                                <p className="text-slate-700 font-bold leading-relaxed">{item}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteHistory(index)}
                                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                title="Delete Record"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Add New Entry Form */}
                            {isAdding ? (
                                <form onSubmit={handleAddHistory} className="mt-8 p-6 bg-white border-2 border-primary-50 rounded-2xl animate-in slide-in-from-bottom-2">
                                    <h4 className="text-sm font-black text-primary-600 uppercase tracking-widest mb-4">New Entry</h4>
                                    <textarea
                                        autoFocus
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        placeholder="Describe condition, surgery, or allergy..."
                                        className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700 min-h-[100px] focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                                    />
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAdding(false)}
                                            className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!newItem.trim()}
                                            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all disabled:opacity-50 text-sm"
                                        >
                                            Save Record
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black uppercase tracking-widest hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    <Plus size={20} />
                                    Add Record
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalHistoryModal;
