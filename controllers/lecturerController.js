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

const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');
const User = require('../models/userModel');

// Get all courses taught by a specific lecturer
const getLecturerCourses = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No lecturer ID provided"
      });
    }

    // Find the lecturer
    const lecturer = await User.findOne({ UserCode: userId, Role: 'Lecturer' });
    
    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found"
      });
    }

    // Find all courses taught by this lecturer
    const courses = await Course.find({ Lecturer: lecturer.UserCode });

    // For each course, find enrollment count
    const coursesWithEnrollment = await Promise.all(courses.map(async (course) => {
      const enrollments = await Enrollment.find({ CourseCode: course.CourseCode });
      return {
        ...course.toObject(),
        enrollmentCount: enrollments.length
      };
    }));

    return res.status(200).json({
      success: true,
      courses: coursesWithEnrollment,
      message: "Courses fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching lecturer courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No lecturer ID provided"
      });
    }

    // Find the lecturer
    const lecturer = await User.findOne({ UserCode: userId, Role: 'Lecturer' });
    
    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found"
      });
    }

    let courseCode;
    
    // Check if manual course code is provided
    if (req.body.useManualCourseCode && req.body.CourseCode) {
      // Validate the provided course code
      if (!/^[A-Za-z0-9]+$/.test(req.body.CourseCode)) {
        return res.status(400).json({
          success: false,
          message: "Course code must contain only letters and numbers"
        });
      }
      
      // Check if the course code is already in use
      const existingCourse = await Course.findOne({ CourseCode: req.body.CourseCode });
      
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: "Course code already in use. Please choose a different code."
        });
      }
      
      courseCode = req.body.CourseCode;
    } else {
      // Generate a unique course code based on category and timestamp
      let category = req.body.category || 'GEN';
      category = category.substring(0, 3).toUpperCase();
      const timestamp = Date.now().toString().substring(8, 13);
      courseCode = `${category}${timestamp}`;
    }

    // Create the course
    const courseData = {
      ...req.body,
      CourseCode: courseCode,
      Lecturer: lecturer.UserCode
    };
    
    // Remove helper fields that aren't part of the schema
    delete courseData.useManualCourseCode;

    const course = await Course.create(courseData);

    return res.status(201).json({
      success: true,
      course,
      message: "Course created successfully"
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// Update an existing course
const updateCourse = async (req, res) => {
  try {
    const { userId } = req.query;
    const { courseId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No lecturer ID provided"
      });
    }

    // Find the lecturer
    const lecturer = await User.findOne({ UserCode: userId, Role: 'Lecturer' });
    
    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found"
      });
    }

    // Find the course
    const course = await Course.findOne({ CourseCode: courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if the lecturer owns this course
    if (course.Lecturer !== lecturer.UserCode) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this course"
      });
    }

    // Update the course
    const updatedCourse = await Course.findOneAndUpdate(
      { CourseCode: courseId },
      req.body,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      course: updatedCourse,
      message: "Course updated successfully"
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const { userId } = req.query;
    const { courseId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No lecturer ID provided"
      });
    }

    // Find the lecturer
    const lecturer = await User.findOne({ UserCode: userId, Role: 'Lecturer' });
    
    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found"
      });
    }

    // Find the course
    const course = await Course.findOne({ CourseCode: courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if the lecturer owns this course
    if (course.Lecturer !== lecturer.UserCode) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this course"
      });
    }

    // Delete the course
    await Course.findOneAndDelete({ CourseCode: courseId });

    // Delete all enrollments for this course
    await Enrollment.deleteMany({ CourseCode: courseId });

    return res.status(200).json({
      success: true,
      message: "Course and related enrollments deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const { userId } = req.query;
    const { courseId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No lecturer ID provided"
      });
    }

    // Find the lecturer
    const lecturer = await User.findOne({ UserCode: userId, Role: 'Lecturer' });
    
    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found"
      });
    }

    // Find the course
    const course = await Course.findOne({ CourseCode: courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if the lecturer owns this course
    if (course.Lecturer !== lecturer.UserCode) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this course"
      });
    }

    return res.status(200).json({
      success: true,
      course,
      message: "Course fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// Get enrolled students for a course
const getEnrolledStudents = async (req, res) => {
  try {
    const { userId } = req.query;
    const { courseId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No lecturer ID provided"
      });
    }

    // Find the lecturer
    const lecturer = await User.findOne({ UserCode: userId, Role: 'Lecturer' });
    
    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found"
      });
    }

    // Find the course
    const course = await Course.findOne({ CourseCode: courseId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if the lecturer owns this course
    if (course.Lecturer !== lecturer.UserCode) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this course's data"
      });
    }

    // Find all enrollments for this course
    const enrollments = await Enrollment.find({ CourseCode: courseId });
    
    // Get student details for each enrollment
    const enrolledStudents = await Promise.all(
      enrollments.map(async (enrollment) => {
        const student = await User.findOne({ UserCode: enrollment.UserCode })
          .select('UserCode Name Email Role');
          
        return {
          enrollment: {
            enrollmentCode: enrollment.EnrollmentCode,
            startDate: enrollment.StartDate,
            progress: enrollment.Progress,
            score: enrollment.Score
          },
          student: student ? {
            userCode: student.UserCode,
            name: student.Name,
            email: student.Email,
            role: student.Role
          } : { userCode: enrollment.UserCode, name: 'Unknown Student' }
        };
      })
    );

    return res.status(200).json({
      success: true,
      enrolledStudents,
      totalStudents: enrolledStudents.length,
      message: "Enrolled students fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = {
  getLecturerCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  getEnrolledStudents
}; 