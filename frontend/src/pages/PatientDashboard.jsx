import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';
import MedicalHistoryModal from '../components/MedicalHistoryModal';
import SettingsModal from '../components/SettingsModal';
import BillingHistoryModal from '../components/BillingHistoryModal';
import AppointmentsHistoryModal from '../components/AppointmentsHistoryModal';

import {
    Calendar,
    FileText,
    Clipboard,
    Heart,
    Bell,
    CreditCard,
    User,
    Clock,
    Activity,
    Download,
    Pill,
    Bed,
    Phone,
    CheckCircle,
    TrendingUp,
    XCircle,
    ShieldCheck,
    AlertTriangle
} from 'lucide-react';

const PatientDashboard = () => {
    const { user } = useUser();
    const [tokenStatus, setTokenStatus] = useState(null);
    const [pendingBill, setPendingBill] = useState({ amount: 1500, id: 'BILL123', status: 'pending' });
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    // New states for history view modals
    const [isBillingHistoryOpen, setIsBillingHistoryOpen] = useState(false);
    const [isAppointmentsHistoryOpen, setIsAppointmentsHistoryOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const [notifications, setNotifications] = useState([
        { title: 'Prescription Reminder', time: '10 min ago', desc: 'Take Atorvastatin 20mg tonight', icon: Bell, color: 'text-amber-600' },
        { title: 'Billing Updated', time: '2 hours ago', desc: 'Your invoice has been settled', icon: CreditCard, color: 'text-green-600' },
        { title: 'Lab Report Ready', time: 'Yesterday', desc: 'Blood test results available', icon: FileText, color: 'text-blue-600' },
    ]);

    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'book') setIsAppointmentModalOpen(true);
        else if (action === 'history') setIsHistoryModalOpen(true);
        else if (action === 'settings') setIsSettingsModalOpen(true);

        // Mock fetch token status
        setTokenStatus({
            tokenNumber: 15,
            currentServing: 12,
            wait: 4
        });

    }, [searchParams]);

    const handleCloseModal = (setter) => {
        setter(false);
        setSearchParams({});
    };

    const handlePayBill = async () => {
        // Mock payment flow
        alert("Redirecting to Secure Payment Gateway...");
        setTimeout(async () => {
            // Mock API call to backend 'record payment'
            try {
                // In this mock UI, just show success
                alert("Payment Successful! Recepit sent to email.");
                setPendingBill({ ...pendingBill, status: 'paid' });
                setShowPaymentModal(false);
            } catch (err) {
                alert("Payment Simulated: Success! (Backend recording pending)");
                setPendingBill({ ...pendingBill, status: 'paid' });
                setShowPaymentModal(false);
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-blue-50 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <User size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-blue-900">
                                Welcome back, {user?.name?.split(' ')[0]}!
                            </h1>
                            <p className="text-gray-600">Here's your health dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Heart className="text-blue-600" size={24} />
                            </div>
                            <span className="text-sm font-bold text-green-600">Normal</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">72 BPM</h3>
                        <p className="text-sm text-gray-600">Heart Rate</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-2 border-green-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Calendar className="text-green-600" size={24} />
                            </div>
                            <span className="text-sm font-bold text-blue-600">1 Upcoming</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Jan 24</h3>
                        <p className="text-sm text-gray-600">Next Appointment</p>
                    </div>

                    <Link to="/prescriptions" className="group bg-white p-6 rounded-xl shadow-md border-2 border-purple-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer block">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                <Clipboard className="text-purple-600 group-hover:text-white transition-colors" size={24} />
                            </div>
                            <span className="text-sm font-bold text-green-600">Active</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">2 Meds</h3>
                        <p className="text-sm text-gray-600">Prescriptions</p>
                    </Link>

                    <Link to="/lab-reports" className="group bg-white p-6 rounded-xl shadow-md border-2 border-orange-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer block">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                                <FileText className="text-orange-600 group-hover:text-white transition-colors" size={24} />
                            </div>
                            <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700">View All</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">3 New</h3>
                        <p className="text-sm text-gray-600">Lab Reports</p>
                    </Link>
                </div>

                {/* Live Queue Status */}
                {tokenStatus && (
                    <div className="mb-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-all duration-500">
                        <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
                            <Clock size={150} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                        <Activity className="animate-pulse" /> Live Queue Status
                                    </h2>
                                    <p className="text-blue-100">General Medicine - Dr. Sarah Wilson</p>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <p className="text-blue-200 text-sm font-bold uppercase mb-1">Your Token</p>
                                        <p className="text-5xl font-extrabold">{tokenStatus.tokenNumber}</p>
                                    </div>
                                    <div className="h-12 w-px bg-blue-400"></div>
                                    <div className="text-center">
                                        <p className="text-blue-200 text-sm font-bold uppercase mb-1">Current Serving</p>
                                        <p className="text-4xl font-bold text-green-300 animate-pulse">{tokenStatus.currentServing}</p>
                                    </div>
                                    <div className="h-12 w-px bg-blue-400"></div>
                                    <div className="text-center">
                                        <p className="text-blue-200 text-sm font-bold uppercase mb-1">Est. Wait</p>
                                        <p className={`text-3xl font-bold ${tokenStatus.wait <= 5 ? 'text-yellow-300 animate-pulse' : ''}`}>
                                            {tokenStatus.wait} <span className="text-lg">min</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Alert Message for Short Wait Time */}
                            {tokenStatus.wait <= 5 && (
                                <div className="mt-6 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/50 rounded-xl p-4 flex items-center gap-4 animate-in slide-in-from-top-2">
                                    <div className="bg-yellow-400 text-indigo-900 p-2 rounded-lg animate-bounce">
                                        <AlertTriangle size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-yellow-100 text-lg">Be Ready!</p>
                                        <p className="text-yellow-50 text-sm font-medium">Your appointment is starting in less than 5 minutes. Please head to the consultation room.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Actions Card */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
                            <h2 className="text-3xl font-bold mb-4">Quick Actions</h2>
                            <p className="text-blue-100 mb-6">What would you like to do today?</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsAppointmentModalOpen(true)}
                                    className="bg-white text-blue-600 p-4 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-3"
                                >
                                    <Calendar size={24} />
                                    Book Appointment
                                </button>
                                <Link
                                    to="/room-booking"
                                    className="bg-white/10 backdrop-blur-sm text-white p-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-3 border-2 border-white/20"
                                >
                                    <Bed size={24} />
                                    Book Room
                                </Link>
                                <button
                                    onClick={() => setIsHistoryModalOpen(true)}
                                    className="bg-white/10 backdrop-blur-sm text-white p-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-3 border-2 border-white/20"
                                >
                                    <FileText size={24} />
                                    View Reports
                                </button>
                                <a
                                    href="tel:108"
                                    className="bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-3"
                                >
                                    <Phone size={24} />
                                    Emergency Call
                                </a>
                            </div>
                        </div>

                        {/* Recent Bills */}
                        <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-blue-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-blue-900">Pending Bills</h3>
                                <button
                                    onClick={() => setIsBillingHistoryOpen(true)}
                                    className="text-blue-600 hover:text-blue-700 font-bold text-sm"
                                >
                                    View History
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-4 mb-4 md:mb-0">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-bold">Consultation Fee</p>
                                        <p className="text-sm text-gray-500">Invoice #{pendingBill.id} • Jan 24, 2024</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-900">₹{pendingBill.amount}</p>
                                        <p className={`text-sm font-bold ${pendingBill.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                            {pendingBill.status === 'paid' ? 'Paid' : 'Payment Pending'}
                                        </p>
                                    </div>
                                    {pendingBill.status === 'pending' && (
                                        <button
                                            onClick={() => setShowPaymentModal(true)}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Appointment */}
                        <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-blue-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-blue-900">Upcoming Appointment</h3>
                                <button
                                    onClick={() => setIsAppointmentsHistoryOpen(true)}
                                    className="text-blue-600 hover:text-blue-700 font-bold text-sm"
                                >
                                    View All
                                </button>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-100">
                                <div className="flex items-start gap-6">
                                    <div className="bg-blue-600 text-white p-4 rounded-lg text-center min-w-[80px]">
                                        <div className="text-3xl font-bold">24</div>
                                        <div className="text-sm">JAN</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="text-green-600" size={20} />
                                            <span className="text-sm font-bold text-green-600">Confirmed</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-1">Dr. Sarah Wilson</h4>
                                        <p className="text-gray-600 mb-3">Cardiologist</p>
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <Clock size={18} />
                                            <span className="font-bold">09:30 AM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Prescriptions */}
                        <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-blue-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-blue-900">Active Prescriptions</h3>
                                <button
                                    onClick={() => setIsHistoryModalOpen(true)}
                                    className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-2"
                                >
                                    <Download size={18} />
                                    Download
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-100">
                                    <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                        <Pill size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-900">Atorvastatin 20mg</h4>
                                        <p className="text-gray-600">Daily - After dinner</p>
                                    </div>
                                    <span className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg">
                                        Active
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 opacity-60">
                                    <div className="w-14 h-14 bg-gray-300 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                        <Pill size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-700">Vitamin D3</h4>
                                        <p className="text-gray-500">Completed - 01/24</p>
                                    </div>
                                    <span className="px-4 py-2 bg-gray-300 text-gray-600 text-sm font-bold rounded-lg">
                                        Ended
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Notifications */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-blue-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-blue-900">Notifications</h3>
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {notifications.length}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {notifications.map((notif, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all cursor-pointer">
                                        <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center ${notif.color} flex-shrink-0`}>
                                            <notif.icon size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-900 text-sm">{notif.title}</h4>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notif.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{notif.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setNotifications([])}
                                className="w-full mt-4 py-3 border-2 border-blue-200 rounded-xl text-blue-600 font-bold hover:bg-blue-50 transition-all"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Health Tips */}
                        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Health Tip</h3>
                            </div>
                            <p className="text-green-100 mb-4">
                                Stay hydrated! Drink at least 8 glasses of water daily for better health.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle size={16} />
                                <span>Updated daily</span>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-red-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Phone size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Emergency</h3>
                            </div>
                            <p className="text-red-100 mb-4">
                                24/7 emergency services available
                            </p>
                            <a
                                href="tel:108"
                                className="block w-full py-3 bg-white text-red-600 rounded-xl font-bold text-center hover:bg-red-50 transition-all"
                            >
                                📞 Call 108
                            </a>
                        </div>

                        {/* Account Info */}
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <User size={20} className="text-blue-600" />
                                Account Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Patient ID</span>
                                    <span className="font-semibold text-gray-900 font-mono">#{user?._id?.slice(-6).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Member Since</span>
                                    <span className="font-semibold text-gray-900">Aug 2024</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        Active
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsSettingsModalOpen(true)}
                                className="w-full mt-6 py-2.5 bg-white border border-blue-200 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Manage Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ScheduleAppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={() => handleCloseModal(setIsAppointmentModalOpen)}
                initialDoctorId={searchParams.get('doctorId')}
            />

            <MedicalHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => handleCloseModal(setIsHistoryModalOpen)}
            />

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => handleCloseModal(setIsSettingsModalOpen)}
            />

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative">
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <XCircle size={24} />
                        </button>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <CreditCard size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
                            <p className="text-gray-500">Complete your transaction securely</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-between items-center">
                            <span className="font-bold text-gray-700">Total Amount</span>
                            <span className="text-2xl font-bold text-blue-600">₹{pendingBill.amount}</span>
                        </div>

                        <button
                            onClick={handlePayBill}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ShieldCheck size={20} />
                            Pay Securely
                        </button>
                    </div>
                </div>
            )}

            {/* New History View Modals */}
            <BillingHistoryModal
                isOpen={isBillingHistoryOpen}
                onClose={() => setIsBillingHistoryOpen(false)}
            />
            <AppointmentsHistoryModal
                isOpen={isAppointmentsHistoryOpen}
                onClose={() => setIsAppointmentsHistoryOpen(false)}
            />
        </div>
    );
};

export default PatientDashboard;
