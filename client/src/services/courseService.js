const API_URL = 'http://localhost:5000/api/v1';

// Fetch all courses
export const getAllCourses = async () => {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch courses');
    }
    return data.courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Fetch single course details
export const getCourseById = async (courseId) => {
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch course details');
    }
    return data.course;
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw error;
  }
};

// Get similar courses by category
export const getSimilarCourses = async (category, currentCourseId) => {
  try {
    const response = await fetch(`${API_URL}/courses/category/${category}?exclude=${currentCourseId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch similar courses');
    }
    return data.courses;
  } catch (error) {
    console.error('Error fetching similar courses:', error);
    throw error;
  }
};

// Check enrollment status
export const checkEnrollmentStatus = async (courseId) => {
  try {
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isLoggedIn || !userInfo.userId) {
      return { status: null, progressCode: null, score: 0 }; // User not logged in
    }
    
    const response = await fetch(`${API_URL}/enrollment-status/${courseId}?userId=${userInfo.userId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check enrollment status');
    }
    return {
      status: data.status,
      progressCode: data.progressCode,
      score: data.score
    };
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    throw error;
  }
};

// Enroll in a course
export const enrollInCourse = async (courseId) => {
  try {
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log(userInfo,courseId);
    if (!userInfo || !userInfo.isLoggedIn || !userInfo.userId) {
      throw new Error('You must be logged in to enroll in a course');
    }
    
    const response = await fetch(`${API_URL}/enroll/${courseId}?userId=${userInfo.userId}`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to enroll in course');
    }
    return data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
}; 