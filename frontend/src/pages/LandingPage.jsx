import React, { useContext, useEffect, useState } from 'react';
import { SimplePage, SimpleCard, SimpleButton } from '../components/SimpleUI';
import {
    CalendarCheck,
    Bed,
    FileText,
    LogOut,
    User,
    Phone,
    Activity,
    Pill,
    Stethoscope,
    Check,
    Star,
    Heart
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const LandingPage = () => {
    const { user, authenticated, logout } = useContext(AuthContext);
    const [myBooking, setMyBooking] = useState(null);

    useEffect(() => {
        if (authenticated) {
            fetchMyBooking();
        }
    }, [authenticated]);

    const fetchMyBooking = async () => {
        try {
            const { data } = await api.get('/ipd/my-booking');
            setMyBooking(data);
        } catch (error) {
            console.error('Failed to fetch booking', error);
        }
    };

    const actions = [
        {
            title: "Book Appointment",
            text: "See a Doctor",
            icon: CalendarCheck,
            to: "/appointments",
            color: "text-purple-600"
        },
        {
            title: "Find a Bed",
            text: "Room Booking",
            icon: Bed,
            to: "/room-booking",
            color: "text-blue-600"
        },
        {
            title: "My Reports",
            text: "Lab Results",
            icon: FileText,
            to: "/profile",
            color: "text-green-600"
        },
        {
            title: "Emergency",
            text: "Call Ambulance",
            icon: Phone,
            to: "/contact",
            color: "text-red-600"
        }
    ];

    if (!authenticated) {
        return (
            <SimplePage title="Welcome to MediCare Hospital" subtitle="Simple, Accessible Healthcare for Everyone.">
                <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto mt-12">
                    <div className="space-y-8">
                        <SimpleCard title="New Patient?" icon={User}>
                            <p className="text-xl mb-6 text-gray-600">First time visiting? Create an account to book appointments easily.</p>
                            <SimpleButton to="/register" className="w-full justify-center">Register Now</SimpleButton>
                        </SimpleCard>

                        <SimpleCard title="Returning Patient?" icon={Activity}>
                            <p className="text-xl mb-6 text-gray-600">Already have an account? Sign in to managing your health.</p>
                            <SimpleButton to="/login" variant="secondary" className="w-full justify-center">Login Here</SimpleButton>
                        </SimpleCard>
                    </div>

                    <div className="grid gap-6">
                        <div className="bg-white p-8 rounded-xl border-l-8 border-blue-600 shadow-md">
                            <h3 className="text-2xl font-bold mb-2">📞 24/7 Support</h3>
                            <p className="text-xl text-gray-600">Call us anytime: <span className="font-bold text-blue-800">1800-MED-CARE</span></p>
                        </div>
                        <div className="bg-white p-8 rounded-xl border-l-8 border-green-600 shadow-md">
                            <h3 className="text-2xl font-bold mb-2">🚑 Emergency</h3>
                            <p className="text-xl text-gray-600">Immediate Ambulance: <span className="font-bold text-red-700">108</span></p>
                        </div>
                    </div>
                </div>
            </SimplePage>
        );
    }

    return (
        <SimplePage
            title={`Hello, ${user?.name}`}
            subtitle="What would you like to do today?"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-end mb-8">
                    <SimpleButton onClick={logout} variant="danger" icon={LogOut}>Sign Out</SimpleButton>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
                    {actions.map((Item, idx) => (
                        <SimpleCard key={idx} className="hover:border-blue-400 cursor-pointer transition-all hover:-translate-y-1">
                            <div className="flex items-center gap-6">
                                <div className={`p-6 rounded-full bg-gray-50 border-2 border-gray-100 ${Item.color}`}>
                                    <Item.icon size={48} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{Item.text}</h3>
                                    <p className="text-lg text-gray-500">{Item.title}</p>
                                </div>
                                <div className="ml-auto">
                                    <SimpleButton to={Item.to} variant="secondary">Go</SimpleButton>
                                </div>
                            </div>
                        </SimpleCard>
                    ))}
                </div>

                {/* Status Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <SimpleCard title="Your Room Status" icon={Bed}>
                        {myBooking ? (
                            <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                                <h4 className="text-2xl text-green-800 font-bold mb-2">Confirmed Booking</h4>
                                <p className="text-xl">Ward: <strong>{myBooking.ward?.name}</strong></p>
                                <p className="text-xl">Bed Number: <strong>{myBooking.bed?.bedNumber}</strong></p>
                                <div className="mt-6">
                                    <SimpleButton to="/room-booking" className="w-full justify-center">Manage Booking</SimpleButton>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-xl text-gray-500 mb-6">You have not booked any room yet.</p>
                                <SimpleButton to="/room-booking" variant="secondary" className="w-full justify-center">Book a Room Now</SimpleButton>
                            </div>
                        )}
                    </SimpleCard>

                    <SimpleCard title="Upcoming Appointments" icon={CalendarCheck}>
                        <div className="text-center py-8">
                            <p className="text-xl text-gray-500 mb-6">No appointments scheduled today.</p>
                            <SimpleButton to="/appointments" variant="secondary" className="w-full justify-center">Schedule Checkup</SimpleButton>
                        </div>
                    </SimpleCard>
                </div>
            </div>

            {/* SHARED CONTENT FOR ALL USERS (Info Sections) */}
            <div className="max-w-7xl mx-auto mt-20 space-y-20">

                {/* 1. Ambulance & Emergency Section */}
                <section id="ambulance" className="bg-red-50 border-2 border-red-100 rounded-3xl p-10 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-red-600 text-white rounded-xl">
                                    <Phone size={40} />
                                </div>
                                <h2 className="text-4xl font-bold text-red-900">24/7 Ambulance Service</h2>
                            </div>
                            <p className="text-2xl text-gray-700 leading-relaxed">
                                Our fleet of Advanced Life Support (ALS) ambulances is ready to reach you in minutes. Equipped with ventilators, cardiac monitors, and emergency medical technicians.
                            </p>
                            <ul className="space-y-3 text-xl text-gray-700">
                                <li className="flex items-center gap-3"><Check className="text-red-500" /> GPS-tracked for fastest route</li>
                                <li className="flex items-center gap-3"><Check className="text-red-500" /> On-board ICU capabilities</li>
                                <li className="flex items-center gap-3"><Check className="text-red-500" /> Direct link to Emergency Room</li>
                            </ul>
                            <div className="pt-4">
                                <SimpleButton to="/contact" variant="danger" className="text-2xl px-10 py-6">
                                    Call Emergency: 108
                                </SimpleButton>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="bg-white p-6 rounded-2xl border-2 border-red-100 shadow-md">
                                <h3 className="text-2xl font-bold text-red-800 mb-4">Service Charges</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xl border-b border-gray-100 pb-2">
                                        <span>Basic Life Support</span>
                                        <span className="font-bold">$50</span>
                                    </div>
                                    <div className="flex justify-between text-xl border-b border-gray-100 pb-2">
                                        <span>Advanced Life Support (ICU)</span>
                                        <span className="font-bold">$150</span>
                                    </div>
                                    <div className="flex justify-between text-xl border-b border-gray-100 pb-2">
                                        <span>Outstation Transfer</span>
                                        <span className="font-bold">$5 / km</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 mt-4 text-center">*Insurance accepted for emergency transport</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Our Departments */}
                <section>
                    <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">Medical Departments</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <SimpleCard title="Cardiology" icon={Activity}>
                            <p className="text-lg text-gray-600">Complete heart care including ECG, Echo, and Angiography. Specialists available 24/7.</p>
                        </SimpleCard>
                        <SimpleCard title="Neurology" icon={Activity}>
                            <p className="text-lg text-gray-600">Advanced care for stroke, migraine, and epilepsy. State-of-the-art MRI and CT Scan.</p>
                        </SimpleCard>
                        <SimpleCard title="Pediatrics" icon={User}>
                            <p className="text-lg text-gray-600">Child-friendly wards and specialized care for newborns and children up to 18 years.</p>
                        </SimpleCard>
                        <SimpleCard title="Orthopedics" icon={Activity}>
                            <p className="text-lg text-gray-600">Joint replacement, fracture management, and physiotherapy rehabilitation services.</p>
                        </SimpleCard>
                        <SimpleCard title="General Medicine" icon={Stethoscope}>
                            <p className="text-lg text-gray-600">Treatment for viral fevers, diabetes, hypertension, and routine health checkups.</p>
                        </SimpleCard>
                        <SimpleCard title="Pharmacy" icon={Pill}>
                            <p className="text-lg text-gray-600">24-hour in-house pharmacy with all essential and life-saving medicines available.</p>
                        </SimpleCard>
                    </div>
                </section>

                {/* 3. Facilities Overview */}
                <section className="bg-blue-100 rounded-3xl p-10">
                    <h2 className="text-4xl font-bold text-blue-900 mb-8 text-center">Patient Facilities</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl text-center">
                            <h4 className="text-xl font-bold text-blue-800 mb-2">Private Rooms</h4>
                            <p className="text-gray-600">Comfortable AC rooms with TV and attached bath.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl text-center">
                            <h4 className="text-xl font-bold text-blue-800 mb-2">Cafeteria</h4>
                            <p className="text-gray-600">Hygienic, healthy food for patients and visitors.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl text-center">
                            <h4 className="text-xl font-bold text-blue-800 mb-2">Large Parking</h4>
                            <p className="text-gray-600">Ample parking space with wheelchair access.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl text-center">
                            <h4 className="text-xl font-bold text-blue-800 mb-2">Waiting Lounge</h4>
                            <p className="text-gray-600">Spacious seating areas with drinking water.</p>
                        </div>
                    </div>
                </section>

                {/* 4. Trusted Statistics */}
                <section className="bg-blue-600 rounded-3xl p-12 text-white text-center">
                    <h2 className="text-4xl font-bold mb-12 text-white">Trusted by Thousands</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-6xl font-black mb-2">15+</div>
                            <p className="text-xl text-blue-100 uppercase tracking-widest font-bold">Years Service</p>
                        </div>
                        <div>
                            <div className="text-6xl font-black mb-2">50k+</div>
                            <p className="text-xl text-blue-100 uppercase tracking-widest font-bold">Happy Patients</p>
                        </div>
                        <div>
                            <div className="text-6xl font-black mb-2">100+</div>
                            <p className="text-xl text-blue-100 uppercase tracking-widest font-bold">Specialist Doctors</p>
                        </div>
                        <div>
                            <div className="text-6xl font-black mb-2">24/7</div>
                            <p className="text-xl text-blue-100 uppercase tracking-widest font-bold">Emergency Care</p>
                        </div>
                    </div>
                </section>

                {/* 5. Meet Our Doctors */}
                <section>
                    <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">Meet Our Head Specialists</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <SimpleCard className="text-center">
                            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                                {/* Ideally an image here */}
                                <User size={80} className="w-full h-full p-4 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900">Dr. Sarah Smith</h3>
                            <p className="text-blue-600 font-bold mb-4">Chief Cardiologist</p>
                            <p className="text-gray-600">20+ years experience in interventional cardiology and heart surgery.</p>
                        </SimpleCard>
                        <SimpleCard className="text-center">
                            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                                <User size={80} className="w-full h-full p-4 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900">Dr. James Wilson</h3>
                            <p className="text-blue-600 font-bold mb-4">Head of Neurology</p>
                            <p className="text-gray-600">Expert in treating stroke, epilepsy, and complex brain disorders.</p>
                        </SimpleCard>
                        <SimpleCard className="text-center">
                            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                                <User size={80} className="w-full h-full p-4 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900">Dr. Emily Chen</h3>
                            <p className="text-blue-600 font-bold mb-4">Senior Pediatrician</p>
                            <p className="text-gray-600">Dedicated to child healthcare and vaccination programs.</p>
                        </SimpleCard>
                    </div>
                </section>

                {/* 6. Testimonials */}
                <section>
                    <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">Patient Success Stories</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <SimpleCard>
                            <div className="flex text-yellow-500 mb-4">
                                <Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" />
                            </div>
                            <p className="text-xl text-gray-700 italic mb-6">"The care I received at MediCare was exceptional. The room booking was so simple, and the nurses were incredibly kind. Highly recommended!"</p>
                            <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">JD</div>
                                <div>
                                    <h4 className="font-bold text-gray-900">John Doe</h4>
                                    <p className="text-sm text-gray-500">Recovered Patient</p>
                                </div>
                            </div>
                        </SimpleCard>
                        <SimpleCard>
                            <div className="flex text-yellow-500 mb-4">
                                <Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" />
                            </div>
                            <p className="text-xl text-gray-700 italic mb-6">"Emergency services were super fast. The ambulance arrived in 10 minutes. Thank you for saving my father's life."</p>
                            <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">MR</div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Maria Rodriguez</h4>
                                    <p className="text-sm text-gray-500">Family Member</p>
                                </div>
                            </div>
                        </SimpleCard>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white rounded-t-3xl mt-20 p-12">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <h3 className="text-3xl font-black text-white flex items-center gap-2">
                                🏥 MediCare
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                                Providing world-class healthcare with a human touch. Our mission is to make quality medical services accessible to everyone in our community.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <SimpleButton variant="primary" className="px-6 py-2 text-sm">Contact Us</SimpleButton>
                                <SimpleButton variant="secondary" className="px-6 py-2 text-sm bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:border-white">About Us</SimpleButton>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xl font-bold text-blue-400 uppercase tracking-widest">Quick Links</h4>
                            <ul className="space-y-4 text-gray-300">
                                <li><a href="#" className="hover:text-white hover:underline transition-all">Find a Doctor</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition-all">Book Appointment</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition-all">Emergency Services</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition-all">Lab Reports</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition-all">Careers</a></li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xl font-bold text-blue-400 uppercase tracking-widest">Contact</h4>
                            <ul className="space-y-4 text-gray-300">
                                <li className="flex items-center gap-3"><Phone size={18} /> 1800-MED-CARE</li>
                                <li className="flex items-center gap-3"><Heart size={18} /> help@medicare.com</li>
                                <li className="flex items-center gap-3"><Activity size={18} /> 123 Health Avenue, Medical City, NY 10001</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
                        <p>© 2024 MediCare Hospital Management System. All rights reserved.</p>
                    </div>
                </footer>

            </div>
        </SimplePage>
    );
};

export default LandingPage;
