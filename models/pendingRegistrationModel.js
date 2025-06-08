const mongoose = require('mongoose');

const pendingRegistrationSchema = new mongoose.Schema({
    UserCode: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    Login: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

const PendingRegistration = mongoose.model("PendingRegistration", pendingRegistrationSchema, 'PendingRegistration');
module.exports = PendingRegistration; 