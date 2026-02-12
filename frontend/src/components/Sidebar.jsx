import { NavLink, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    UserPlus,
    LogOut,
    Activity,
    Settings,
    HelpCircle,
    FileText,
    Microscope,
    Pill,
    X,
    ShieldCheck,
    Globe
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();

    const role = user?.publicMetadata?.role || 'Patient';

    const getLinks = () => {
        switch (role) {
            case 'Admin':
                return [
                    { name: 'Analytics', icon: Activity, path: '/after-login' },
                    { name: 'Ward Control', icon: LayoutDashboard, path: '/ward-control' },
                    { name: 'Patients', icon: Users, path: '/after-login' },
                    { name: 'Inventory', icon: Pill, path: '/inventory' },
                    { name: 'Billing', icon: CreditCard, path: '/billing' },
                ];
            case 'Doctor':
                return [
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/after-login' },
                    { name: 'Telemedicine', icon: Globe, path: '/telemedicine' },
                    { name: 'Appointments', icon: Calendar, path: '/after-login' },
                    { name: 'Prescriptions', icon: Pill, path: '/prescriptions' },
                ];
            default: // Patient
                return [
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/after-login' },
                    { name: 'Telemedicine', icon: Globe, path: '/telemedicine' },
                    { name: 'Lab Reports', icon: Microscope, path: '/lab-reports' },
                    { name: 'Medical History', icon: FileText, path: '/after-login?action=history' },
                    { name: 'Billing', icon: CreditCard, path: '/billing' },
                ];
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`
                w-80 bg-white border-r-4 border-blue-50 flex flex-col h-screen overflow-hidden
                fixed inset-y-0 left-0 z-[110] transition-transform duration-300
                lg:translate-x-0 lg:static lg:block
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>

                {/* Brand Section */}
                <div className="p-10 border-b-4 border-blue-50 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-100 italic">M</div>
                        <div>
                            <h1 className="text-3xl font-[1000] text-blue-900 leading-none tracking-tighter uppercase italic">MediCare</h1>
                            <p className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] mt-2">Hospital Node</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-3 text-blue-400 bg-blue-50 rounded-xl">
                        <X size={24} />
                    </button>
                </div>

                {/* Identity Card */}
                <div className="p-8">
                    <div className="bg-blue-900 text-white p-6 rounded-[2rem] border-4 border-blue-800 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <Activity size={100} className="absolute -right-10 -bottom-10 opacity-10" />
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-900 font-black text-2xl border-4 border-white/20">
                                {user?.firstName?.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-xl font-black truncate uppercase italic tracking-tighter leading-none">{user?.fullName}</h4>
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-200">Tier: {role}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-6 py-6 space-y-3 overflow-y-auto no-scrollbar">
                    <p className="px-6 text-[10px] font-black text-blue-300 uppercase tracking-[0.6em] mb-6 italic opacity-60">Protocols</p>
                    {getLinks().map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={onClose}
                            className={({ isActive }) => `
                                flex items-center gap-5 px-6 py-5 rounded-2xl transition-all font-black group text-xl italic
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-2xl shadow-blue-100 scale-[1.05]'
                                    : 'text-blue-900/50 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-2'}
                            `}
                        >
                            <link.icon size={26} className={`${!isActive && 'text-blue-300'}`} />
                            <span className="uppercase tracking-tighter">{link.name}</span>
                        </NavLink>
                    ))}

                    <div className="pt-10 border-t-2 border-blue-50 mt-10 space-y-3">
                        <p className="px-6 text-[10px] font-black text-blue-300 uppercase tracking-[0.6em] mb-6 italic opacity-60">System Registry</p>
                        <NavLink to="/after-login?action=settings" className="flex items-center gap-5 px-6 py-5 rounded-2xl text-blue-900/50 font-black text-xl italic hover:bg-blue-50 hover:text-blue-600 transition-all hover:translate-x-2">
                            <Settings size={26} className="text-blue-300" />
                            <span className="uppercase tracking-tighter">Preference Hub</span>
                        </NavLink>
                        <button className="flex items-center gap-5 w-full px-6 py-5 rounded-2xl text-blue-900/50 font-black text-xl italic hover:bg-blue-50 hover:text-blue-600 transition-all hover:translate-x-2 text-left">
                            <HelpCircle size={26} className="text-blue-300" />
                            <span className="uppercase tracking-tighter">Support Node</span>
                        </button>
                    </div>
                </nav>

                {/* Logout Footer */}
                <div className="p-8 border-t-2 border-blue-50 bg-blue-50/20 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-4 w-full py-5 bg-white border-2 border-red-100 text-red-600 rounded-2xl font-black uppercase tracking-[0.3em] text-[12px] hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95 italic"
                    >
                        <LogOut size={20} />
                        Exit Protocol
                    </button>
                    <div className="mt-6 flex items-center justify-center gap-3 text-[9px] font-black text-blue-300 uppercase tracking-[0.5em] italic">
                        <ShieldCheck size={14} className="text-green-500" /> Secure Terminal v4.0
                    </div>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;
