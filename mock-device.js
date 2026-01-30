const axios = require('axios');

// Install axios first:
// npm install axios

class MockESP32 {
    constructor(deviceId, serverUrl) {
        this.deviceId = deviceId;
        this.serverUrl = serverUrl;
        this.isRunning = false;
    }

    // Simulate accelerometer readings
    async readAccelerometer() {
        // Generate random acceleration values
        const ax = Math.random() * 2 - 1;
        const ay = Math.random() * 2 - 1;
        const az = Math.random() * 2 - 1;
        return { ax, ay, az };
    }

    // Simulate fall detection algorithm
    isFallDetected(acceleration) {
        const totalAccel = Math.sqrt(
            Math.pow(acceleration.ax, 2) + 
            Math.pow(acceleration.ay, 2) + 
            Math.pow(acceleration.az, 2)
        );
        
        // Simulate fall detection threshold
        return totalAccel > 1.8;
    }

    // Simulate GPS location
    getGPSLocation() {
        // Return mock GPS coordinates
        return {
            latitude: 40.7128 + (Math.random() * 0.01),
            longitude: -74.0060 + (Math.random() * 0.01)
        };
    }

    async sendAlert() {
        try {
            const location = this.getGPSLocation();
            await axios.post(`${this.serverUrl}/alert`, {
                deviceId: this.deviceId,
                ...location
            });
            console.log('Alert sent successfully');
        } catch (error) {
            console.error('Error sending alert:', error.message);
        }
    }

    async start() {
        this.isRunning = true;
        console.log(`Mock ESP32 device ${this.deviceId} started`);

        while (this.isRunning) {
            const acceleration = await this.readAccelerometer();
            
            if (this.isFallDetected(acceleration)) {
                console.log('Fall detected!');
                await this.sendAlert();
            }

            // Wait for 1 second before next reading
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    stop() {
        this.isRunning = false;
        console.log(`Mock ESP32 device ${this.deviceId} stopped`);
    }
}

// Create and start a mock device
const device = new MockESP32('ESP32_001', 'http://localhost:3000');
device.start();