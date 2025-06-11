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

const fs = require('fs');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Course = require('../models/courseModel');
const PendingRegistration = require('../models/pendingRegistratioModel');

const collegeRegister = async(req,res)=>{
    const {Name, Login, DOB, Password, Role}=req.body;
    try{
        const existingAdmin = await Admin.findOne({Login});
        
        if(existingAdmin){
            return res.status(409).json({
                success:false,
                message:"Admin already exists"
            })
        }

        // Generate unique UserCode
        const userCode = 'ADMIN' + Math.floor(1000 + Math.random() * 9000);

        const admin = await Admin.create({
            UserCode: userCode,
            Name,
            Login,
            DOB,
            Password,
            Role: Role || 'Admin'
        })

        return res.status(201).json({
            success:true,
            admin,
            message:"Admin registered successfully"
        })

    }
    catch(error){
        console.error("Registration error:", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}

const collegeLogin = async (req, res) => {

    const { login, password, role } =  req.body;
    console.log(login, password);
    try {
      const admin = await Admin.findOne({ Login: login });
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "User does not exist. Please Sign Up",
        });
      }
      
      const isValidPassword = await(password === admin.Password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      // Check if the requested role is 'admin'
      if (role && role.toLowerCase() !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied. This endpoint is for admin accounts only.",
        });
      }
  
      // Return admin info to be stored in localStorage on client side
      return res.status(200).json({
        success: true,
        admin: {
          userCode: admin.UserCode,
          name: admin.Name,
          login: admin.Login,
          dob: admin.DOB,
          role: admin.Role,
          password: admin.Password, // Include password for localStorage
          isLoggedIn: true
        },
        message: "Login Successful",
      });
    } catch (error) {
      console.log("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
};

const adminLogout = async (req, res) => {
    try {
        // No need to delete files, client will handle clearing localStorage
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

const findActiveUsers = async (req, res) => {
    try {
        const activeUsers = await User.find({ Status: 'active' });
        return res.status(200).json({
            success: true,
            activeUsers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const addCourse = async (req, res) => {
    const { CourseCode, Name, Description, Lecturer, RequiredRole, Status } = req.body;
    
    try {
        // Check if course already exists
        const existingCourse = await Course.findOne({ CourseCode });
        if (existingCourse) {
            return res.status(409).json({
                success: false,
                message: "Course with this code already exists"
            });
        }

        // Create new course
        const course = await Course.create({
            CourseCode,
            Name,
            Description,
            Lecturer,
            RequiredRole,
            Status
        });

        return res.status(201).json({
            success: true,
            course,
            message: "Course created successfully"
        });
    } catch (error) {
        console.error("Error adding course:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const editCourse = async (req, res) => {
    const { courseId } = req.params;
    const updateData = req.body;
    
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Update course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updateData,
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

const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Delete course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting course:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json({ success: true, courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ success: false, message: "Failed to fetch courses" });
    }
};

const getProfile = async (req, res) => {
    try {
      // Get login from request - check both query params and body
      const login = req.query.login || req.body.login;
      console.log('Profile request login:', login);
      
      if (!login) {
        return res.status(401).json({ 
          success: false, 
          message: "Unauthorized - No login provided" 
        });
      }
  
      const admin = await Admin.findOne({ Login: login });
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin profile not found"
        });
      }

      return res.status(200).json({
        success: true,
        admin: {
          userCode: admin.UserCode,
          name: admin.Name,
          login: admin.Login,
          dob: admin.DOB,
          role: admin.Role
        },
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

const updateProfile = async (req, res) => {
    try {
        // Get login from request
        const { currentLogin } = req.query;
        
        if (!currentLogin) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized - No login provided" 
            });
        }

        const admin = await Admin.findOne({ Login: currentLogin });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin profile not found"
            });
        }

        const { Name, Login: newLogin, DOB, currentPassword, newPassword } = req.body;

        // Verify current password if trying to change password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is required to change password"
                });
            }

            if (currentPassword !== admin.Password) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect"
                });
            }
        }

        // Update admin profile
        const updateData = {
            Name,
            Login: newLogin,
            DOB
        };

        if (newPassword) {
            updateData.Password = newPassword;
        }

        const updatedAdmin = await Admin.findOneAndUpdate(
            { Login: currentLogin },
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            admin: {
                userCode: updatedAdmin.UserCode,
                name: updatedAdmin.Name,
                login: updatedAdmin.Login,
                dob: updatedAdmin.DOB,
                role: updatedAdmin.Role,
                password: newPassword || admin.Password,
                isLoggedIn: true
            },
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getPendingRegistrations = async (req, res) => {
    try {
        const pendingRegistrations = await PendingRegistration.find({ Status: 'pending' });
        return res.status(200).json({
            success: true,
            pendingRegistrations
        });
    } catch (error) {
        console.error('Error fetching pending registrations:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const handleRegistration = async (req, res) => {
    const { registrationId, action } = req.body;

    try {
        const registration = await PendingRegistration.findById(registrationId);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }

        if (action === 'approve') {
            // Create new user from pending registration
            const newUser = await User.create({
                UserCode: registration.UserCode,
                Name: registration.Name,
                Role: registration.Role,
                DOB: registration.DOB,
                Login: registration.Login,
                Password: registration.Password,
                Status: 'active'
            });

            // Update registration status
            registration.Status = 'approved';
            await registration.save();

            return res.status(200).json({
                success: true,
                message: "Registration approved successfully",
                user: newUser
            });
        } else if (action === 'reject') {
            // Update registration status to rejected
            registration.Status = 'rejected';
            await registration.save();

            return res.status(200).json({
                success: true,
                message: "Registration rejected successfully"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid action"
            });
        }
    } catch (error) {
        console.error('Error handling registration:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
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
};