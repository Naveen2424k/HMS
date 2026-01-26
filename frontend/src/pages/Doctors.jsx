import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Search, Stethoscope, Clock, DollarSign, Star, Calendar } from 'lucide-react';

const Doctors = () => {
    const { user } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [specialization, setSpecialization] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, [specialization]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const query = specialization ? `?specialization=${specialization}` : '';
            const res = await axios.get(`http://localhost:5000/api/doctors${query}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDoctors(res.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDoctors();
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Find Specialists</h1>
                    <p className="text-slate-500 font-medium mt-1">Book appointments with top medical professionals</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by doctor name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-primary-50 transition-all outline-none font-semibold text-slate-700"
                        />
                    </div>
                    <div className="md:w-64 relative">
                        <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-primary-50 transition-all outline-none font-semibold text-slate-700 appearance-none cursor-pointer"
                        >
                            <option value="">All Specializations</option>
                            <option value="General Physician">General Physician</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Orthopedic">Orthopedic</option>
                            <option value="Pediatrician">Pediatrician</option>
                        </select>
                    </div>
                </form>
            </div>

            {/* Doctors Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <div key={doctor._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                                            {doctor.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{doctor.user.name}</h3>
                                            <p className="text-sm font-semibold text-slate-500">{doctor.specialization}</p>
                                            <div className="flex items-center gap-1 mt-1 text-amber-400">
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                            <Clock size={16} />
                                        </div>
                                        <span>{doctor.experience} Years Experience</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <DollarSign size={16} />
                                        </div>
                                        <span>${doctor.fees} Consultation Fee</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50">
                                    <button
                                        onClick={() => navigate(`/?action=book&doctorId=${doctor._id}`)}
                                        className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Calendar size={18} />
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-slate-400">
                            <Stethoscope size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-medium">No doctors found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Doctors;
