const Admission = require('../models/Admission');
const Bed = require('../models/Bed');
const Ward = require('../models/Ward');
const Patient = require('../models/Patient');

// @desc    Admit a patient to a bed
// @route   POST /api/ipd/admit
const admitPatient = async (req, res) => {
    try {
        const { patientId, doctorId, bedId, reason, vitals } = req.body;

        const bed = await Bed.findById(bedId);
        if (!bed || bed.status !== 'Available') {
            return res.status(400).json({ message: 'Bed is not available' });
        }

        const admission = new Admission({
            patient: patientId,
            doctor: doctorId,
            bed: bedId,
            reason,
            vitalsAtAdmission: vitals
        });

        const createdAdmission = await admission.save();

        // Update bed status
        bed.status = 'Occupied';
        bed.patient = patientId;
        await bed.save();

        res.status(201).json(createdAdmission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Discharge a patient
// @route   PUT /api/ipd/discharge/:id
const dischargePatient = async (req, res) => {
    try {
        const admission = await Admission.findById(req.params.id);
        if (!admission) {
            return res.status(404).json({ message: 'Admission record not found' });
        }

        const { conditionOnDischarge, advice, followUpDate } = req.body;

        admission.status = 'Discharged';
        admission.dischargeDate = Date.now();
        admission.dischargeSummary = { conditionOnDischarge, advice, followUpDate };
        await admission.save();

        // Free the bed
        const bed = await Bed.findById(admission.bed);
        if (bed) {
            bed.status = 'Available';
            bed.patient = null;
            await bed.save();
        }

        res.json({ message: 'Patient discharged successfully', admission });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all wards and their occupancy
// @route   GET /api/ipd/occupancy
const getOccupancy = async (req, res) => {
    try {
        const wards = await Ward.find();
        const beds = await Bed.find().populate('ward').populate({
            path: 'patient',
            populate: { path: 'user', select: 'name' }
        });

        const occupancyData = wards.map(ward => ({
            ...ward._doc,
            beds: beds.filter(bed => bed.ward?._id.toString() === ward._id.toString())
        }));

        res.json(occupancyData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    admitPatient,
    dischargePatient,
    getOccupancy
};
