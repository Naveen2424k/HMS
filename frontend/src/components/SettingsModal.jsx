import { useState, useEffect } from 'react';
import { X, UserCog, Save, User, Phone, MapPin, Activity } from 'lucide-react';
import api from '../services/api';

const SettingsModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        age: '',
        gender: 'Other',
        phone: '',
        address: '',
        bloodGroup: ''
    });
    const [patientId, setPatientId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
        }
    }, [isOpen]);
  
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/patients/me');
            setPatientId(data._id);
            setFormData({
                age: data.age === 0 ? '' : data.age,
                gender: data.gender,
                phone: data.phone === 'Not Set' ? '' : data.phone,
                address: data.address === 'Not Set' ? '' : data.address,
                bloodGroup: data.bloodGroup === 'Unknown' ? '' : data.bloodGroup 
            });
        } catch (err) {
            console.error('Failed to load profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/patients/${patientId}`, formData);
            alert('Profile updated successfully!');
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <UserCog className="text-primary-600" size={24} />
                            Profile Settings
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Personal Details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Age</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-primary-100"
                                            placeholder="Ex: 30"
                                        />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-primary-100 appearance-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-primary-100"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Home Address</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-primary-100"
                                        placeholder="123 Wellness Blvd"
                                    />
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Blood Group</label>
                                <div className="relative">
                                    <select
                                        value={formData.bloodGroup}
                                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-primary-100 appearance-none"
                                    >
                                        <option value="">Select Blood Group...</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-primary-600 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                                {!saving && <Save size={18} />}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
