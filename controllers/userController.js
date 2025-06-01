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
const Enrollment = require("../models/enrollmentModel");
const {initUsersFile, writeUsersFile, readUsersFile, deleteUsersFile} = require("../controllers/userCredetialController")
const fs = require("fs");

const register = async (req, res) => {
  const { userCode, name, role, DOB, login, password } = req.body;
  try {
    const existingUser = await User.findOne({ Login: login });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already Exists",
      });
    }

    const user = await User.create({
      UserCode: userCode,
      Name: name,
      Role: role,
      DOB: DOB,
      Login: login,
      Password: password
    });

    return res.status(201).json({
      success: true,
      user,
      message: "Account Successfully Created",
    });
  } catch (error) {
    console.log("Some error occurred", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  const { login, password } =  req.body;
  try {
    if (await readUsersFile()) {
      return res.status(404).json({
        success: false,
        message: "Already signed in. Please Logout",
      });
    }
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

    await initUsersFile();
    await writeUsersFile(req.body);


    return res.status(200).json({
      success: true,
      login, password,
      message: "Login Successfull",
    });
  } catch (error) {
    console.log("Some error occured", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const logoutUser = async (req, res) => {
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

const getCourses = async (req, res) => {
  try {
    if (!await readUsersFile()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { login, password } = await JSON.parse(fs.readFileSync('controllers/users.json'));
    console.log(login);

    const user = await User.findOne({Login: login});
    console.log(user.UserCode);
    const userCode = user.UserCode;

    const enrollments = await Enrollment.find({ UserCode: userCode });
    console.log(enrollments);
    const courseCodes = enrollments.map(e => e.CourseCode);

    return res.status(200).json({
      success: true,
      courseCodes,
      message: "Fetched enrolled courses",
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = { register, loginUser, logoutUser, getCourses};
