const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');
const mongoose = require('mongoose');

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ Status: 'Active' }).select('-__v');
        
        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message
        });
    }
};

// Get course by ID or courseCode
exports.getCourseById = async (req, res) => {
    try {
        const { courseCode } = req.params;
        
        // Try to find by CourseCode first
        let course = await Course.findOne({ CourseCode: courseCode }).select('-__v');

        // If not found and it looks like an ObjectId, try finding by ID (for backward compatibility)
        if (!course && courseCode.match(/^[0-9a-fA-F]{24}$/)) {
            course = await Course.findById(courseCode).select('-__v');
        }

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Format the course data to match frontend expectations
        const formattedCourse = {
            _id: course._id,
            courseCode: course.CourseCode,
            title: course.Name,
            description: course.Description,
            image: course.image,
            category: course.category,
            lecturer: course.Lecturer,
            sections: parseInt(course.chapters) || 0,
            lectures: parseInt(course.Lessons) || 0,
            totalLength: course.totalLength,
            language: course.language,
            rating: course.rating,
            reviews: course.reviews,
            originalPrice: course.originalPrice,
            discountedPrice: course.discountedPrice,
            certification: course.certification,
            whoFor: course.whoFor,
            whatLearn: course.whatLearn
        };

        res.status(200).json({
            success: true,
            course: formattedCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching course',
            error: error.message
        });
    }
};

// Get courses by category
exports.getCoursesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const excludeCode = req.query.exclude;

        const query = { 
            category, 
            Status: 'Active',
        };

        // Handle exclusion by courseCode or ID
        if (excludeCode) {
            if (excludeCode.match(/^[0-9a-fA-F]{24}$/)) {
                // If it looks like an ObjectId, exclude by ID
                query._id = { $ne: excludeCode };
            } else {
                // Otherwise exclude by CourseCode
                query.CourseCode = { $ne: excludeCode };
            }
        }

        const courses = await Course.find(query)
            .select('-__v')
            .limit(3); // Limit to 3 similar courses

        // Format the courses data to match frontend expectations
        const formattedCourses = courses.map(course => ({
            _id: course._id,
            courseCode: course.CourseCode,
            Name: course.Name,
            shortDescription: course.Description.substring(0, 100) + '...',
            image: course.image,
            category: course.category,
            rating: course.rating,
            reviews: course.reviews,
            originalPrice: course.originalPrice,
            discountedPrice: course.discountedPrice
        }));

        res.status(200).json({
            success: true,
            courses: formattedCourses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching courses by category',
            error: error.message
        });
    }
};

// Check enrollment status
exports.checkEnrollmentStatus = async (req, res) => {
    try {
        const { courseCode } = req.params;
        
        // Get user ID from query parameter or cookie
        const userId = req.query.userId || req.cookies.userId;
        
        if (!userId) {
            return res.status(200).json({
                success: true,
                status: null,
                message: 'User not logged in'
            });
        }

        // First try to find by CourseCode directly
        let enrollment = await Enrollment.findOne({
            CourseCode: courseCode,
            UserCode: userId
        });

        // If not found and courseCode looks like an ObjectId, try to find the course and then check enrollment
        if (!enrollment && courseCode.match(/^[0-9a-fA-F]{24}$/)) {
            const course = await Course.findById(courseCode);
            if (course) {
                enrollment = await Enrollment.findOne({
                    CourseCode: course.CourseCode,
                    UserCode: userId
                });
            }
        }

        let status = null;
        let progressCode = null;
        
        if (enrollment) {
            // If Progress starts with 'C' it's an active enrollment with a chapter code
            if (enrollment.Progress && enrollment.Progress.startsWith('C')) {
                status = 'enrolled';
                progressCode = enrollment.Progress;
            } else if (enrollment.Progress === 'Pending') {
                status = 'pending';
            } else {
                status = 'enrolled';
            }
        }

        res.status(200).json({
            success: true,
            status,
            progressCode,
            score: enrollment?.Score || 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking enrollment status',
            error: error.message
        });
    }
};

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
    try {
        const { courseCode } = req.params;
        
        // Get user ID from request body, query parameter, or cookie
        const userId = req.body.userId || req.query.userId || req.cookies.userId;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required to enroll'
            });
        }

        // Find the course to get the CourseCode
        let finalCourseCode = courseCode;
        
        // If courseCode looks like an ObjectId, try to find the course to get its CourseCode
        if (courseCode.match(/^[0-9a-fA-F]{24}$/)) {
            const course = await Course.findById(courseCode);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }
            finalCourseCode = course.CourseCode;
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            CourseCode: finalCourseCode,
            UserCode: userId
        });

        if (existingEnrollment) {
            return res.status(200).json({
                success: true,
                message: 'Already enrolled in this course',
                enrollment: existingEnrollment
            });
        }

        // Create new enrollment
        const newEnrollment = new Enrollment({
            CourseCode: finalCourseCode,
            UserCode: userId,
            Progress: 'C01 LSE1001', // Default to first chapter, first lesson
            Score: 0,
            Status: 'Active'
        });

        await newEnrollment.save();

        res.status(201).json({
            success: true,
            message: 'Successfully enrolled in course',
            enrollment: newEnrollment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error enrolling in course',
            error: error.message
        });
    }
}; 