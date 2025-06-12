const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    UserCode: {
        type: String,
        ref: 'User',
        required: true
    },
    CourseCode: {
        type: String,
        ref: 'Course',
        required: true
    },
    status: {
        type: String,
        enum: [ 'in_progress', 'completed'],
        default: 'in_progress'
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
}, { versionKey: false });

// Compound index for efficient queries
userProgressSchema.index({ UserCode: 1, CourseCode: 1 }, { unique: true });

const UserProgress = mongoose.model("UserProgress", userProgressSchema, 'UserProgress');
module.exports = UserProgress; 