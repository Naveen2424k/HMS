const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        category: {
            type: String,
            enum: ['Medicine', 'Surgical', 'Laboratory', 'General'],
            required: true
        },
        quantity: { type: Number, required: true, default: 0 },
        unit: { type: String, required: true }, // e.g., 'Tablet', 'Bottle', 'Box'
        pricePerUnit: { type: Number, required: true },
        expiryDate: { type: Date, required: true },
        batchNumber: { type: String, required: true },
        minStockLevel: { type: Number, default: 10 },
        manufacturer: { type: String },
        location: { type: String }, // Rack/Shelf number
    },
    { timestamps: true }
);

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
