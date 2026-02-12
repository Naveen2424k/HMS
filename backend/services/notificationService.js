const Notification = require('../models/Notification');

/**
 * Sends a real-time notification via Socket.io and saves it to the database
 * @param {Object} app - Express app instance to access socketio
 * @param {Object} data - Notification data { recipient, sender, type, title, message, priority, link }
 */
const sendNotification = async (app, data) => {
    try {
        // 1. Save to Database
        const notification = new Notification(data);
        await notification.save();

        // 2. Emit via Socket.io
        const io = app.get('socketio');
        if (io) {
            // Emitting to the specific room (userId) defined in server.js join event
            io.to(data.recipient.toString()).emit('notification', {
                ...data,
                _id: notification._id,
                createdAt: notification.createdAt
            });
            console.log(`Notification emitted to user: ${data.recipient}`);
        }
    } catch (error) {
        console.error('Notification Service Error:', error);
    }
};

module.exports = { sendNotification };
