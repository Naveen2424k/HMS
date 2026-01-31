import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Facebook, Twitter, Instagram, Linkedin, Heart, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6">
            <div className="max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Activity size={24} />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">MediCare</span>
                        </Link>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
                            Providing world-class healthcare with cutting-edge technology and compassionate care since 2010.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-slate-500 font-medium hover:text-primary-600 transition-colors">About Us</Link></li>
                            <li><Link to="/services" className="text-slate-500 font-medium hover:text-primary-600 transition-colors">Our Services</Link></li>
                            <li><Link to="/doctors" className="text-slate-500 font-medium hover:text-primary-600 transition-colors">Specialists</Link></li>
                            <li><Link to="/contact" className="text-slate-500 font-medium hover:text-primary-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Departments */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8">Services</h4>
                        <ul className="space-y-4">
                            {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-slate-500 font-medium hover:text-primary-600 transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8">Contact</h4>
                        <ul className="space-y-4 text-slate-500 font-medium">
                            <li>Pankaja Mill Road, Ramnathapuram</li>
                            <li>Coimbatore, Tamil Nadu 641045</li>
                            <li>+91 422 4323222</li>
                            <li className="text-primary-600">contact@medicare.com</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium text-slate-400">
                    <p>© 2026 MediCare Hospital. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link to="#" className="hover:text-slate-900">Privacy Policy</Link>
                        <Link to="#" className="hover:text-slate-900">Terms of Service</Link>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Secured Connection</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
