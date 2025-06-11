const Course = require('../../models/courseModel');
const UserProgress = require('../../models/userProgressModel');
const User = require('../../models/userModel');

class LearningPathService {
    async getUserSkillProfile(userId) {
        try {
            // Get completed courses
            const completedCourses = await UserProgress.find({
                userId,
                status: 'completed'
            }).populate('courseId');

            // Extract and aggregate skills from completed courses
            const skillProfile = {};
            completedCourses.forEach(progress => {
                progress.courseId.skillTags.forEach(skill => {
                    skillProfile[skill] = (skillProfile[skill] || 0) + 1;
                });
            });

            return skillProfile;
        } catch (error) {
            console.error('Error getting user skill profile:', error);
            throw error;
        }
    }

    async getRecommendedCourses(userId) {
        try {
            // Get user's current courses
            const userProgress = await UserProgress.find({ userId });
            const currentCourseIds = userProgress.map(p => p.courseId);

            // Get user's skill profile
            const skillProfile = await this.getUserSkillProfile(userId);
            const userSkills = Object.keys(skillProfile);

            // Find courses that match user's skill interests
            // but aren't currently enrolled in
            const recommendedCourses = await Course.find({
                courseCode: { $nin: currentCourseIds },
                skillTags: { $in: userSkills }
            }).limit(5);

            return recommendedCourses;
        } catch (error) {
            console.error('Error getting recommended courses:', error);
            throw error;
        }
    }

    async generateLearningPathAdvice(userId) {
        try {
            const user = await User.findOne({ UserCode: userId });
            const skillProfile = await this.getUserSkillProfile(userId);
            const recommendedCourses = await this.getRecommendedCourses(userId);
            
            // Get current progress
            const inProgressCourses = await UserProgress.find({
                userId,
                status: 'in_progress'
            }).populate('courseId');

            // Generate personalized advice
            let advice = `Hi ${user.Name}, based on your learning progress:\n\n`;

            // Add current progress advice
            if (inProgressCourses.length > 0) {
                advice += "Current courses in progress:\n";
                inProgressCourses.forEach(progress => {
                    advice += `- ${progress.courseId.title} (${progress.progress}% complete)\n`;
                });
                advice += "\n";
            }

            // Add skill-based recommendations
            if (recommendedCourses.length > 0) {
                advice += "Recommended next courses:\n";
                recommendedCourses.forEach(course => {
                    advice += `- ${course.title} (${course.level})\n`;
                    advice += `  This course will enhance your skills in: ${course.skillTags.join(', ')}\n`;
                });
            }

            // Add general advice
            advice += "\nSuggestions:\n";
            advice += "- Try to complete your current courses before starting new ones\n";
            advice += "- Focus on courses that build upon your existing skills\n";
            advice += "- Consider exploring courses in related skill areas\n";

            return advice;
        } catch (error) {
            console.error('Error generating learning path advice:', error);
            throw error;
        }
    }
}

// Create singleton instance
const learningPathService = new LearningPathService();
module.exports = learningPathService; 