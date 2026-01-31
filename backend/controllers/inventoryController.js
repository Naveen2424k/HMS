const Inventory = require('../models/Inventory');

// @desc    Get all inventory items
// @route   GET /api/inventory
const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new item to inventory
// @route   POST /api/inventory
const addItem = async (req, res) => {
    try {
        const item = new Inventory(req.body);
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update stock quantity
// @route   PUT /api/inventory/:id/stock
const updateStock = async (req, res) => {
    try {
        const { quantity, action } = req.body; // action: 'add' or 'subtract'
        const item = await Inventory.findById(req.params.id);

        if (item) {
            if (action === 'add') {
                item.quantity += Number(quantity);
            } else if (action === 'subtract') {
                if (item.quantity < quantity) {
                    return res.status(400).json({ message: 'Insufficient stock' });
                }
                item.quantity -= Number(quantity);
            }
            await item.save();
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInventory,
    addItem,
    updateStock
};
