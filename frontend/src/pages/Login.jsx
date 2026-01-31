import { useSearchParams } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { SimplePage, SimpleCard } from '../components/SimpleUI';
import { Lock } from 'lucide-react';

const Login = () => {
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/after-login';

    return (
        <SimplePage title="Patient Login" subtitle="Access your medical records securely.">
            <div className="flex justify-center mt-8">
                <SimpleCard className="w-full max-w-lg" icon={Lock} title="Secure Sign In">
                    <div className="flex justify-center p-4">
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none p-0 w-full",
                                    headerTitle: "text-2xl font-bold text-blue-900",
                                    headerSubtitle: "text-lg text-gray-600",
                                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white text-lg py-4 rounded-xl normal-case font-bold w-full",
                                    formFieldInput: "text-lg p-4 border-2 border-gray-300 rounded-xl",
                                    formFieldLabel: "text-lg text-gray-700 font-bold",
                                    footerActionText: "text-lg text-gray-600",
                                    footerActionLink: "text-blue-600 font-bold text-lg",
                                    identityPreviewText: "text-lg font-bold",
                                    formFieldInputShowPasswordButton: "text-gray-500"
                                }
                            }}
                            signUpUrl="/register"
                            forceRedirectUrl={redirectUrl}
                        />
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-500">
                                Staff Login: Use your registered email. <br />
                                <span className="text-xs text-blue-500">System automatically detects Doctor/Admin roles.</span>
                            </p>
                        </div>
                    </div>
                </SimpleCard>
            </div>
        </SimplePage>
    );
};

export default Login;
