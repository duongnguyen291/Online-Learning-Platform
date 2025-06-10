const mongoose = require('mongoose');

const userKnowledgeSchema = new mongoose.Schema({
    UserCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documents: [{
        title: {
            type: String,
            required: true
        },
        fileHash: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required: true
        },
        uploadDate: {
            type: Date,
            default: Date.now
        },
        metadata: {
            type: Map,
            of: String
        }
    }],
    learningPreferences: {
        interests: [String],
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        },
        preferredLearningStyle: {
            type: String,
            enum: ['visual', 'auditory', 'reading', 'kinesthetic'],
            default: 'visual'
        },
        availableTimePerWeek: {
            type: Number,
            default: 10
        },
        goals: [String]
    },
    learningHistory: [{
        CourseCode: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        progress: {
            type: Number,
            default: 0
        },
        startDate: Date,
        completionDate: Date,
        performance: {
            type: Number,
            min: 0,
            max: 100
        }
    }]
}, {
    timestamps: true
});

// Sửa index để match với tên field mới
userKnowledgeSchema.index({ UserCode: 1 }, { unique: true });  // Thay vì userId

const UserKnowledge = mongoose.model('UserKnowledge', userKnowledgeSchema);
module.exports = UserKnowledge; 