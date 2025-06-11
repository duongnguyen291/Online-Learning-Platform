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
const {
    collegeRegister, 
    collegeLogin, 
    findActiveUsers, 
    adminLogout,
    addCourse,
    editCourse,
    deleteCourse,
    getCourses,
    getProfile,
    updateProfile,
    getPendingRegistrations,
    handleRegistration
} = require('../controllers/adminController');


const adminRoutes = express.Router();

adminRoutes.post('/admin-login', collegeLogin);
adminRoutes.post('/admin-register', collegeRegister);
adminRoutes.get('/find-active-users',  findActiveUsers);
adminRoutes.post('/logout',  adminLogout);
adminRoutes.post('/add-course', addCourse);
adminRoutes.put('/edit-course/:courseId',  editCourse);
adminRoutes.delete('/delete-course/:courseId',  deleteCourse);
adminRoutes.get('/courses',  getCourses);
adminRoutes.get('/profile',  getProfile);
adminRoutes.put('/profile',  updateProfile);
adminRoutes.get('/pending-registrations', getPendingRegistrations);
adminRoutes.post('/handle-registration', handleRegistration);

module.exports = adminRoutes;