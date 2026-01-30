const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 
const { testBotConnection, getUpdatesAndHandleMessages } = require('./utils/telegramHelper');

const app = express();
const port = 3000;

// MongoDB connection URI
const uri = process.env.MONGO_URI;
mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('MongoDB connection error:', err);
   });

const Caregiver = require('./models/Caregiver');
const Alert = require('./models/Alert');
const testRoutes = require('./routes/test'); 
const adminRoutes = require('./routes/admin');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Routes
const caregiverRoutes = require('./routes/caregivers');
const alertRoutes = require('./routes/alerts');

app.use('/caregivers', caregiverRoutes);
app.use('/alerts', alertRoutes);
app.use('/test', testRoutes);
app.use('/admin', adminRoutes);

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});