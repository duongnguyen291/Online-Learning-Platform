const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    CourseCode: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
    totalLength: {
        type: String,
        default: "0h 0m",
    },
    language: {
        type: String,
        default: 'English',
    },
    Description: {
        type: String,
        required: true,
    },
    certification: {
        type: String,
        default: '',
    },
    whoFor: {
        type: String,
        default: '',
    },
    whatLearn: {
        type: [String],
        default: [],
    },
    Lecturer: {
        type: String,
        default: '',
    },
    RequiredRole: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        required: true,
    },
    Lessons: {
        type: String,
        default: '0',
    },
    chapters: {
        type: String,
        default: '0',
    }
}, {versionKey: false})

// Add text index for search functionality
courseSchema.index({ Name: 'text', Description: 'text', category: 'text' });

const Course = mongoose.model('Course', courseSchema, 'Course');

module.exports = Course;