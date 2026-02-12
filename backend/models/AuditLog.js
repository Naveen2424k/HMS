const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema(
    {
        actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        actorName: { type: String },
        action: { type: String, required: true }, // e.g., 'UPDATE_USER', 'DELETE_BED'
        target: { type: String }, // e.g., 'User: 64f...', 'Inventory: Item#1'
        details: { type: mongoose.Schema.Types.Mixed }, // JSON of changes
        ipAddress: { type: String },
        userAgent: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
