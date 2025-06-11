const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userCode: {
        type: String,
        ref: 'User',
        required: true
    },
    courseCode: {
        type: String,
        ref: 'Course',
        required: true
    },
    status: {
        type: String,
        enum: ['enrolled', 'in_progress', 'completed'],
        default: 'enrolled'
    },
    progress: {
        type: Number,  // Percentage of completion
        default: 0,
        min: 0,
        max: 100
    },
    timeSpent: {
        type: Number,  // Time spent in minutes
        default: 0
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    notes: String
}, { timestamps: true, versionKey: false });

// Compound index for efficient queries
userProgressSchema.index({ userCode: 1, courseCode: 1 }, { unique: true });

const UserProgress = mongoose.model("UserProgress", userProgressSchema, 'UserProgress');
module.exports = UserProgress; 