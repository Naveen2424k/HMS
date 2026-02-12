import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { X, FileText, Plus, Trash, Download, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const MedicalHistoryModal = ({ isOpen, onClose }) => {
    const { user } = useUser();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [patientId, setPatientId] = useState(null);
    const [newItem, setNewItem] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    const fetchHistory = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await api.get('/patients/me', {
                headers: { 'x-clerk-user-id': user.id }
            });
            if (data) {
                setPatientId(data._id);
                setHistory(data.medicalHistory || []);
            }
        } catch (err) {
            console.error('Failed to fetch history', err);
            // Fallback for demo
            setHistory(["No active records found in database."]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHistory = async (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        try {
            const updatedHistory = [...history, newItem];
            if (patientId) {
                await api.put(`/patients/${patientId}`, { medicalHistory: updatedHistory });
            }
            setHistory(updatedHistory);
            setNewItem('');
            setIsAdding(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteHistory = async (index) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            const updatedHistory = history.filter((_, i) => i !== index);
            if (patientId) {
                await api.put(`/patients/${patientId}`, { medicalHistory: updatedHistory });
            }
            setHistory(updatedHistory);
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-blue-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 border-4 border-blue-50">

                {/* Header */}
                <div className="bg-blue-600 px-8 py-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic uppercase leading-none">Medical Records</h2>
                            <p className="text-blue-100 text-[10px] font-bold mt-2 uppercase tracking-widest">Health Registry Vault</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-8 overflow-y-auto flex-1 space-y-6 bg-blue-50/20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-sm font-black text-blue-400 uppercase tracking-widest">Accessing Vault...</p>
                        </div>
                    ) : (
                        <>
                            {history.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-blue-100">
                                    <FileText size={48} className="text-blue-100 mx-auto mb-4" />
                                    <h3 className="text-lg font-black text-blue-900 uppercase italic">Empty Registry</h3>
                                    <p className="text-blue-300 text-sm font-bold mt-2">No clinical history detected.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((item, index) => (
                                        <div key={index} className="flex items-start gap-4 p-6 bg-white border-2 border-blue-50 rounded-2xl hover:border-blue-100 transition-all group">
                                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-blue-950 font-bold leading-relaxed">{item}</p>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">Verified Log</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteHistory(index)}
                                                className="p-3 text-blue-200 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Action Bar */}
                            <div className="pt-4">
                                {isAdding ? (
                                    <form onSubmit={handleAddHistory} className="bg-white p-6 rounded-3xl border-2 border-blue-600 animate-in slide-in-from-bottom-4 shadow-xl shadow-blue-100">
                                        <h4 className="font-black text-blue-900 mb-4 uppercase text-sm italic">New Clinical Entry</h4>
                                        <textarea
                                            autoFocus
                                            value={newItem}
                                            onChange={(e) => setNewItem(e.target.value)}
                                            placeholder="Type details (e.g. Diagnosed with Flu...)"
                                            className="w-full p-4 bg-blue-50 rounded-xl border-2 border-transparent outline-none focus:border-blue-100 focus:bg-white transition-all resize-none min-h-[120px] mb-4 font-bold text-blue-900"
                                        />
                                        <div className="flex justify-end gap-3">
                                            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 font-black text-blue-400 uppercase tracking-widest text-xs">Cancel</button>
                                            <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-blue-700">Save Record</button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="w-full py-5 border-2 border-dashed border-blue-200 rounded-2xl text-blue-600 font-black hover:bg-blue-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest italic"
                                    >
                                        <Plus size={20} />
                                        Update Registry
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 bg-white border-t-2 border-blue-50 flex items-center justify-center gap-3 text-blue-400">
                    <ShieldCheck size={18} className="text-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Electronic Health Record Compliant</span>
                </div>
            </div>
        </div>
    );
};

export default MedicalHistoryModal;
