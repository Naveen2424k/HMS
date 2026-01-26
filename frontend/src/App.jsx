import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import AuthContext, { AuthProvider } from './context/AuthContext.jsx';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Doctors from './pages/Doctors';
import Services from './pages/Services';
import About from './pages/About';
import MedicalRecords from './pages/MedicalRecords';
import Reminders from './pages/Reminders';

const AppContent = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="flex min-h-screen bg-slate-50">
                {user && <Sidebar />}
                <div className="flex-1 flex flex-col">
                    {user && <Header />}
                    <main className={user ? "p-6" : ""}>
                        <Routes>
                            <Route path="/login/*" element={
                                <div className="flex items-center justify-center min-h-screen">
                                    <SignIn routing="path" path="/login" />
                                </div>
                            } />
                            <Route path="/register/*" element={
                                <div className="flex items-center justify-center min-h-screen">
                                    <SignUp routing="path" path="/register" />
                                </div>
                            } />

                            <Route path="/doctors" element={user ? <Doctors /> : <Navigate to="/login" />} />
                            <Route path="/services" element={user ? <Services /> : <Navigate to="/login" />} />
                            <Route path="/about" element={user ? <About /> : <Navigate to="/login" />} />
                            <Route path="/medical-records" element={user ? <MedicalRecords /> : <Navigate to="/login" />} />
                            <Route path="/reminders" element={user ? <Reminders /> : <Navigate to="/login" />} />

                            <Route path="/" element={
                                user ? (
                                    user.role === 'Admin' ? <AdminDashboard /> :
                                        user.role === 'Doctor' ? <DoctorDashboard /> :
                                            user.role === 'Receptionist' ? <ReceptionistDashboard /> :
                                                <PatientDashboard />
                                ) : <Navigate to="/login" />
                            } />

                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
