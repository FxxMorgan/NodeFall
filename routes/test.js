const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/email');
const { sendTelegramMessage } = require('../utils/telegramHelper');

// Test email
router.post('/email', async (req, res) => {
    const { to, subject, text } = req.body;
    
    if (!to || !subject || !text) {
        return res.status(400).json({
            error: 'Missing required fields: to, subject, and text are required'
        });
    }

    try {
        await sendEmail(to, subject, text);
        res.json({ 
            success: true,
            message: 'Test email sent successfully',
            recipient: to
        });
    } catch (error) {
        console.error('Email test error:', error);
        res.status(500).json({ 
            error: 'Error sending test email',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Test Telegram
router.post('/telegram', async (req, res) => {
    const { chatId, text } = req.body;
    
    if (!chatId || !text) {
        return res.status(400).json({
            error: 'Missing required fields: chatId and text are required'
        });
    }

    try {
        await sendTelegramMessage(chatId, text);
        res.json({ 
            success: true,
            message: 'Test Telegram message sent successfully',
            recipient: chatId
        });
    } catch (error) {
        console.error('Telegram test error:', error);
        res.status(500).json({ 
            error: 'Error sending test Telegram message',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Test health check
router.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;