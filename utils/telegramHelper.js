const axios = require('axios');
require('dotenv').config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const registrationLink = "https://arduino.morganscan.com/register.html";
let lastUpdateId = 0;

async function testBotConnection() {
    try {
        const response = await axios.get(`https://api.telegram.org/bot${botToken}/getMe`);
        console.log('Bot connected successfully:', response.data.result.username);
        return true;
    } catch (error) {
        console.error('Bot connection error:', error.message);
        return false;
    }
}

// Initialize lastUpdateId to the latest available update to avoid conflicts
async function initializeLastUpdateId() {
    try {
        const url = `https://api.telegram.org/bot${botToken}/getUpdates`;
        const response = await axios.get(url);

        if (response.data.ok && response.data.result.length > 0) {
            // Set lastUpdateId to the most recent update to avoid processing old messages
            lastUpdateId = response.data.result[response.data.result.length - 1].update_id;
            console.log(`Initialized lastUpdateId to ${lastUpdateId}`);
            
            // Clear all pending updates to avoid processing old messages
            await clearPendingUpdates();
        }
    } catch (error) {
        console.error('Error initializing lastUpdateId:', error.message);
    }
}

// Clear all pending updates by acknowledging them without processing
async function clearPendingUpdates() {
    try {
        const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}`;
        const response = await axios.get(url);
        
        if (response.data.ok && response.data.result.length > 0) {
            // Update lastUpdateId to the most recent one to skip all pending messages
            lastUpdateId = response.data.result[response.data.result.length - 1].update_id;
            console.log(`Cleared ${response.data.result.length} pending updates. New lastUpdateId: ${lastUpdateId}`);
        }
    } catch (error) {
        console.error('Error clearing pending updates:', error.message);
    }
}

async function sendTelegramMessage(chatId, text) {
    if (!botToken) {
        throw new Error('Telegram bot token not configured');
    }

    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: false
        });

        console.log('Message sent successfully to:', chatId);
        return response.data;
    } catch (error) {
        console.error('Telegram API Error:', error.response?.data || error.message);
        throw new Error(`Failed to send Telegram message: ${error.message}`);
    }
}

async function handleIncomingMessage(update) {
    if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text;
        const messageDate = update.message.date;
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Skip messages older than 30 seconds to avoid processing old messages
        if (currentTime - messageDate > 30) {
            console.log(`Skipping old message: ${text} from ${messageDate}`);
            return;
        }

        console.log(`Received message: ${text} from chat ID: ${chatId}`);

        if (text === '/start') {
            const welcomeMessage = `¡Bienvenido al Sistema de Alerta de Detección de Caídas! 👋\n\nTu ID de chat es: <code>${chatId}</code>\n\nPor favor regístrate usando el siguiente enlace: ${registrationLink}`;
            await sendTelegramMessage(chatId, welcomeMessage);
        } else if (text === '/myid') {
            const idMessage = `Tu ID de chat es: <code>${chatId}</code>`;
            await sendTelegramMessage(chatId, idMessage);
        }
    }
}

async function getUpdatesAndHandleMessages() {
    try {
        const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}`;
        const response = await axios.get(url);

        if (response.data.ok) {
            const updates = response.data.result;
            for (const update of updates) {
                await handleIncomingMessage(update);
                lastUpdateId = update.update_id; // Update the last processed update ID
            }
        }
    } catch (error) {
        // Only log if the error is not a 409 (conflict) to keep the console clean
        if (error.response?.status !== 409) {
            console.error('Error getting updates:', error.message);
        }
    }
}

module.exports = { 
    sendTelegramMessage,
    testBotConnection,
    getUpdatesAndHandleMessages
};

// Bot initialization
(async () => {
    const connected = await testBotConnection();
    if (connected) {
        await initializeLastUpdateId();
        console.log("Starting to listen for incoming messages...");
        setInterval(getUpdatesAndHandleMessages, 1000); // Call every second
    }
})();
