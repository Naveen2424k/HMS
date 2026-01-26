import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
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
    FileText
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);

    const getLinks = () => {
        switch (user.role) {
            case 'Admin':
                return [
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
                    { name: 'Doctors', icon: Stethoscope, path: '/doctors' },
                    { name: 'Patients', icon: Users, path: '/patients' },
                ];
            case 'Doctor':
                return [
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
                    { name: 'Appointments', icon: Calendar, path: '/appointments' },
                ];
            case 'Receptionist':
                return [
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
                    { name: 'Registration', icon: UserPlus, path: '/register-patient' },
                    { name: 'Appointments', icon: Calendar, path: '/appointments' },
                    { name: 'Billing', icon: CreditCard, path: '/billing' },
                ];
            case 'Patient':
                return [
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
                    { name: 'Find Doctors', icon: Stethoscope, path: '/doctors' },
                    { name: 'My Reminders', icon: Bell, path: '/reminders' },
                    { name: 'Medical Records', icon: FileText, path: '/medical-records' },
                    { name: 'Our Services', icon: Heart, path: '/services' },
                    { name: 'About Us', icon: HelpCircle, path: '/about' },
                    { name: 'Book Appointment', icon: Calendar, path: '/?action=book' },
                    { name: 'Medical History', icon: Users, path: '/?action=history' },
                ];
            default:
                return [];
        }
    };

    return (
        <aside className="w-80 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 z-50 overflow-hidden">
            {/* Brand Logo */}
            <div className="p-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 animate-pulse-subtle">
                    <Activity size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">MediCare</h1>
                    <p className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em] mt-1">Royal Wellness</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 space-y-2">
                <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
                {getLinks().map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-semibold group
              ${isActive
                                ? 'bg-primary-600 text-white shadow-xl shadow-primary-100'
                                : 'text-slate-500 hover:bg-primary-50 hover:text-primary-600'}
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon size={22} className={`${!isActive && 'group-hover:scale-110 transition-transform duration-300'}`} />
                                <span className="text-[15px]">{link.name}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-glow"></div>}
                            </>
                        )}
                    </NavLink>
                ))}

                <div className="pt-8 pb-4">
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Support</p>
                    <NavLink to="/?action=settings" className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-slate-500 font-semibold hover:bg-slate-50 transition-all">
                        <Settings size={22} />
                        <span className="text-[15px]">Settings</span>
                    </NavLink>
                    <button className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-slate-500 font-semibold hover:bg-slate-50 transition-all">
                        <HelpCircle size={22} />
                        <span className="text-[15px]">Help Center</span>
                    </button>
                </div>
            </nav>

            {/* User Quick Profile / Logout */}
            <div className="p-6 m-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-3 w-full py-3 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span>Exit System</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
