const express = require('express');
const router = express.Router();
const Caregiver = require('../models/Caregiver');
const { sendTelegramMessage } = require('../utils/telegramHelper');

// Register a new caregiver
router.post('/register', async (req, res) => {
    try {
        const { email, phoneNumber, telegramChatId } = req.body;

        // Validate required fields
        if (!email || !phoneNumber || !telegramChatId) {
            return res.status(400).json({
                success: false,
                error: 'Email, phone number, and Telegram Chat ID are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Validate chat ID format (should be numeric)
        if (!/^[0-9]+$/.test(telegramChatId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Telegram Chat ID format'
            });
        }

        // Check if email already exists
        const existingCaregiver = await Caregiver.findOne({ email });
        if (existingCaregiver) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered'
            });
        }

        // Check if chat ID already exists
        const existingChatId = await Caregiver.findOne({ telegramUsername: telegramChatId });
        if (existingChatId) {
            return res.status(400).json({
                success: false,
                error: 'Telegram Chat ID already registered'
            });
        }

        // Generate next IDs
        const lastCaregiver = await Caregiver.findOne().sort({ caregiverId: -1 });
        const nextCaregiverId = lastCaregiver ? String(parseInt(lastCaregiver.caregiverId) + 1) : "1";
        
        const lastDevice = await Caregiver.findOne().sort({ deviceId: -1 });
        const nextDeviceId = lastDevice ? String(parseInt(lastDevice.deviceId) + 1) : "1";

        // Create new caregiver
        const newCaregiver = new Caregiver({
            caregiverId: nextCaregiverId,
            email,
            deviceId: nextDeviceId,
            phoneNumber,
            telegramUsername: telegramChatId, // Store chat ID in telegramUsername field
            notificationPreferences: {
                email: true,
                telegram: true
            },
            active: true
        });

        await newCaregiver.save();

        // Send welcome message via Telegram
        let telegramStatus = '';
        try {
            const welcomeMessage = `🎉 ¡Bienvenido al Sistema de Detección de Caídas!

👤 ID de Cuidador: ${nextCaregiverId}
📱 ID de Dispositivo: ${nextDeviceId}
📧 Email: ${email}
📞 Teléfono: ${phoneNumber}

✅ Tu registro ha sido completado exitosamente.
🚨 Ahora recibirás alertas de emergencia cuando se detecten caídas.

Para cualquier consulta, responde a este mensaje.`;
            
            await sendTelegramMessage(telegramChatId, welcomeMessage);
            telegramStatus = 'Mensaje de bienvenida enviado por Telegram ✅';
        } catch (telegramError) {
            console.error('Telegram notification error:', telegramError);
            telegramStatus = 'Error al enviar mensaje de Telegram. Verifica tu Chat ID.';
        }

        console.log(`New caregiver registered: ${nextCaregiverId}, Device: ${nextDeviceId}`);

        res.status(201).json({
            success: true,
            message: 'Caregiver registered successfully',
            caregiverId: nextCaregiverId,
            deviceId: nextDeviceId,
            telegramStatus
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during registration'
        });
    }
});

// Admin route to add caregiver to existing device
router.post('/admin/add', async (req, res) => {
    try {
        const { email, phoneNumber, telegramChatId, deviceId } = req.body;

        // Validate required fields
        if (!email || !phoneNumber || !telegramChatId || !deviceId) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Check if email already exists
        const existingCaregiver = await Caregiver.findOne({ email });
        if (existingCaregiver) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered'
            });
        }

        // Check if device exists
        const deviceExists = await Caregiver.findOne({ deviceId });
        if (!deviceExists) {
            return res.status(400).json({
                success: false,
                error: 'Device ID does not exist'
            });
        }

        // Generate next caregiver ID
        const lastCaregiver = await Caregiver.findOne().sort({ caregiverId: -1 });
        const nextCaregiverId = lastCaregiver ? String(parseInt(lastCaregiver.caregiverId) + 1) : "1";

        // Create new caregiver
        const newCaregiver = new Caregiver({
            caregiverId: nextCaregiverId,
            email,
            deviceId, // Use existing device ID
            phoneNumber,
            telegramUsername: telegramChatId,
            notificationPreferences: {
                email: true,
                telegram: true
            },
            active: true
        });

        await newCaregiver.save();

        // Send welcome message
        try {
            const deviceCaregivers = await Caregiver.countDocuments({ deviceId });
            const welcomeMessage = `🎉 ¡Bienvenido al Sistema de Detección de Caídas!

👤 ID de Cuidador: ${nextCaregiverId}
📱 ID de Dispositivo: ${deviceId} (Compartido)
📧 Email: ${email}
📞 Teléfono: ${phoneNumber}

✅ Has sido agregado como cuidador adicional.
👥 Total de cuidadores para este dispositivo: ${deviceCaregivers}
🚨 Recibirás alertas junto con los otros cuidadores.`;
            
            await sendTelegramMessage(telegramChatId, welcomeMessage);
        } catch (telegramError) {
            console.error('Telegram notification error:', telegramError);
        }

        console.log(`Caregiver ${nextCaregiverId} added to existing device ${deviceId}`);

        res.status(201).json({
            success: true,
            message: 'Caregiver added to device successfully',
            caregiverId: nextCaregiverId,
            deviceId
        });

    } catch (error) {
        console.error('Admin add caregiver error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
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

// Update caregiver
router.put('/:id', async (req, res) => {
    try {
        const { email, phoneNumber, telegramUsername, deviceId } = req.body;

        const updatedCaregiver = await Caregiver.findByIdAndUpdate(
            req.params.id,
            { email, phoneNumber, telegramUsername, deviceId },
            { new: true }
        );

        if (!updatedCaregiver) {
            return res.status(404).json({
                success: false,
                error: 'Caregiver not found'
            });
        }

        res.json({
            success: true,
            message: 'Caregiver updated successfully',
            caregiver: updatedCaregiver
        });

    } catch (error) {
        console.error('Update caregiver error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Delete caregiver
router.delete('/:id', async (req, res) => {
    try {
        const deletedCaregiver = await Caregiver.findByIdAndDelete(req.params.id);

        if (!deletedCaregiver) {
            return res.status(404).json({
                success: false,
                error: 'Caregiver not found'
            });
        }

        res.json({
            success: true,
            message: 'Caregiver deleted successfully'
        });

    } catch (error) {
        console.error('Delete caregiver error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

module.exports = router;