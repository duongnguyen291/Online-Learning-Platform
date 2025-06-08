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
const {readUsersFile, writeUsersFile, deleteUsersFile, initUsersFile} = require('../controllers/userCredetialController');
const User = require('../models/userModel');
const Course = require('../models/courseModel');
const PendingRegistration = require('../models/pendingRegistrationModel');

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
    const { login, password } =  req.body;
    try {
      if (await readUsersFile()) {
        return res.status(404).json({
          success: false,
          message: "Already signed in. Please Logout",
        });
      }
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
  
      await initUsersFile();
      await writeUsersFile(req.body);
  
      return res.status(200).json({
        success: true,
        admin: {
          UserCode: admin.UserCode,
          Name: admin.Name,
          Login: admin.Login,
          DOB: admin.DOB,
          Role: admin.Role
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
        await deleteUsersFile();
    
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

const getPendingRegistrations = async (req, res) => {
    try {
        const pendingRegistrations = await PendingRegistration.find({ Status: 'pending' });
        return res.status(200).json({
            success: true,
            pendingRegistrations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const handleRegistrationApproval = async (req, res) => {
    const { registrationId, action } = req.body;
    
    try {
        const registration = await PendingRegistration.findById(registrationId);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration request not found"
            });
        }

        if (action === 'approve') {
            // Create the user
            const user = await User.create({
                UserCode: registration.UserCode,
                Name: registration.Name,
                Role: registration.Role,
                DOB: registration.DOB,
                Login: registration.Login,
                Password: registration.Password
            });

            // Update registration status
            registration.Status = 'approved';
            await registration.save();

            return res.status(200).json({
                success: true,
                message: "Registration approved successfully",
                user
            });
        } else if (action === 'reject') {
            registration.Status = 'rejected';
            await registration.save();

            return res.status(200).json({
                success: true,
                message: "Registration rejected successfully"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Invalid action"
        });
    } catch (error) {
        console.error("Error handling registration approval:", error);
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
      // Check if user is logged in
      if (!await readUsersFile()) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      // Get current user's login info
      const { login, password } = await JSON.parse(fs.readFileSync('controllers/users.json'));
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
          UserCode: admin.UserCode,
          Name: admin.Name,
          Login: admin.Login,
          DOB: admin.DOB,
          Role: admin.Role
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
        // Check if user is logged in
        if (!await readUsersFile()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Get current user's login info
        const { login, password } = await JSON.parse(fs.readFileSync('controllers/users.json'));
        const admin = await Admin.findOne({ Login: login });

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
            { Login: admin.Login },
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            admin: {
                UserCode: updatedAdmin.UserCode,
                Name: updatedAdmin.Name,
                Login: updatedAdmin.Login,
                DOB: updatedAdmin.DOB,
                Role: updatedAdmin.Role
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

module.exports={
    collegeRegister,
    collegeLogin,
    getPendingRegistrations,
    handleRegistrationApproval, 
    findActiveUsers, 
    adminLogout,
    addCourse,
    editCourse,
    deleteCourse,
    getCourses,
    getProfile,
    updateProfile
};