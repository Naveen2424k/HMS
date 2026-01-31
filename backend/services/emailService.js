// Email service using Nodemailer
// Install: npm install nodemailer

const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send appointment confirmation email
exports.sendAppointmentConfirmation = async (appointmentData) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"${process.env.HOSPITAL_NAME || 'MediCare Hospital'}" <${process.env.EMAIL_USER}>`,
            to: appointmentData.patientEmail,
            subject: 'Appointment Confirmation - ' + (process.env.HOSPITAL_NAME || 'MediCare Hospital'),
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Appointment Confirmed</h2>
                    <p>Dear ${appointmentData.patientName},</p>
                    <p>Your appointment has been successfully booked.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Appointment Details:</h3>
                        <p><strong>Doctor:</strong> ${appointmentData.doctorName}</p>
                        <p><strong>Specialization:</strong> ${appointmentData.specialization}</p>
                        <p><strong>Date:</strong> ${new Date(appointmentData.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${appointmentData.time}</p>
                        <p><strong>Appointment ID:</strong> ${appointmentData.appointmentId}</p>
                    </div>
                    
                    <p><strong>Important Instructions:</strong></p>
                    <ul>
                        <li>Please arrive 15 minutes before your scheduled time</li>
                        <li>Bring your ID and previous medical records</li>
                        <li>Wear a mask and maintain social distancing</li>
                    </ul>
                    
                    <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
                    
                    <p>For any queries, call: ${process.env.HOSPITAL_PHONE || '1800-MED-CARE'}</p>
                    
                    <p>Thank you,<br>${process.env.HOSPITAL_NAME || 'MediCare Hospital'}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Appointment confirmation email sent to:', appointmentData.patientEmail);
        return { success: true };
    } catch (error) {
        console.error('Error sending appointment confirmation email:', error);
        return { success: false, error: error.message };
    }
};

// Send appointment reminder (24 hours before)
exports.sendAppointmentReminder = async (appointmentData) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"${process.env.HOSPITAL_NAME || 'MediCare Hospital'}" <${process.env.EMAIL_USER}>`,
            to: appointmentData.patientEmail,
            subject: 'Appointment Reminder - Tomorrow',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Appointment Reminder</h2>
                    <p>Dear ${appointmentData.patientName},</p>
                    <p>This is a reminder for your appointment tomorrow.</p>
                    
                    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                        <h3 style="margin-top: 0; color: #92400e;">Tomorrow's Appointment:</h3>
                        <p><strong>Doctor:</strong> ${appointmentData.doctorName}</p>
                        <p><strong>Date:</strong> ${new Date(appointmentData.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${appointmentData.time}</p>
                    </div>
                    
                    <p>Please arrive 15 minutes early for check-in.</p>
                    
                    <p>Thank you,<br>${process.env.HOSPITAL_NAME || 'MediCare Hospital'}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Appointment reminder sent to:', appointmentData.patientEmail);
        return { success: true };
    } catch (error) {
        console.error('Error sending appointment reminder:', error);
        return { success: false, error: error.message };
    }
};

// Send lab report ready notification
exports.sendLabReportNotification = async (reportData) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"${process.env.HOSPITAL_NAME || 'MediCare Hospital'}" <${process.env.EMAIL_USER}>`,
            to: reportData.patientEmail,
            subject: 'Lab Report Ready',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #10b981;">Lab Report Ready</h2>
                    <p>Dear ${reportData.patientName},</p>
                    <p>Your lab report is now ready and available for download.</p>
                    
                    <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Report Details:</h3>
                        <p><strong>Test Name:</strong> ${reportData.testName}</p>
                        <p><strong>Report Date:</strong> ${new Date(reportData.reportDate).toLocaleDateString()}</p>
                        <p><strong>Report ID:</strong> ${reportData.reportId}</p>
                    </div>
                    
                    <p>You can download your report by logging into your patient portal.</p>
                    
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
                       style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
                        View Report
                    </a>
                    
                    <p>Thank you,<br>${process.env.HOSPITAL_NAME || 'MediCare Hospital'}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Lab report notification sent to:', reportData.patientEmail);
        return { success: true };
    } catch (error) {
        console.error('Error sending lab report notification:', error);
        return { success: false, error: error.message };
    }
};

// Send payment receipt
exports.sendPaymentReceipt = async (paymentData) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"${process.env.HOSPITAL_NAME || 'MediCare Hospital'}" <${process.env.EMAIL_USER}>`,
            to: paymentData.patientEmail,
            subject: 'Payment Receipt - ' + paymentData.invoiceNumber,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Payment Receipt</h2>
                    <p>Dear ${paymentData.patientName},</p>
                    <p>Thank you for your payment. Here are the details:</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Payment Details:</h3>
                        <p><strong>Invoice Number:</strong> ${paymentData.invoiceNumber}</p>
                        <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
                        <p><strong>Amount Paid:</strong> ₹${paymentData.amount}</p>
                        <p><strong>Payment Method:</strong> ${paymentData.paymentMethod.toUpperCase()}</p>
                        <p><strong>Date:</strong> ${new Date(paymentData.paidAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> <span style="color: #10b981;">Successful</span></p>
                    </div>
                    
                    <p>This is an auto-generated receipt. Please keep it for your records.</p>
                    
                    <p>Thank you,<br>${process.env.HOSPITAL_NAME || 'MediCare Hospital'}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Payment receipt sent to:', paymentData.patientEmail);
        return { success: true };
    } catch (error) {
        console.error('Error sending payment receipt:', error);
        return { success: false, error: error.message };
    }
};

// Send prescription notification
exports.sendPrescriptionNotification = async (prescriptionData) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"${process.env.HOSPITAL_NAME || 'MediCare Hospital'}" <${process.env.EMAIL_USER}>`,
            to: prescriptionData.patientEmail,
            subject: 'New Prescription Available',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">New Prescription</h2>
                    <p>Dear ${prescriptionData.patientName},</p>
                    <p>A new prescription has been issued by Dr. ${prescriptionData.doctorName}.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Prescription Details:</h3>
                        <p><strong>Date:</strong> ${new Date(prescriptionData.date).toLocaleDateString()}</p>
                        <p><strong>Medications:</strong></p>
                        <ul>
                            ${prescriptionData.medications.map(med => `
                                <li>${med.name} - ${med.dosage} (${med.frequency})</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <p>You can view and download the full prescription from your patient portal.</p>
                    
                    <p><strong>Important:</strong> Please follow the prescribed dosage and consult your doctor if you experience any side effects.</p>
                    
                    <p>Thank you,<br>${process.env.HOSPITAL_NAME || 'MediCare Hospital'}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Prescription notification sent to:', prescriptionData.patientEmail);
        return { success: true };
    } catch (error) {
        console.error('Error sending prescription notification:', error);
        return { success: false, error: error.message };
    }
};

module.exports = exports;
