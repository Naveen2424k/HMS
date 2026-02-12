import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';

const CustomRegister = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Patient'); // Default role
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Form Submit (SignUp)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        setLoading(true);
        setError('');

        try {
            await signUp.create({
                emailAddress,
                password,
            });

            // Start verification
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);
        } catch (err) {
            setError(err.errors ? err.errors[0].message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Verification Submit
    const handleVerify = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        setLoading(true);
        setError('');

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status !== 'complete') {
                console.log(JSON.stringify(completeSignUp, null, 2));
                setError("Verification failed. Please try again.");
                return;
            }

            if (completeSignUp.status === 'complete') {
                const userId = completeSignUp.createdUserId;

                // Call backend to set the role in publicMetadata
                await axios.post('http://localhost:5000/api/set-role', {
                    userId,
                    role
                });

                await setActive({ session: completeSignUp.createdSessionId });
                navigate('/after-login');
            }
        } catch (err) {
            setError(err.errors ? err.errors[0].message : "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-blue-900 mb-2">Create Account</h2>
                    <p className="text-gray-500 text-center mb-8">Join the MediCare Hospital network</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                            {error}
                        </div>
                    )}

                    {!pendingVerification ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Account Role</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 font-medium appearance-none"
                                        required
                                    >
                                        <option value="Patient">Patient</option>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Receptionist">Receptionist</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <ArrowRight className="h-4 w-4 text-gray-400 rotate-90" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 ml-1 italic">* Select your official designation</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <input
                                        type="email"
                                        value={emailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="name@hospital.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                            >
                                <span>{loading ? 'Processing...' : 'Create My Account'}</span>
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="text-center mb-6">
                                <p className="text-gray-600">We've sent a verification code to <span className="font-semibold text-blue-600">{emailAddress}</span></p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Verification Code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-70"
                            >
                                {loading ? 'Verifying...' : 'Verify & Sign Up'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setPendingVerification(false)}
                                className="w-full text-blue-600 font-medium text-sm hover:underline"
                            >
                                Back to registration
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center space-x-2">
                        <span className="text-gray-500">Already have an account?</span>
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomRegister;
