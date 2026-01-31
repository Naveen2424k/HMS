import { useEffect, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AfterLoginRedirect = () => {
    const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useUser();
    const { user: dbUser, loading: dbLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (clerkLoaded && !dbLoading) {
            if (!isSignedIn) {
                navigate('/login');
                return;
            }

            // Priority 1: Backend DB Role
            // Priority 2: Clerk Metadata Role
            const role = dbUser?.role || clerkUser?.publicMetadata?.role;

            console.log('User Role detected (DB/Clerk):', role);

            if (!role) {
                console.warn('No role found, defaulting to Patient');
                navigate('/patient/dashboard');
                return;
            }

            switch (role) {
                case 'Admin':
                    navigate('/admin/dashboard');
                    break;
                case 'Doctor':
                    navigate('/doctor/dashboard');
                    break;
                case 'Receptionist':
                    navigate('/reception/dashboard');
                    break;
                case 'Patient':
                    navigate('/patient/dashboard');
                    break;
                case 'Nurse':
                    navigate('/nurse-panel');
                    break;
                case 'LabTechnician':
                    navigate('/lab-reports');
                    break;
                case 'Pharmacist':
                    navigate('/inventory');
                    break;
                default:
                    navigate('/patient/dashboard');
            }
        }
    }, [clerkLoaded, dbLoading, isSignedIn, clerkUser, dbUser, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="mt-8 text-center">
                <h2 className="text-3xl font-bold text-blue-900">Redirecting...</h2>
                <p className="text-gray-600 mt-2">Preparing your medical dashboard</p>
            </div>
        </div>
    );
};

export default AfterLoginRedirect;
