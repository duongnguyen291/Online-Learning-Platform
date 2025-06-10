const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');

exports.authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies or authorization header
        const token = req.cookies.token || 
            (req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
                ? req.headers.authorization.split(' ')[1] 
                : null);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found or unauthorized.'
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid authentication token.',
            error: error.message
        });
    }
};

// Middleware to check if user is a student
exports.isStudent = async (req, res, next) => {
    try {
        // Get user ID from query params or request body
        const userId = req.query.userId || req.body.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }
        
        // Find user
        const user = await User.findOne({ UserCode: userId });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found or unauthorized.'
            });
        }
        
        // Check if user is a student
        if (user.Role.toLowerCase() !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Student role required.'
            });
        }
        
        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: error.message
        });
    }
};

// Middleware to check if user is a lecturer
exports.isLecturer = async (req, res, next) => {
    try {
        // Get user ID from query params or request body
        const userId = req.query.userId || req.body.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }
        
        // Find user
        const user = await User.findOne({ UserCode: userId });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found or unauthorized.'
            });
        }
        
        // Check if user is a lecturer
        if (user.Role.toLowerCase() !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Lecturer role required.'
            });
        }
        
        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: error.message
        });
    }
};

// Middleware to check if user is an admin
exports.isAdmin = async (req, res, next) => {
    try {
        // Get user ID from query params or request body
        const userId = req.query.userId || req.body.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }
        
        // Find admin
        const admin = await Admin.findOne({ UserCode: userId });
        
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin not found or unauthorized.'
            });
        }
        
        // Attach admin to request
        req.admin = admin;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: error.message
        });
    }
}; 