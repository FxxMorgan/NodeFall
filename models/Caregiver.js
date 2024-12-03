const mongoose = require('mongoose');
const validator = require('validator');

const caregiverSchema = new mongoose.Schema({
    caregiverId: { 
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    deviceId: { 
        type: String, 
        required: true,
        trim: true
    },
    phoneNumber: { 
        type: String, 
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\+?[\d\s-]{8,}$/.test(v);
            },
            message: 'Invalid phone number format'
        }
    },
    telegramUsername: { 
        type: String, 
        required: true,
        trim: true
    },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        telegram: { type: Boolean, default: true }
    },
    lastNotified: Date,
    active: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true
});

// Index for faster queries
caregiverSchema.index({ deviceId: 1, active: 1 });

const Caregiver = mongoose.model('Caregiver', caregiverSchema);

module.exports = Caregiver;