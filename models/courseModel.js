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
    Description: {
        type: String,
        required: true,
    },
    Lecturer: {
        type: String,
        required: true,
    },
    RequiredRole: {
        type: String,
        required: true,
    },
    Status:{
        type: String,
        required: true,
    }
}, {versionKey: false})

const Course = new mongoose.model('Course', courseSchema, 'Course');

module.exports = Course;