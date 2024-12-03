const axios = require('axios');
require('dotenv').config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const registrationLink = "http://localhost:3000/register.html";
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
        }
    } catch (error) {
        console.error('Error initializing lastUpdateId:', error.message);
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
    if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        console.log(`Received message: ${text} from chat ID: ${chatId}`);

        if (text === '/start') {
            const welcomeMessage = `Welcome to Fall Detection Alert System! 👋\n\nYour chat ID is: <code>${chatId}</code>\n\nPlease register using the following link: ${registrationLink}`;
            await sendTelegramMessage(chatId, welcomeMessage);
        } else if (text === '/myid') {
            const idMessage = `Your chat ID is: <code>${chatId}</code>`;
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
