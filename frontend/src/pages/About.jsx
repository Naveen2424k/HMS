import { Shield, Activity, Users, Award } from 'lucide-react';

const About = () => {
    return (
        <div className="space-y-12 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="text-center space-y-4 pt-10">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">About MediCare</h1>
                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                    We are redefining healthcare with a patient-first approach, combining cutting-edge technology with compassionate care.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Mission</h3>
                        <p className="text-slate-500 leading-relaxed">
                            To provide accessible, affordable, and high-quality healthcare services to everyone. We believe in a world where quality healthcare is a right, not a privilege.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <Activity size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Vision</h3>
                        <p className="text-slate-500 leading-relaxed">
                            To be the global leader in digital healthcare management, setting the standard for innovation, patient safety, and clinical excellence.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-black">Why Choose Us?</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Users size={20} />
                                </div>
                                <span className="font-semibold text-lg">Expert Team of Specialists</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Award size={20} />
                                </div>
                                <span className="font-semibold text-lg">Award-Winning Service</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Activity size={20} />
                                </div>
                                <span className="font-semibold text-lg">Advanced Technology</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-right">
                        <p className="text-[10rem] font-black leading-none opacity-20 select-none">24/7</p>
                        <p className="text-2xl font-bold text-white/60 -mt-8 mr-4">Care & Support</p>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/30 rounded-full blur-[80px] pointer-events-none"></div>
            </div>
        </div>
    );
};

export default About;
