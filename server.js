const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { testBotConnection, getUpdatesAndHandleMessages } = require('./utils/telegramHelper');

const app = express();
const port = 3000;

// MongoDB connection URI
const uri = process.env.MONGODB_URI;
mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const Caregiver = require('./models/Caregiver');
const Alert = require('./models/Alert');
const testRoutes = require('./routes/test'); 

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Routes
const caregiverRoutes = require('./routes/caregivers');
const alertRoutes = require('./routes/alerts');

app.use('/caregivers', caregiverRoutes);
app.use('/alerts', alertRoutes);
app.use('/test', testRoutes);

// Example usage of sending a Telegram message
app.post('/send-telegram', async (req, res) => {
    const { telegramUsername, message } = req.body;
    try {
        const chatId = await getChatId(telegramUsername); // Get chat ID from username
        await sendTelegramMessage(chatId, message);
        res.json({ message: 'Telegram message sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error sending Telegram message', error: err.message });
    }
});

testBotConnection()
    .then(isConnected => {
        if (isConnected) {
            console.log('Telegram bot is configured and running');
            // Fetch updates every 5 seconds
            setInterval(() => {
                getUpdatesAndHandleMessages();
            }, 5000);
        } else {
            console.error('Failed to connect to Telegram bot');
        }
    });

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://20.206.250.144:${port}`);
});
