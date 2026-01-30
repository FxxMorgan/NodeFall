const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Caregiver = require('../models/Caregiver');
const { sendEmail } = require('../utils/email');
const { sendTelegramMessage } = require('../utils/telegramHelper');

// Receive a fall detection alert
router.post('/', async (req, res) => {
    const { deviceId, latitude, longitude } = req.body;

    // Input validation
    if (!deviceId || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            error: 'Missing required fields: deviceId, latitude, and longitude are required'
        });
    }

    try {
        const timestamp = new Date().toISOString();
        const alert = new Alert({ deviceId, latitude, longitude, timestamp });
        await alert.save();

        // Find and notify caregivers
        const caregivers = await Caregiver.find({ deviceId });
        console.log('Caregivers found:', caregivers);

        if (caregivers.length === 0) {
            console.warn(`No caregivers found for device ${deviceId}`);
        }        const notificationPromises = caregivers.map(async caregiver => {
            const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&zoom=15`;
            const message = `🚨 Caída Detectada!

Device ID: ${deviceId}
Coordenadas: ${latitude}, ${longitude}
Hora: ${new Date(timestamp).toLocaleString()}

📍 Ver ubicación en el mapa:
${mapUrl}

Este enlace te llevará directamente a la ubicación del incidente.`;
            console.log('Sending message:', message);            try {
                if (caregiver.email) {
                    await sendEmail(
                        caregiver.email, 
                        '🚨 ALERTA DE EMERGENCIA - Caída Detectada', 
                        message,
                        deviceId,
                        `${latitude}, ${longitude}`,
                        mapUrl
                    );
                }
                if (caregiver.telegramUsername) {
                    await sendTelegramMessage(caregiver.telegramUsername, message);
                }
            } catch (error) {
                console.error(`Failed to notify caregiver ${caregiver._id}:`, error);
            }
        });


        await Promise.all(notificationPromises);

        res.json({
            success: true,
            alertId: alert._id,
            notifiedCaregivers: caregivers.length
        });
    } catch (err) {
        console.error('Alert processing error:', err);
        res.status(500).json({ error: 'Error processing alert' });
    }
});

// Get all alerts with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, deviceId, startDate, endDate } = req.query;

        const query = {};
        if (deviceId) query.deviceId = deviceId;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const alerts = await Alert.find(query)
            .sort({ timestamp: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Alert.countDocuments(query);

        res.json({
            alerts,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalAlerts: total
        });
    } catch (err) {
        console.error('Error fetching alerts:', err);
        res.status(500).json({ error: 'Error fetching alerts' });
    }
});

module.exports = router;