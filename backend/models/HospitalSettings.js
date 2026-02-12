const mongoose = require('mongoose');

const hospitalSettingsSchema = mongoose.Schema(
    {
        name: { type: String, default: 'MediCare Pro Hospital' },
        logo: { type: String },
        contactEmail: { type: String },
        phone: { type: String },
        address: {
            street: String,
            city: String,
            zip: String,
            country: String
        },
        currency: { type: String, default: 'USD' },
        timezone: { type: String, default: 'UTC' },
        taxRate: { type: Number, default: 0 },
        smsAlertsEnabled: { type: Boolean, default: false },
        emailAlertsEnabled: { type: Boolean, default: true },
        billingSettings: {
            prefix: { type: String, default: 'INV-' },
            footerNote: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('HospitalSettings', hospitalSettingsSchema);
