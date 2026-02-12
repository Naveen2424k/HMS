import { useSearchParams } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { Lock } from 'lucide-react';

const Login = () => {
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect_url') || '/after-login';

    return (
        <div className="grid-auth bg-blue-50">
            <div className="w-full max-w-xl flex flex-col items-center">

                {/* Fixed Logo Grid */}
                <div className="mb-10 text-center">
                    <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-5xl shadow-xl shadow-blue-200 mx-auto mb-6">🏥</div>
                    <h1 className="text-5xl font-black text-blue-900 mb-2">Hospital Login</h1>
                    <p className="text-2xl text-gray-500 font-bold">Secure Access Portal</p>
                </div>

                {/* Main Card Container */}
                <div className="simple-card w-full p-8 md:p-12">
                    <div className="flex items-center gap-5 mb-10 pb-6 border-b-2 border-blue-50">
                        <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center">
                            <Lock size={40} />
                        </div>
                        <h2 className="text-4xl font-black text-blue-900">Sign In</h2>
                    </div>

                    {/* Clerk Component Grid Integration */}
                    <div className="flex justify-center">
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none border-0 p-0 w-full bg-transparent overflow-visible",
                                    header: "hidden",
                                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-2xl py-5 rounded-2xl normal-case font-black w-full transition shadow-lg shadow-blue-100",
                                    formFieldInput: "text-2xl p-5 border-2 border-blue-50 rounded-2xl focus:border-blue-600 transition-all",
                                    formFieldLabel: "text-xl text-blue-900 font-black mb-3 uppercase tracking-wider",
                                    footerActionText: "text-xl text-gray-500 font-bold",
                                    footerActionLink: "text-blue-600 font-black hover:text-blue-800 underline underline-offset-8",
                                    identityPreviewText: "text-xl font-bold text-blue-900",
                                    dividerLine: "bg-blue-100",
                                    dividerText: "text-gray-400 font-black uppercase text-sm tracking-widest",
                                    socialButtonsBlockButton: "border-2 border-blue-100 rounded-2xl font-bold py-4 hover:bg-blue-50",
                                    internal: "hidden",
                                    footer: "mt-8",
                                }
                            }}
                            redirectUrl={redirectUrl}
                            signUpUrl="/register"
                        />
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-400 font-black uppercase tracking-[0.3em] text-sm">
                    🔒 Protected System Architecture
                </div>
            </div>
        </div>
    );
};

export default Login;
