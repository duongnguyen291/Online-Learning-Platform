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
    Status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started'
    },
    Progress: {
        type: Number,  // Percentage of completion
        default: 0,
        min: 0,
        max: 100
    },
    TimeSpent: {
        type: Number,  // Time spent in minutes
        default: 0
    },
    LastAccessed: {
        type: Date,
        default: Date.now
    },
    CompletedAt: Date,
    Notes: String
}, { timestamps: true, versionKey: false });

// Compound index for efficient queries
userProgressSchema.index({ UserCode: 1, CourseCode: 1 }, { unique: true });

const UserProgress = mongoose.model("UserProgress", userProgressSchema, 'UserProgress');
module.exports = UserProgress; 