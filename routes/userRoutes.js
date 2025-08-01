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
  register,
  loginUser, 
  logoutUser, 
  getCourses, 
  getProfile,
  pendingRegistration,
  getUserProgress,
  getChaptersByCourse
} = require('../controllers/userController');
const { isStudent, isLecturer } = require('../middlewares/authMiddleware');
const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/pending-registration', pendingRegistration);
userRouter.get('/my-courses', isStudent, getCourses);
userRouter.get('/profile', isStudent, getProfile);
userRouter.get('/progress', getUserProgress);
userRouter.get('/chapters', getChaptersByCourse);

// Lecturer routes - could be moved to a separate router if needed
userRouter.get('/lecturer/profile', isLecturer, getProfile);

module.exports = userRouter;