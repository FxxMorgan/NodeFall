const express = require('express');
const router = express.Router();
const Caregiver = require('../models/Caregiver');
const { sendTelegramMessage } = require('../utils/telegramHelper');

// Register a new caregiver
router.post('/register', async (req, res) => {
    const { caregiverId, email, deviceId, phoneNumber, telegramUsername } = req.body;

    try {
        // Clean telegram username (remove @ if present)
        const cleanUsername = telegramUsername.replace('@', '');

        const caregiver = new Caregiver({
            caregiverId,
            email,
            deviceId,
            phoneNumber,
            telegramUsername: cleanUsername
        });

        await caregiver.save();

        // Try to send welcome message
        try {
            const welcomeMessage = 
                `🎉 Welcome to Fall Detection Alert System!\n\n` +
                `Hello @${cleanUsername},\n\n` +
                `You have been successfully registered as a caregiver.\n` +
                `Device ID: ${deviceId}\n` +
                `Email: ${email}\n\n` +
                `Important: If you haven't started the bot yet, please:\n` +
                `1. Search for @${process.env.BOT_USERNAME}\n` +
                `2. Click "Start" or send /start\n` +
                `3. You'll then receive fall detection alerts!`;

            await sendTelegramMessage(cleanUsername, welcomeMessage);
            res.status(201).json({
                success: true,
                message: 'Caregiver registered successfully',
                telegramStatus: 'Welcome message sent'
            });
        } catch (telegramError) {
            // Registration successful but Telegram message failed
            res.status(201).json({
                success: true,
                message: 'Caregiver registered successfully',
                telegramStatus: 'Please start the bot to receive messages',
                telegramInstructions: `Search for @${process.env.BOT_USERNAME} on Telegram and click Start`
            });
        }
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            success: false,
            error: 'Error registering caregiver',
            details: err.message
        });
    }
});

// Get all caregivers
router.get('/', async (req, res) => {
    try {
        const caregivers = await Caregiver.find();
        res.json(caregivers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching caregivers' });
    }
});

module.exports = router;