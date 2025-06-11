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

const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Enrollment = require("../models/enrollmentModel");
const PendingRegistration = require("../models/pendingRegistratioModel");

const register = async (req, res) => {
  const { userCode, name, role, DOB, login, password } = req.body;
  
  try {
    // Validate role
    if (!['Student', 'Lecturer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Only Student and Lecturer roles are allowed."
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ Login: login });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate a unique UserCode if not provided
    let finalUserCode = userCode;
    if (!finalUserCode) {
      const prefix = role === 'Student' ? 'STU' : 'LEC';
      const random = Math.floor(1000 + Math.random() * 9000);
      finalUserCode = `${prefix}${random}`;
    }

    // Create the user directly
    const user = await User.create({
      UserCode: finalUserCode,
      Name: name,
      Role: role,
      DOB: DOB,
      Login: login,
      Password: password
    });

    return res.status(201).json({
      success: true,
      user,
      message: "Registration successful! You can now log in.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  const { login, password, role } = req.body;
  try {
    const user = await User.findOne({ Login: login });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not Exist. Please Sign Up",
      });
    }
    const isValidPassword = await(password === user.Password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Check if the user's role matches the requested role
    if (role && user.Role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This account is not a ${role} account.`,
      });
    }

    // Send user info to be stored in localStorage on client side
    return res.status(200).json({
      success: true,
      user: {
        login,
        password,
        userCode: user.UserCode,
        name: user.Name,
        role: user.Role
      },
      message: "Login Successful",
    });
  } catch (error) {
    console.log("Some error occurred", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    // No need to delete server-side files anymore
    // Client will clear localStorage

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.log("Error during logout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const getCourses = async (req, res) => {
  try {
    // Get user info from request
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - No user ID provided" });
    }

    // Find all enrollments for this user
    const enrollments = await Enrollment.find({ UserCode: userId });
    
    // Extract all course codes from enrollments
    const courseCodes = enrollments.map(enrollment => enrollment.CourseCode);

    // Find all courses that match these course codes
    const courses = await Course.find({ CourseCode: { $in: courseCodes } });

    // Combine course data with enrollment data
    const coursesWithProgress = courses.map(course => {
      const enrollment = enrollments.find(e => e.CourseCode === course.CourseCode);
      return {
        courseCode: course.CourseCode,
        name: course.Name,
        lecturer: course.Lecturer,
        status: course.Status,
        progress: enrollment.Progress,
        score: enrollment.Score,
        enrollmentDate: enrollment.StartDate
      };
    });

    return res.status(200).json({
      success: true,
      courses: coursesWithProgress,
      message: "Fetched enrolled courses successfully",
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    // Get user info from request
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - No user ID provided" });
    }

    const user = await User.findOne({ UserCode: userId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    return res.status(200).json({
      success: true,
      user,
      message: "Profile fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const pendingRegistration = async (req, res) => {
  const { UserCode, Name, Role, DOB, Login, Password } = req.body;
  
  try {
    // Validate role is Lecturer
    if (Role !== 'Lecturer') {
      return res.status(400).json({
        success: false,
        message: "Only Lecturer registrations can be pending. Students can register directly."
      });
    }

    // Check if user already exists in Users collection
    const existingUser = await User.findOne({ Login });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Check if there's already a pending registration
    const existingPending = await PendingRegistration.findOne({ Login });
    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: "A registration request for this email is already pending",
      });
    }

    // Create pending registration
    const pendingReg = await PendingRegistration.create({
      UserCode,
      Name,
      Role,
      DOB,
      Login,
      Password,
      Status: 'pending'
    });

    return res.status(201).json({
      success: true,
      pendingRegistration: pendingReg,
      message: "Registration request submitted successfully. Please wait for admin approval.",
    });
  } catch (error) {
    console.error("Pending registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { 
  register, 
  loginUser, 
  logoutUser, 
  getCourses, 
  getProfile,
  pendingRegistration
};
