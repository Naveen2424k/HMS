// SMS service using Twilio
// Install: npm install twilio

// const twilio = require('twilio');

// Initialize Twilio client (uncomment when you have credentials)
// const client = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
// );

// Send appointment confirmation SMS
exports.sendAppointmentConfirmationSMS = async (appointmentData) => {
    try {
        const message = `Hi ${appointmentData.patientName}, your appointment with Dr. ${appointmentData.doctorName} is confirmed for ${new Date(appointmentData.date).toLocaleDateString()} at ${appointmentData.time}. Appointment ID: ${appointmentData.appointmentId}. - ${process.env.HOSPITAL_NAME || 'MediCare Hospital'}`;

        // Uncomment when Twilio is configured
        // const result = await client.messages.create({
        //     body: message,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: appointmentData.patientPhone
        // });

        // For development, just log
        console.log('SMS would be sent to:', appointmentData.patientPhone);
        console.log('Message:', message);

        return { success: true, message: 'SMS sent successfully' };
    } catch (error) {
        console.error('Error sending appointment confirmation SMS:', error);
        return { success: false, error: error.message };
    }
};

// Send appointment reminder SMS
exports.sendAppointmentReminderSMS = async (appointmentData) => {
    try {
        const message = `Reminder: You have an appointment tomorrow with Dr. ${appointmentData.doctorName} at ${appointmentData.time}. Please arrive 15 minutes early. - ${process.env.HOSPITAL_NAME || 'MediCare Hospital'}`;

        // Uncomment when Twilio is configured
        // const result = await client.messages.create({
        //     body: message,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: appointmentData.patientPhone
        // });

        console.log('Reminder SMS would be sent to:', appointmentData.patientPhone);
        console.log('Message:', message);

        return { success: true, message: 'Reminder SMS sent successfully' };
    } catch (error) {
        console.error('Error sending appointment reminder SMS:', error);
        return { success: false, error: error.message };
    }
};

// Send token number SMS
exports.sendTokenNumberSMS = async (tokenData) => {
    try {
        const message = `Your token number is ${tokenData.tokenNumber}. Current serving: ${tokenData.currentToken}. Estimated wait: ${tokenData.estimatedWait} mins. - ${process.env.HOSPITAL_NAME || 'MediCare Hospital'}`;

        // Uncomment when Twilio is configured
        // const result = await client.messages.create({
        //     body: message,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: tokenData.patientPhone
        // });

        console.log('Token SMS would be sent to:', tokenData.patientPhone);
        console.log('Message:', message);

        return { success: true, message: 'Token SMS sent successfully' };
    } catch (error) {
        console.error('Error sending token SMS:', error);
        return { success: false, error: error.message };
    }
};

// Send lab report ready SMS
exports.sendLabReportReadySMS = async (reportData) => {
    try {
        const message = `Your lab report for ${reportData.testName} is ready. Login to your patient portal to view and download. Report ID: ${reportData.reportId}. - ${process.env.HOSPITAL_NAME || 'MediCare Hospital'}`;

        // Uncomment when Twilio is configured
        // const result = await client.messages.create({
        //     body: message,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: reportData.patientPhone
        // });

        console.log('Lab report SMS would be sent to:', reportData.patientPhone);
        console.log('Message:', message);

        return { success: true, message: 'Lab report SMS sent successfully' };
    } catch (error) {
        console.error('Error sending lab report SMS:', error);
        return { success: false, error: error.message };
    }
};

// Send payment confirmation SMS
exports.sendPaymentConfirmationSMS = async (paymentData) => {
    try {
        const message = `Payment of Rs.${paymentData.amount} received successfully. Invoice: ${paymentData.invoiceNumber}. Transaction ID: ${paymentData.transactionId}. Thank you! - ${process.env.HOSPITAL_NAME || 'MediCare Hospital'}`;

        // Uncomment when Twilio is configured
        // const result = await client.messages.create({
        //     body: message,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: paymentData.patientPhone
        // });

        console.log('Payment SMS would be sent to:', paymentData.patientPhone);
        console.log('Message:', message);

        return { success: true, message: 'Payment SMS sent successfully' };
    } catch (error) {
        console.error('Error sending payment SMS:', error);
        return { success: false, error: error.message };
    }
};

// Send OTP SMS
exports.sendOTPSMS = async (phone, otp) => {
    try {
        const message = `Your OTP for ${process.env.HOSPITAL_NAME || 'MediCare Hospital'} is: ${otp}. Valid for 10 minutes. Do not share with anyone.`;

        // Uncomment when Twilio is configured
        // const result = await client.messages.create({
        //     body: message,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: phone
        // });

        console.log('OTP SMS would be sent to:', phone);
        console.log('OTP:', otp);

        return { success: true, message: 'OTP SMS sent successfully' };
    } catch (error) {
        console.error('Error sending OTP SMS:', error);
        return { success: false, error: error.message };
    }
};

// Send emergency alert SMS
exports.sendEmergencyAlertSMS = async (emergencyData) => {
    try {
        const message = `EMERGENCY: ${emergencyData.patientName} requires immediate attention. Location: ${emergencyData.location}. Contact: ${emergencyData.contactNumber}. - ${process.env.HOSPITAL_NAME || 'MediCare Hospital'}`;

        // Send to multiple emergency contacts
        // for (const contact of emergencyData.emergencyContacts) {
        //     await client.messages.create({
        //         body: message,
        //         from: process.env.TWILIO_PHONE_NUMBER,
        //         to: contact
        //     });
        // }

        console.log('Emergency alert would be sent to:', emergencyData.emergencyContacts);
        console.log('Message:', message);

        return { success: true, message: 'Emergency alert sent successfully' };
    } catch (error) {
        console.error('Error sending emergency alert SMS:', error);
        return { success: false, error: error.message };
    }
};

module.exports = exports;
