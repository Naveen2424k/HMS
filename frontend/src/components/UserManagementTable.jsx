import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Search, Loader, Shield, User, ChevronDown, Trash2, UserPlus, X, Lock, Mail } from 'lucide-react';
import api from '../services/api';

const UserManagementTable = () => {
    const { user: currentUser } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // New User State
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Doctor'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        setProcessingId(userId);
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            alert(`Registry Updated: ${newRole}`);
        } catch (error) {
            console.error('Update failed', error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`TERMINATE IDENTITY: ${userName.toUpperCase()}? THIS ACTION IS IRREVERSIBLE.`)) return;

        setProcessingId(userId);
        try {
            await api.delete(`/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
            alert('Identity Purged Successfully.');
        } catch (error) {
            console.error('Delete failed', error);
            alert(error.response?.data?.message || 'Access Denied: Termination failed.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/users', newUser);
            setUsers([res.data, ...users]);
            setIsAddModalOpen(false);
            setNewUser({ name: '', email: '', password: '', role: 'Doctor' });
            alert('New Identity Provisioned Successfully.');
        } catch (error) {
            console.error('Provisioning failed', error);
            alert(error.response?.data?.message || 'Identity Provisioning Failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const roles = ['Patient', 'Doctor', 'Admin', 'Receptionist', 'Nurse', 'LabTechnician', 'Pharmacist'];

    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-blue-50 overflow-hidden">
            <div className="p-10 border-b-4 border-blue-50 flex flex-col xl:flex-row justify-between items-center gap-8 bg-blue-50/20">
                <div>
                    <h3 className="text-3xl font-[1000] text-blue-900 uppercase italic tracking-tighter">Registry Control</h3>
                    <p className="text-blue-400 font-black text-sm uppercase tracking-widest mt-2">Centralized Authority Terminal</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                    >
                        <UserPlus size={20} />
                        Provision New Identity
                    </button>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                        <input
                            type="text"
                            placeholder="Search Registry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-blue-100 rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 transition-all text-sm uppercase"
                        />
                    </div>
                </div>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-blue-50/50 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] italic border-b-2 border-blue-50">
                            <th className="px-10 py-6">Subject Identity</th>
                            <th className="px-10 py-6">Digital Lead</th>
                            <th className="px-10 py-6">Tier Level</th>
                            <th className="px-10 py-6 text-right">Operational Switch</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-blue-50">
                        {loading && users.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-20 text-blue-300 font-bold uppercase italic animate-pulse">Accessing Neural Database...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-20 text-blue-300 font-bold uppercase italic">No subjects matching criteria</td></tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-blue-50/30 transition-all group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center font-[1000] text-xl border-2 border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-black text-xl text-blue-900 italic uppercase truncate max-w-[200px]">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-blue-400 font-bold text-lg italic">{user.email}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic
                                            ${user.role === 'Admin' ? 'bg-blue-900 text-white shadow-lg' :
                                                user.role === 'Doctor' ? 'bg-blue-600 text-white' :
                                                    'bg-blue-50 text-blue-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="relative">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                                    disabled={processingId === user._id || user.email === currentUser?.emailAddresses[0]?.emailAddress}
                                                    className="appearance-none bg-blue-50 border-2 border-transparent rounded-xl px-4 py-2 font-black text-blue-900 outline-none focus:border-blue-600 transition-all disabled:opacity-30 cursor-pointer pr-10 text-[10px] uppercase tracking-widest"
                                                >
                                                    {roles.map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                                            </div>

                                            {/* Termination Trigger */}
                                            <button
                                                onClick={() => handleDeleteUser(user._id, user.name)}
                                                disabled={processingId === user._id || user.email === currentUser?.emailAddresses[0]?.emailAddress}
                                                className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all disabled:opacity-0"
                                                title="Terminate Identity"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                            {processingId === user._id && <Loader size={20} className="animate-spin text-blue-600" />}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simple Stats Footer */}
            <div className="p-10 bg-blue-50/30 border-t-4 border-blue-50 flex justify-between items-center">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">Total Registry Identities: {users.length}</p>
                <div className="flex gap-4">
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">System Pulse: Optimal</span>
                </div>
            </div>

            {/* Provision Identity Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-blue-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-8 border-blue-50 relative">
                        <div className="bg-blue-600 p-10 text-white">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl"><UserPlus size={32} /></div>
                                    <div>
                                        <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter leading-none">New Identity</h2>
                                        <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Provisioning Terminal</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={24} /></button>
                            </div>
                        </div>

                        <form onSubmit={handleAddUser} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Full Legal Name</label>
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="E.G. DR. ALICE SMITH"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 focus:bg-white transition-all text-sm uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Digital Lead (Email)</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                                    <input
                                        required
                                        type="email"
                                        placeholder="NAME@HOSPITAL.COM"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 focus:bg-white transition-all text-sm uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Security Key (Password)</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                                    <input
                                        required
                                        type="password"
                                        placeholder="MIN 8 CHARACTERS"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 focus:bg-white transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Authorization Tier</label>
                                <div className="relative">
                                    <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        className="w-full pl-14 pr-10 py-4 bg-blue-50 border-2 border-transparent rounded-2xl outline-none font-bold text-blue-900 focus:border-blue-600 focus:bg-white transition-all appearance-none text-sm uppercase"
                                    >
                                        {roles.map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-[1000] italic uppercase tracking-widest py-6 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-4 text-xl active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Provisioning...' : 'Confirm Provisioning'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementTable;
