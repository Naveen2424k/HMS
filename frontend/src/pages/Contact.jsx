import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Check, ChevronDown } from 'lucide-react';

const Contact = () => {
    const [formState, setFormState] = useState('idle'); // idle, sending, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormState('sending');
        setTimeout(() => setFormState('success'), 1500);
    };

    const contactInfo = [
        { icon: Phone, title: 'Call Us', value: '+91 422 4323222', desc: '24/7 Support Available' },
        { icon: Mail, title: 'Email Us', value: 'contact@medicare.com', desc: 'Secure Communication' },
        { icon: MapPin, title: 'Visit Us', value: 'Pankaja Mill Road', desc: 'Coimbatore, T.N.' },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 py-20 px-6">
            <div className="max-w-6xl mx-auto space-y-16">
                {/* Simplified Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">Get in Touch</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Have questions about our services or need to schedule an appointment? Our team is here to help you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Cards */}
                    <div className="space-y-6 lg:col-span-1">
                        {contactInfo.map((info, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow">
                                <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
                                    <info.icon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{info.title}</h4>
                                    <p className="text-xl font-bold text-slate-950">{info.value}</p>
                                    <p className="text-sm text-slate-500">{info.desc}</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-6">
                            <div className="flex items-center gap-4">
                                <Clock className="text-primary-400" size={24} />
                                <h3 className="text-xl font-bold">Business Hours</h3>
                            </div>
                            <div className="space-y-4 text-sm text-slate-400">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span>Monday - Saturday</span>
                                    <span className="text-white">08:00 - 20:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span className="text-white">09:00 - 14:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Form */}
                    <div className="lg:col-span-2 bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <MessageSquare size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-100 transition-all outline-none font-medium text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-100 transition-all outline-none font-medium text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                                <div className="relative">
                                    <select className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-100 transition-all outline-none font-medium text-slate-900 appearance-none cursor-pointer">
                                        <option>General Support</option>
                                        <option>Appointment Inquiry</option>
                                        <option>Medical Records Request</option>
                                        <option>Feedback</option>
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                                <textarea
                                    required
                                    rows="5"
                                    placeholder="How can we help you?"
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-5 px-6 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-100 transition-all outline-none font-medium text-slate-900 resize-none"
                                ></textarea>
                            </div>

                            <button
                                disabled={formState !== 'idle'}
                                className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-lg text-sm
                                    ${formState === 'success'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-900 text-white hover:bg-primary-600 hover:-translate-y-1'}
                                `}
                            >
                                {formState === 'idle' && (
                                    <>
                                        <Send size={18} />
                                        <span>Send Message</span>
                                    </>
                                )}
                                {formState === 'sending' && (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                )}
                                {formState === 'success' && (
                                    <>
                                        <Check size={20} />
                                        <span>Sent Successfully</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
