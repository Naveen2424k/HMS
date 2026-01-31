import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import AuthContext, { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

// New Simple Theme Components
import Navbar from './components/Navbar';
import FooterSimple from './components/FooterSimple';
import Home from './pages/Home';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Doctors from './pages/Doctors';
import Services from './pages/Services';
import About from './pages/About';
import MedicalRecords from './pages/MedicalRecords';
import Reminders from './pages/Reminders';
import Login from './pages/Login';
import Register from './pages/Register';
import Billing from './pages/Billing';
import LabReports from './pages/LabReports';
import Prescriptions from './pages/Prescriptions';
import PatientRegistration from './pages/PatientRegistration';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Logout from './pages/Logout';
import WardControl from './pages/WardControl';
import Inventory from './pages/Inventory';
import NursingStation from './pages/NursingStation';
import Telemedicine from './pages/Telemedicine';
import BookAppointment from './pages/BookAppointment';
import RoomBooking from './pages/RoomBooking.jsx';
import CustomRegister from './pages/CustomRegister';
import AfterLoginRedirect from './pages/AfterLoginRedirect';
import ProtectedRoute from './components/ProtectedRoute';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';

const DashboardRedirect = () => {
    const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
    const { user: dbUser, loading: dbLoading } = useContext(AuthContext);

    if (!clerkLoaded || dbLoading) return (
        <div className="flex items-center justify-center h-screen bg-blue-50">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!isSignedIn) return <Navigate to="/login" />;

    const role = dbUser?.role || clerkUser?.publicMetadata?.role;

    if (!role) return <Navigate to="/after-login" />;

    switch (role) {
        case 'Admin': return <AdminDashboard />;
        case 'Doctor': return <DoctorDashboard />;
        case 'Receptionist': return <ReceptionistDashboard />;
        case 'Nurse': return <NursingStation />;
        case 'LabTechnician': return <LabReports />;
        case 'Pharmacist': return <Inventory />;
        default: return <PatientDashboard />;
    }
};

const AppContent = () => {

    const { user, isLoaded, isSignedIn } = useUser();
    const navigate = useNavigate();

    if (!isLoaded) return (
        <div className="flex items-center justify-center h-screen bg-blue-50">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-blue-50">
            <div className="flex flex-col min-w-0">
                {/* Use new simple Navbar for all pages */}
                <Navbar />

                <main>
                    <Routes>
                        {/* Home Route - New Simple Home Page */}
                        <Route path="/" element={<Home />} />

                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<CustomRegister />} />
                        <Route path="/after-login" element={<AfterLoginRedirect />} />

                        {/* Public Routes */}
                        <Route path="/doctors" element={<Doctors />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/appointments" element={<BookAppointment />} />
                        <Route path="/room-booking" element={<RoomBooking />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />

                        {/* Protected Routes */}
                        <Route path="/dashboard" element={<DashboardRedirect />} />


                        <Route path="/medical-records" element={isSignedIn ? <MedicalRecords /> : <Navigate to="/login" />} />
                        <Route path="/reminders" element={isSignedIn ? <Reminders /> : <Navigate to="/login" />} />
                        <Route path="/billing" element={isSignedIn ? <Billing /> : <Navigate to="/login" />} />
                        <Route path="/lab-reports" element={isSignedIn ? <LabReports /> : <Navigate to="/login" />} />
                        <Route path="/prescriptions" element={isSignedIn ? <Prescriptions /> : <Navigate to="/login" />} />
                        <Route path="/register-patient" element={isSignedIn ? <PatientRegistration /> : <Navigate to="/login" />} />
                        <Route path="/ward-control" element={isSignedIn ? <WardControl /> : <Navigate to="/login" />} />
                        <Route path="/inventory" element={isSignedIn ? <Inventory /> : <Navigate to="/login" />} />
                        <Route path="/nurse-panel" element={isSignedIn ? <NursingStation /> : <Navigate to="/login" />} />
                        <Route path="/telemedicine" element={isSignedIn ? <Telemedicine /> : <Navigate to="/login" />} />

                        {/* Clerk Role-Based Dashboards */}
                        <Route path="/patient/dashboard" element={
                            <ProtectedRoute allowedRoles={['Patient']}>
                                <PatientDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/doctor/dashboard" element={
                            <ProtectedRoute allowedRoles={['Doctor']}>
                                <DoctorDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/reception/dashboard" element={
                            <ProtectedRoute allowedRoles={['Receptionist']}>
                                <ReceptionistDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </main>

                {/* Use new simple Footer for all pages */}
                <FooterSimple />
            </div>
        </div>
    );
};


function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <NotificationProvider>
                    <AppContent />
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;


