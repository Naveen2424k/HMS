import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const FooterSimple = () => {
    const { user } = useContext(AuthContext);

    return (
        <footer className="bg-gray-900 text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Hospital Info */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                                🏥
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white m-0">MediCare Hospital</h3>
                                <p className="text-sm text-gray-400">Caring for You, Always</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Providing quality healthcare services with compassion and excellence.
                            Our team of experienced doctors and staff are dedicated to your wellbeing.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                                    Our Services
                                </Link>
                            </li>
                            {user?.role !== 'Receptionist' && (
                                <>
                                    <li>
                                        <Link to="/appointments" className="text-gray-400 hover:text-white transition-colors">
                                            Book Appointment
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/room-booking" className="text-gray-400 hover:text-white transition-colors">
                                            Room Booking
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-blue-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    123 Health Avenue<br />
                                    Medical City, NY 10001
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-blue-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">1800-MED-CARE</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-blue-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">help@medicare.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock size={20} className="text-blue-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">24/7 Emergency</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Emergency Banner */}
                <div className="mt-8 p-6 bg-red-600 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Emergency? Call Now!</h3>
                    <p className="text-3xl font-black text-white">📞 108</p>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} MediCare Hospital Management System. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default FooterSimple;
