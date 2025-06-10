const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// All routes are public
router.get('/courses', courseController.getAllCourses);
router.get('/courses/:courseCode', courseController.getCourseById);
router.get('/courses/category/:category', courseController.getCoursesByCategory);
router.get('/enrollment-status/:courseCode', courseController.checkEnrollmentStatus);
router.post('/enroll/:courseCode', courseController.enrollInCourse);

module.exports = router; 