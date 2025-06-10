/*

Copyright 2024 Himanshu Dinkar

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const express = require('express');
const { getProfile } = require('../controllers/userController');
const { isLecturer } = require('../middlewares/authMiddleware');
const { 
  getLecturerCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  getCourseById,
  getEnrolledStudents 
} = require('../controllers/lecturerController');

const lecturerRouter = express.Router();

// Lecturer profile routes
lecturerRouter.get('/profile', isLecturer, getProfile);

// Lecturer course management routes
lecturerRouter.get('/lecturer-courses', isLecturer, getLecturerCourses);
lecturerRouter.get('/courses/:courseId', isLecturer, getCourseById);
lecturerRouter.get('/courses/:courseId/students', isLecturer, getEnrolledStudents);
lecturerRouter.post('/courses', isLecturer, createCourse);
lecturerRouter.put('/courses/:courseId', isLecturer, updateCourse);
lecturerRouter.delete('/courses/:courseId', isLecturer, deleteCourse);

module.exports = lecturerRouter; 