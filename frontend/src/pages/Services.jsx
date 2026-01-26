import { Heart, Brain, Bone, Eye, Stethoscope, Baby, Pill, Activity } from 'lucide-react';

const Services = () => {
    const services = [
        {
            icon: Heart,
            name: 'Cardiology',
            desc: 'Comprehensive heart care including diagnostics, arrhythmia treatment, and cardiac rehabilitation.',
            color: 'rose'
        },
        {
            icon: Brain,
            name: 'Neurology',
            desc: 'Advanced care for disorders of the nervous system, brain, spinal cord, and nerves.',
            color: 'violet'
        },
        {
            icon: Bone,
            name: 'Orthopedics',
            desc: 'Expert treatment for bone, joint, ligament, tendon, and muscle conditions.',
            color: 'amber'
        },
        {
            icon: Baby,
            name: 'Pediatrics',
            desc: 'Specialized medical care for infants, children, and adolescents.',
            color: 'sky'
        },
        {
            icon: Eye,
            name: 'Ophthalmology',
            desc: 'Diagnosis and treatment of eye disorders and vision care.',
            color: 'emerald'
        },
        {
            icon: Stethoscope,
            name: 'General Medicine',
            desc: 'Primary care for adults including preventive medicine and chronic disease management.',
            color: 'blue'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Our Services</h1>
                    <p className="text-slate-500 font-medium mt-1">World-class medical specialties and treatments</p>
                </div>
                <button className="hidden md:flex items-center gap-2 px-5 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold hover:bg-primary-100 transition-colors">
                    <Activity size={20} />
                    View All Departments
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                        <div className={`w-16 h-16 bg-${service.color}-50 text-${service.color}-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <service.icon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{service.name}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-6">
                            {service.desc}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-primary-600 transition-colors">
                            <span>Learn more</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Feature Section */}
            <div className="mt-12 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <Pill size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">24/7 Pharmacy & Emergency</h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                        Our emergency department is staffed 24 hours a day by board-certified emergency medicine physicians. The pharmacy provides round-the-clock service to hospital patients.
                    </p>
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary-600 transition-colors">
                        Contact Emergency
                    </button>
                </div>
                <div className="md:w-1/2">
                    {/* Placeholder for an image or graphic */}
                    <div className="aspect-video bg-gradient-to-tr from-indigo-50 to-purple-50 rounded-3xl border-2 border-dashed border-indigo-200 flex items-center justify-center text-indigo-300 font-black text-4xl">
                        24/7
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
