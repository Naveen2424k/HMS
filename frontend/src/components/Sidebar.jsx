import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import AuthContext from '../context/AuthContext.jsx';
import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    Stethoscope,
    UserPlus,
    LogOut,
    Activity,
    Heart,
    Settings,
    HelpCircle,
    Bell,
    FileText,
    Microscope,
    Pill,
    X,
    ShieldCheck,
    Globe,
    Zap,
    MoveRight,
    Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();


    const getLinks = () => {
        switch (user?.role) {
            case 'Admin':
                return [
                    { name: 'Analytics Node', icon: Activity, path: '/dashboard' },
                    { name: 'Ward Control', icon: LayoutDashboard, path: '/ward-control' },
                    { name: 'Subject Registry', icon: Users, path: '/patients' },
                    { name: 'Medicine Stock', icon: Pill, path: '/inventory' },
                    { name: 'Revenue Nexus', icon: CreditCard, path: '/billing' },
                ];
            case 'Doctor':
                return [
                    { name: 'Clinic Command', icon: LayoutDashboard, path: '/dashboard' },
                    { name: 'Virtual Sync', icon: Globe, path: '/telemedicine' },
                    { name: 'Patient Events', icon: Calendar, path: '/appointments' },
                    { name: 'Bio Scripts', icon: Pill, path: '/prescriptions' },
                ];
            case 'Nurse':
                return [
                    { name: 'Nurse Station', icon: LayoutDashboard, path: '/dashboard' },
                    { name: 'Ward Vitals', icon: Activity, path: '/nurse-panel' },
                    { name: 'Event Queue', icon: Calendar, path: '/appointments' },
                ];
            case 'LabTechnician':
                return [
                    { name: 'LMS Terminal', icon: LayoutDashboard, path: '/dashboard' },
                    { name: 'Report Queue', icon: FileText, path: '/lab-reports' },
                ];
            case 'Pharmacist':
                return [
                    { name: 'Pharmacy Hub', icon: LayoutDashboard, path: '/dashboard' },
                    { name: 'Stock Index', icon: Pill, path: '/inventory' },
                ];
            case 'Receptionist':
                return [
                    { name: 'Front Nexus', icon: LayoutDashboard, path: '/dashboard' },
                    { name: 'New Enrollment', icon: UserPlus, path: '/register-patient' },
                    { name: 'Ward Registry', icon: LayoutDashboard, path: '/ward-control' },
                    { name: 'Revenue Entry', icon: CreditCard, path: '/billing' },
                ];
            case 'Patient':
                return [
                    { name: 'Health Hub', icon: LayoutDashboard, path: '/dashboard' },
                    { name: 'Virtual Consult', icon: Globe, path: '/telemedicine' },
                    { name: 'Pathology Vault', icon: Microscope, path: '/lab-reports' },
                    { name: 'Medical Manifests', icon: FileText, path: '/medical-records' },
                    { name: 'Fiscal Archive', icon: CreditCard, path: '/billing' },
                ];
            default:
                return [];
        }
    };


    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl z-[100] lg:hidden animate-in fade-in duration-700"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`
                w-85 bg-white/70 backdrop-blur-3xl border-r border-white/20 flex flex-col h-screen overflow-hidden
                fixed inset-y-0 left-0 z-[110] transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform
                lg:translate-x-0 lg:static lg:block
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Neural Background Element for Sidebar */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[40%] bg-primary-600 rounded-full blur-[100px] animate-blob"></div>
                </div>

                {/* Elite Branding */}
                <div className="p-12 pb-8 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-18 h-18 bg-slate-950 rounded-[2.2rem] flex items-center justify-center text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] border-4 border-white group cursor-pointer relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700"></div>
                            <Activity size={36} className="relative z-10 group-hover:animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-[1000] tracking-tighter text-slate-950 leading-none uppercase italic">MEDICARE</h1>
                            <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.5em] mt-3 block pl-1">Nexus Node</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-4 bg-white/50 backdrop-blur-md text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Node Identity Card */}
                <div className="px-10 mb-12 relative z-10">
                    <div className="bg-slate-950/5 backdrop-blur-xl p-8 rounded-[3.5rem] border border-white group hover:bg-slate-950 transition-all duration-700 shadow-inner group cursor-pointer">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-[1.8rem] flex items-center justify-center text-primary-600 font-[1000] text-2xl border-2 border-slate-50 shadow-luxury group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="overflow-hidden space-y-2">
                                <p className="text-[9px] font-[1000] text-slate-400 uppercase tracking-[0.4em] leading-none group-hover:text-primary-400">Authorized Node Active</p>
                                <h4 className="text-xl font-[1000] text-slate-950 truncate group-hover:text-white transition-colors tracking-tighter italic uppercase">{user?.name}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-slate-300 italic">{user?.role} Tier</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Navigation */}
                <nav className="flex-1 px-10 space-y-4 overflow-y-auto no-scrollbar pb-10 relative z-10">
                    <p className="px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] mb-8 block opacity-50">Command Directives</p>
                    {getLinks().map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={onClose}
                            className={({ isActive }) => `
                                flex items-center gap-6 px-8 py-6 rounded-[2.5rem] transition-all duration-700 font-black group relative overflow-hidden
                                ${isActive
                                    ? 'bg-slate-950 text-white shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)]'
                                    : 'text-slate-500 hover:bg-white hover:text-primary-600 hover:shadow-luxury-sm border border-transparent hover:border-white'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-xl transition-all duration-500 ${isActive ? 'bg-primary-600 text-white' : 'group-hover:bg-primary-50'}`}>
                                        <link.icon size={24} className={`relative z-10 transition-transform duration-700 ${!isActive && 'group-hover:scale-125 group-hover:rotate-6'}`} />
                                    </div>
                                    <span className="text-base uppercase tracking-tighter relative z-10 italic leading-none">{link.name}</span>
                                    {isActive ? (
                                        <div className="ml-auto relative z-10">
                                            <Sparkles size={18} className="text-primary-400 animate-pulse" />
                                        </div>
                                    ) : (
                                        <MoveRight className="ml-auto opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 text-primary-500" size={20} />
                                    )}
                                    {isActive && (
                                        <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-4 h-12 bg-primary-600 blur-xl opacity-50"></div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}

                    <div className="pt-16">
                        <p className="px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] mb-8 block opacity-50">System Protocols</p>
                        <NavLink to="/dashboard?action=settings" className="flex items-center gap-6 w-full px-8 py-5 rounded-[2.5rem] text-slate-500 font-black hover:bg-white hover:text-slate-950 transition-all duration-700 group border border-transparent hover:border-white group">
                            <div className="p-2 rounded-xl group-hover:bg-slate-50 transition-colors">
                                <Settings size={22} className="group-hover:rotate-180 transition-transform duration-1000" />
                            </div>
                            <span className="text-base uppercase tracking-tighter italic leading-none">Settings Node</span>
                        </NavLink>

                        <button className="flex items-center gap-6 w-full px-8 py-5 rounded-[2.5rem] text-slate-500 font-black hover:bg-white hover:text-slate-950 transition-all duration-700 group border border-transparent hover:border-white text-left group">
                            <div className="p-2 rounded-xl group-hover:bg-slate-50 transition-colors">
                                <HelpCircle size={22} className="group-hover:scale-125 transition-transform" />
                            </div>
                            <span className="text-base uppercase tracking-tighter italic leading-none">Support Nexus</span>
                        </button>
                    </div>
                </nav>

                {/* Secure Logout Footer */}
                <div className="p-8 relative z-10 border-t border-slate-100 bg-white/50 backdrop-blur-md mt-auto">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-center gap-4 text-[9px] font-[1000] text-emerald-600 uppercase tracking-[0.4em] leading-none bg-emerald-50 py-3 rounded-2xl border border-emerald-100">
                            <ShieldCheck size={14} className="animate-pulse" />
                            Neural Link Secure
                        </div>
                        <button
                            onClick={() => navigate('/logout')}
                            className="flex items-center justify-center gap-4 w-full py-5 bg-rose-500 text-white rounded-[2rem] font-[1000] uppercase tracking-[0.4em] text-[10px] hover:bg-rose-600 transition-all duration-700 shadow-2xl active:scale-95 group/exit relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/exit:translate-x-[100%] transition-transform duration-700"></div>
                            <LogOut size={18} className="relative z-10 group-hover/exit:-translate-x-1 transition-transform" />
                            <span className="relative z-10">Sign Out Protocol</span>
                        </button>

                    </div>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;
