import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
    Calendar,
    Bed,
    FileText,
    Pill,
    Phone,
    Stethoscope,
    Activity,
    Truck,
    Clock,
    Shield,
    Users,
    Award,
    Heart,
    CheckCircle
} from 'lucide-react';

const Home = () => {
    const { authenticated, user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-blue-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                                Welcome to MediCare Hospital
                            </h1>
                            <p className="text-xl mb-8 text-blue-100">
                                Quality healthcare services for you and your family.
                                Book appointments and access your medical records easily.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {user?.role !== 'Receptionist' && (
                                    <Link
                                        to="/appointments"
                                        className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg text-lg"
                                    >
                                        📅 Book Appointment
                                    </Link>
                                )}
                                <a
                                    href="tel:108"
                                    className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg text-lg"
                                >
                                    🚑 Emergency Call
                                </a>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20">
                                <h3 className="text-2xl font-bold mb-4 text-white">24/7 Available</h3>
                                <ul className="space-y-3 text-lg">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="text-green-300" />
                                        Expert Doctors
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="text-green-300" />
                                        Modern Facilities
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="text-green-300" />
                                        Emergency Services
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="text-green-300" />
                                        Digital Reports
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Services</h2>
                        <p className="text-xl text-gray-600">Comprehensive healthcare solutions for all your needs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Service Cards */}
                        {user?.role !== 'Receptionist' && (
                            <Link to="/appointments" className="bg-blue-50 p-6 rounded-xl hover:shadow-lg transition-all border-2 border-blue-100 hover:border-blue-300">
                                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                    <Calendar className="text-white" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-blue-900 mb-2">OPD Consultation</h3>
                                <p className="text-gray-600">Book appointments with specialist doctors</p>
                            </Link>
                        )}



                        <Link to="/dashboard" className="bg-purple-50 p-6 rounded-xl hover:shadow-lg transition-all border-2 border-purple-100 hover:border-purple-300">
                            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="text-white" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-purple-900 mb-2">Lab Reports</h3>
                            <p className="text-gray-600">Access your test results digitally</p>
                        </Link>

                        <Link to="/services" className="bg-orange-50 p-6 rounded-xl hover:shadow-lg transition-all border-2 border-orange-100 hover:border-orange-300">
                            <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                                <Pill className="text-white" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-orange-900 mb-2">Pharmacy</h3>
                            <p className="text-gray-600">24/7 medicine availability</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Technology / Facilities Section */}
            <section className="py-16 bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Facilities</h2>
                        <p className="text-xl text-gray-600">State-of-the-art infrastructure for better care</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Activity className="text-red-600" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Modern ICU</h3>
                            <p className="text-gray-600">Advanced intensive care units with latest equipment</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Ambulance</h3>
                            <p className="text-gray-600">Quick emergency response service</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Stethoscope className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Doctors</h3>
                            <p className="text-gray-600">Highly qualified and experienced medical professionals</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="text-purple-600" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Digital Reports</h3>
                            <p className="text-gray-600">Online access to all medical records</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions for Patients */}
            {!authenticated && (
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Get Started</h2>
                            <p className="text-xl text-gray-600">New to MediCare? Create an account to get started</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <Link
                                to="/register"
                                className="bg-blue-600 text-white p-8 rounded-xl hover:bg-blue-700 transition-all shadow-lg text-center"
                            >
                                <Users size={48} className="mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Register</h3>
                                <p className="text-blue-100">Create new account</p>
                            </Link>

                            <Link
                                to="/login"
                                className="bg-green-600 text-white p-8 rounded-xl hover:bg-green-700 transition-all shadow-lg text-center"
                            >
                                <Shield size={48} className="mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Login</h3>
                                <p className="text-green-100">Access your account</p>
                            </Link>

                            <Link
                                to="/appointments"
                                className="bg-purple-600 text-white p-8 rounded-xl hover:bg-purple-700 transition-all shadow-lg text-center"
                            >
                                <Calendar size={48} className="mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Book Now</h3>
                                <p className="text-purple-100">Schedule appointment</p>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold mb-2">15+</div>
                            <p className="text-xl text-blue-100">Years Experience</p>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">50k+</div>
                            <p className="text-xl text-blue-100">Happy Patients</p>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">100+</div>
                            <p className="text-xl text-blue-100">Expert Doctors</p>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">24/7</div>
                            <p className="text-xl text-blue-100">Emergency Care</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-white text-center">
                        <Phone size={64} className="mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Immediate Help?</h2>
                        <p className="text-xl mb-6 text-red-100">Our emergency team is available 24/7</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="tel:108"
                                className="px-8 py-4 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all shadow-lg text-xl"
                            >
                                📞 Call 108
                            </a>
                            <Link
                                to="/contact"
                                className="px-8 py-4 bg-red-800 text-white rounded-xl font-bold hover:bg-red-900 transition-all shadow-lg text-xl"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
