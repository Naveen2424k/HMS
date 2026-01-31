const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
    {
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        type: {
            type: String,
            enum: ['Appointment', 'LabReport', 'MedicineReminder', 'System', 'Emergency'],
            required: true
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
        link: { type: String }, // Optional link to redirect on click
    },
    { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
