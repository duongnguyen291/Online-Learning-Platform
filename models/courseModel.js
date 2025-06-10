const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number
    },
    image: {
        type: String
    },
    totalLength: {
        type: String
    },
    language: {
        type: String,
        default: "English"
    },
    Description: {
        type: String,
        required: true
    },
    certification: {
        type: String
    },
    whoFor: {
        type: String
    },
    whatLearn: [{
        type: String
    }],
    Lecturer: {
        type: String,
        default: ""
    },
    RequiredRole: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
    Lessons: {
        type: String,
        required: true
    },
    chapters: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: function() {
            if (this.RequiredRole === "Student") return 'beginner';
            if (this.RequiredRole === "Advanced") return 'advanced';
            return 'intermediate';
        }
    },
    topics: {
        type: [String],
        default: function() {
            return [this.category];
        }
    },
    prerequisites: {
        type: [String],
        default: []
    },
    estimatedHours: {
        type: Number,
        default: function() {
            if (this.totalLength) {
                const match = this.totalLength.match(/(\d+)h\s*(\d*)m?/);
                if (match) {
                    const hours = parseInt(match[1]) || 0;
                    const minutes = parseInt(match[2]) || 0;
                    return hours + minutes/60;
                }
            }
            return 0;
        }
    },
    learningStyle: {
        type: [String],
        enum: ['visual', 'auditory', 'reading', 'kinesthetic'],
        default: ['visual', 'reading']
    },
    objectives: [{
        type: String
    }]
}, {
    versionKey: false,
    timestamps: true
});

courseSchema.pre('save', function(next) {
    if (!this.difficulty) {
        if (this.RequiredRole === "Student") this.difficulty = 'beginner';
        else if (this.RequiredRole === "Advanced") this.difficulty = 'advanced';
        else this.difficulty = 'intermediate';
    }

    if (!this.topics || this.topics.length === 0) {
        this.topics = [this.category];
    }

    if (!this.estimatedHours && this.totalLength) {
        const match = this.totalLength.match(/(\d+)h\s*(\d*)m?/);
        if (match) {
            const hours = parseInt(match[1]) || 0;
            const minutes = parseInt(match[2]) || 0;
            this.estimatedHours = hours + minutes/60;
        }
    }

    next();
});

const Course = mongoose.model('Course', courseSchema, 'Course');

module.exports = Course;