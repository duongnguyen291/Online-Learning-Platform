const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    EnrollmentCode :{
        type: String,
        required: true,
    },
    UserCode :{
        type: String,
        required: true,
    },
    StartDate:{
        type: Date,
        required: true,
    },
    CourseCode :{
        type: String,
        required: true,
    },
    Progress :{
        type: String,
        required: true,
    },
    Score :{
        type: Number,
        required: true,
    },
}, {versionKey: false})

const Enrollment = new mongoose.model('Enrollment', enrollmentSchema, 'Enrollment');

module.exports = Enrollment;