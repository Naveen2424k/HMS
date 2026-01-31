const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = async (req, res) => {
    const departments = await Department.find();
    res.json(departments);
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
    const { name, description, image, headOfDepartment } = req.body;
    const departmentExists = await Department.findOne({ name });

    if (departmentExists) {
        return res.status(400).json({ message: 'Department already exists' });
    }

    const department = await Department.create({ name, description, image, headOfDepartment });
    res.status(201).json(department);
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (department) {
        department.name = req.body.name || department.name;
        department.description = req.body.description || department.description;
        department.image = req.body.image || department.image;
        department.headOfDepartment = req.body.headOfDepartment || department.headOfDepartment;

        const updatedDepartment = await department.save();
        res.json(updatedDepartment);
    } else {
        res.status(404).json({ message: 'Department not found' });
    }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (department) {
        await department.deleteOne();
        res.json({ message: 'Department removed' });
    } else {
        res.status(404).json({ message: 'Department not found' });
    }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
