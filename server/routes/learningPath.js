const express = require('express');
const router = express.Router();
const learningPathService = require('../services/learningPathService');

// Get learning path recommendations
router.get('/advice/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const advice = await learningPathService.generateLearningPathAdvice(userId);
        res.json({ status: 'success', advice });
    } catch (error) {
        console.error('Error getting learning path advice:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to generate learning path advice' 
        });
    }
});

// Get recommended courses
router.get('/recommendations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const courses = await learningPathService.getRecommendedCourses(userId);
        res.json({ status: 'success', courses });
    } catch (error) {
        console.error('Error getting course recommendations:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to get course recommendations' 
        });
    }
});

module.exports = router; 