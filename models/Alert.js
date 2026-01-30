const { Schema, model } = require('mongoose');

const AlertSchema = new Schema({
    deviceId: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Alert = model('Alert', AlertSchema);

module.exports = Alert;