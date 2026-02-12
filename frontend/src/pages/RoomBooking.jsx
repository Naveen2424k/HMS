import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, User, CheckCircle, Activity, Layout, Trash2, Home, Check } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { SimplePage, SimpleCard, SimpleButton, SimpleInput } from '../components/SimpleUI';

const RoomBooking = () => {
    const { authenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Core Data State
    const [wards, setWards] = useState([]);
    const [existingBooking, setExistingBooking] = useState(null);

    useEffect(() => {
        if (user?.role === 'Receptionist') {
            navigate('/dashboard');
            return;
        }
    }, [user, navigate]);

    // UI Loading State
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // For button clicks

    // Selection State
    const [selectedWard, setSelectedWard] = useState(null);
    const [selectedBed, setSelectedBed] = useState(null);
    const [admissionDetails, setAdmissionDetails] = useState({ reason: '' });

    useEffect(() => {
        // Fetch users booking status and wards on load
        const initData = async () => {
            try {
                // 1. Check if we have a booking first
                const bookingRes = await api.get('/ipd/my-booking');
                if (bookingRes.data) {
                    setExistingBooking(bookingRes.data);
                } else {
                    // 2. Only fetch wards if we don't have a booking (optimization)
                    fetchWards();
                }
            } catch (error) {
                console.error('Initialization error:', error);
                // Even on error, try to fetch wards just in case
                fetchWards();
            } finally {
                setLoading(false);
            }
        };

        if (authenticated) {
            initData();
        } else {
            navigate('/login?redirect=/room-booking');
        }

        window.scrollTo(0, 0);
    }, [authenticated, navigate]);

    const fetchWards = async () => {
        try {
            const { data } = await api.get('/ipd/occupancy');
            if (data && data.length > 0) {
                setWards(data);
                if (!selectedWard) setSelectedWard(data[0]);
            } else {
                throw new Error('No data found');
            }
        } catch (error) {
            console.warn('Using mock data for wards', error);
            // Fallback Mock Data (Same as before but useful for Demo)
            const mockWards = [
                {
                    _id: 'mock-1', name: 'General Ward A', type: 'General', floor: '1', dailyRate: 150,
                    beds: Array.from({ length: 12 }, (_, i) => ({
                        _id: `b-g-${i}`,
                        bedNumber: `G-${100 + i}`,
                        status: i % 3 === 0 ? 'Occupied' : 'Available',
                    }))
                },
                {
                    _id: 'mock-2', name: 'ICU Unit', type: 'ICU', floor: '2', dailyRate: 500,
                    beds: Array.from({ length: 6 }, (_, i) => ({
                        _id: `b-i-${i}`,
                        bedNumber: `ICU-${200 + i}`,
                        status: Math.random() > 0.5 ? 'Occupied' : 'Available',
                    }))
                }
            ];
            setWards(mockWards);
            if (!selectedWard) setSelectedWard(mockWards[0]);
        }
    };

    const handleBookBed = async () => {
        if (!selectedBed || !selectedWard) return;

        try {
            setActionLoading(true);
            const { data } = await api.post('/ipd/book-bed', {
                wardId: selectedWard._id,
                bedId: selectedBed._id,
                reason: admissionDetails.reason
            });

            setExistingBooking(data);
            setSelectedBed(null); // Clear selection
            setAdmissionDetails({ reason: '' });
        } catch (error) {
            console.error('Booking failed:', error);
            alert(error.response?.data?.message || 'Booking failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            setActionLoading(true);
            await api.delete('/ipd/cancel-booking');
            setExistingBooking(null);
            // Refresh wards to show the freed bed immediately
            fetchWards();
        } catch (error) {
            console.error('Cancel failed:', error);
            alert('Failed to cancel booking');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <SimplePage title="Loading...">
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            </SimplePage>
        );
    }

    // --- VIEW 1: BOOKING CONFIRMED DASHBOARD ---
    if (existingBooking) {
        return (
            <SimplePage title="My Booking Status" subtitle="You have a confirmed room reservation.">
                <div className="max-w-4xl mx-auto">
                    <SimpleCard className="border-l-8 border-green-500" icon={Activity} title="Booking Details">
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-500 font-bold uppercase text-sm mb-1">Ward Name</label>
                                    <p className="text-3xl font-bold text-gray-800">{existingBooking.ward?.name}</p>
                                    <p className="text-xl text-gray-500">Floor {existingBooking.ward?.floor}</p>
                                </div>
                                <div>
                                    <label className="block text-gray-500 font-bold uppercase text-sm mb-1">Assigned Bed</label>
                                    <div className="flex items-center gap-4">
                                        <Bed size={40} className="text-blue-600" />
                                        <p className="text-5xl font-black text-blue-600">{existingBooking.bed?.bedNumber}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 md:border-l-2 md:border-gray-100 md:pl-10">
                                <div>
                                    <label className="block text-gray-500 font-bold uppercase text-sm mb-1">Daily Rate</label>
                                    <p className="text-4xl font-bold text-gray-800">${existingBooking.ward?.dailyRate}</p>
                                </div>
                                <div className="pt-6">
                                    <SimpleButton
                                        onClick={handleCancelBooking}
                                        variant="danger"
                                        disabled={actionLoading}
                                        icon={Trash2}
                                        className="w-full"
                                    >
                                        Cancel Booking
                                    </SimpleButton>
                                    <p className="text-sm text-gray-400 mt-2 text-center">Clicking this will release your bed immediately.</p>
                                </div>
                            </div>
                        </div>
                    </SimpleCard>

                    <div className="mt-8 flex justify-center">
                        <SimpleButton to="/" variant="secondary" icon={Home}>Back to Home Dashboard</SimpleButton>
                    </div>
                </div>
            </SimplePage>
        );
    }

    // --- VIEW 2: BED SELECTION DASHBOARD ---
    return (
        <SimplePage title="Book a Room" subtitle="Select a ward and an available bed.">
            <div className="grid lg:grid-cols-12 gap-8">

                {/* Left Sidebar: Wards - Big Buttons */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">1. Select Ward</h3>
                    {wards.length > 0 ? wards.map((ward) => (
                        <button
                            key={ward._id}
                            onClick={() => {
                                setSelectedWard(ward);
                                setSelectedBed(null);
                            }}
                            className={`w-full text-left p-6 rounded-xl transition-all border-2 border-b-4 text-xl font-bold flex justify-between items-center ${selectedWard?._id === ward._id
                                ? 'bg-blue-100 border-blue-600 text-blue-900 shadow-lg translate-x-2'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span>{ward.name}</span>
                            <span className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-500">
                                ${ward.dailyRate}
                            </span>
                        </button>
                    )) : (
                        <SimpleCard>No wards found.</SimpleCard>
                    )}
                </div>

                {/* Right Content: Bed Grid */}
                <div className="lg:col-span-8">
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">2. Select Bed</h3>

                    <SimpleCard className="min-h-[500px]">
                        {/* Header Info */}
                        <div className="flex justify-between items-end mb-8 border-b-2 border-gray-100 pb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-blue-900 mb-1">{selectedWard?.name || 'Please Select Ward'}</h2>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                        <span className="text-lg text-gray-600">Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                                        <span className="text-lg text-gray-600">Occupied</span>
                                    </div>
                                </div>
                            </div>
                            {selectedBed && (
                                <div className="text-right">
                                    <span className="text-gray-500 font-bold block">SELECTED BED</span>
                                    <span className="text-4xl font-black text-blue-600">{selectedBed.bedNumber}</span>
                                </div>
                            )}
                        </div>

                        {/* BED GRID - BIG ICONS */}
                        {selectedWard ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 mb-8">
                                {selectedWard.beds && selectedWard.beds.length > 0 ? (
                                    selectedWard.beds.map((bed, index) => {
                                        const isOccupied = bed.status !== 'Available';
                                        const isSelected = selectedBed?._id === bed._id;

                                        return (
                                            <button
                                                key={bed._id || index}
                                                disabled={isOccupied}
                                                onClick={() => setSelectedBed(bed)}
                                                className={`
                                                    relative h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200
                                                    ${isOccupied
                                                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-40'
                                                        : isSelected
                                                            ? 'bg-blue-600 border-blue-600 shadow-xl scale-105 text-white'
                                                            : 'bg-white border-green-200 hover:border-green-500 hover:bg-green-50 cursor-pointer shadow-sm hover:shadow-md'
                                                    }
                                                `}
                                            >
                                                {isOccupied ? <User size={40} /> : <Bed size={40} />}
                                                <span className="text-lg font-bold">
                                                    {bed.bedNumber}
                                                </span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="col-span-full text-center py-10 text-gray-400 text-xl">No beds information available</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-center py-20 text-gray-400 text-xl">Select a ward from the left menu to view beds.</p>
                        )}

                        {/* Action Panel */}
                        {selectedBed && (
                            <div className="border-t-2 border-gray-100 pt-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
                                <h4 className="text-xl font-bold mb-4">CONFIRM BOOKING</h4>
                                <div className="grid md:grid-cols-3 gap-6 items-end">
                                    <div className="md:col-span-2">
                                        <SimpleInput
                                            label="Reason for Admission (Optional)"
                                            placeholder="E.g. Fever, Surgery, etc."
                                            value={admissionDetails.reason}
                                            onChange={(e) => setAdmissionDetails({ reason: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <SimpleButton
                                            onClick={handleBookBed}
                                            disabled={actionLoading}
                                            className="w-full h-[60px]"
                                            icon={Check}
                                        >
                                            {actionLoading ? 'Processing...' : 'Confirm Now'}
                                        </SimpleButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SimpleCard>
                </div>
            </div>
        </SimplePage>
    );
};

export default RoomBooking;
