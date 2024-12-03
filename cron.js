const { testBotConnection, getUpdatesAndHandleMessages } = require('./utils/telegramHelper');

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