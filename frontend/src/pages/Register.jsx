import { SignUp } from '@clerk/clerk-react';
import { UserPlus, ShieldCheck } from 'lucide-react';

const Register = () => {
    return (
        <div className="grid-auth bg-blue-50">
            <div className="w-full max-w-2xl flex flex-col items-center">

                {/* Fixed Logo Grid */}
                <div className="mb-10 text-center">
                    <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-5xl shadow-xl shadow-blue-200 mx-auto mb-6">🏥</div>
                    <h1 className="text-5xl font-black text-blue-900 mb-2">Hospital Registry</h1>
                    <p className="text-2xl text-gray-500 font-bold">New Patient Enrollment</p>
                </div>

                <div className="simple-card w-full p-8 md:p-12">
                    <div className="flex items-center gap-5 mb-10 pb-6 border-b-2 border-blue-50">
                        <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center">
                            <UserPlus size={40} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-blue-900">Registration</h2>
                            <p className="text-xl text-blue-600 font-bold">Direct Entry Protocol</p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <SignUp
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none border-0 p-0 w-full bg-transparent overflow-visible",
                                    header: "hidden",
                                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-2xl py-5 rounded-2xl normal-case font-black w-full transition shadow-lg shadow-blue-100",
                                    formFieldInput: "text-xl p-5 border-2 border-blue-50 rounded-2xl focus:border-blue-600 transition-all font-medium",
                                    formFieldLabel: "text-lg text-blue-900 font-bold mb-3 uppercase tracking-wider",
                                    footerActionText: "text-xl text-gray-500 font-bold",
                                    footerActionLink: "text-blue-600 font-black hover:text-blue-800 underline underline-offset-8",
                                    identityPreviewText: "text-xl font-bold text-blue-900",
                                    dividerLine: "bg-blue-50",
                                    dividerText: "text-gray-400 font-black text-sm uppercase tracking-widest",
                                    socialButtonsBlockButton: "border-2 border-blue-50 rounded-2xl font-bold py-4 hover:bg-blue-50 transition-colors",
                                    footer: "mt-8",
                                }
                            }}
                            signInUrl="/login"
                        />
                    </div>

                    <div className="mt-12 pt-10 border-t-4 border-blue-50">
                        <div className="flex items-start gap-5 bg-blue-50 p-6 rounded-3xl border-2 border-blue-100">
                            <ShieldCheck className="text-blue-600 mt-1" size={32} />
                            <p className="text-lg text-blue-900 font-bold leading-relaxed">
                                System integrity verified. All patient medical records are secured under <span className="text-blue-700 underline font-black">Level 5 Institutional Encryption</span> standards.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-400 font-black uppercase tracking-[0.3em] text-sm">
                    🏥 Institutional Registry Unit active
                </div>
            </div>
        </div>
    );
};

export default Register;
