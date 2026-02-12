import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { X, User, Phone, MapPin, Activity, Save, LogOut, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const SettingsModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { signOut } = useClerk();

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
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await api.get('/patients/me', {
                headers: { 'x-clerk-user-id': user.id }
            });
            setPatientId(data._id);
            setFormData({
                age: data.age === 0 ? '' : data.age,
                gender: data.gender || 'Other',
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
            await api.put(`/patients/${patientId}`, formData, {
                headers: { 'x-clerk-user-id': user.id }
            });
            alert('Profile updated successfully!');
            onClose();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-blue-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-blue-50">

                {/* Header */}
                <div className="bg-blue-600 px-8 py-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <User size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic uppercase leading-none">Account Hub</h2>
                            <p className="text-blue-100 text-[10px] font-bold mt-2 uppercase tracking-widest">Personal Profile Settings</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-blue-50/20">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Age</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full px-5 py-4 bg-white border-2 border-blue-100 rounded-xl focus:border-blue-600 outline-none font-bold text-blue-900 transition-all"
                                        placeholder="Age"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-5 py-4 bg-white border-2 border-blue-100 rounded-xl focus:border-blue-600 outline-none font-bold text-blue-900 transition-all appearance-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Contact Link</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-blue-100 rounded-xl focus:border-blue-600 outline-none font-bold text-blue-900 transition-all"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Residential Marker</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" />
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-blue-100 rounded-xl focus:border-blue-600 outline-none font-bold text-blue-900 transition-all"
                                        placeholder="Full Address"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Blood Registry</label>
                                <div className="relative">
                                    <Activity size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" />
                                    <select
                                        value={formData.bloodGroup}
                                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                        className="w-full pl-14 pr-10 py-4 bg-white border-2 border-blue-100 rounded-xl focus:border-blue-600 outline-none font-bold text-blue-900 transition-all appearance-none"
                                    >
                                        <option value="">Select Group...</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-blue-600 text-white font-black italic uppercase tracking-widest py-5 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-100"
                                >
                                    {saving ? 'Updating...' : <><Save size={20} /> Save Hub Sync</>}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    type="button"
                                    className="px-8 py-5 bg-red-50 text-red-600 border-2 border-red-100 rounded-2xl font-black italic uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-3"
                                >
                                    <LogOut size={20} />
                                    Exit
                                </button>
                            </div>
                        </>
                    )}
                </form>

                <div className="px-8 py-6 bg-blue-50 border-t-2 border-blue-100 flex items-center justify-center gap-4">
                    <ShieldCheck size={20} className="text-blue-600" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Profile Privacy Guarded</span>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
