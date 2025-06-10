const API_URL = 'http://localhost:5000/api/v3';

// Get all courses taught by the lecturer
export const getLecturerCourses = async () => {
  try {
    // Get lecturer info from localStorage
    const lecturerInfo = localStorage.getItem('lecturerInfo');
    if (!lecturerInfo) {
      throw new Error('No lecturer information found');
    }

    const { userId } = JSON.parse(lecturerInfo);
    
    const response = await fetch(`${API_URL}/lecturer-courses?userId=${userId}`, {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch lecturer courses');
    }
    
    return data.courses;
  } catch (error) {
    console.error('Error fetching lecturer courses:', error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    // Get lecturer info from localStorage
    const lecturerInfo = localStorage.getItem('lecturerInfo');
    if (!lecturerInfo) {
      throw new Error('No lecturer information found');
    }

    const { userId } = JSON.parse(lecturerInfo);

    // Add RequiredRole if it's not present
    if (!courseData.RequiredRole) {
      courseData.RequiredRole = 'Student'; // Default value
    }
    
    const response = await fetch(`${API_URL}/courses?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create course');
    }
    
    return data.course;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Update an existing course
export const updateCourse = async (courseId, courseData) => {
  try {
    // Get lecturer info from localStorage
    const lecturerInfo = localStorage.getItem('lecturerInfo');
    if (!lecturerInfo) {
      throw new Error('No lecturer information found');
    }

    const { userId } = JSON.parse(lecturerInfo);
    
    // Add RequiredRole if it's not present
    if (!courseData.RequiredRole) {
      courseData.RequiredRole = 'Student'; // Default value
    }
    
    const response = await fetch(`${API_URL}/courses/${courseId}?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update course');
    }
    
    return data.course;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (courseId) => {
  try {
    // Get lecturer info from localStorage
    const lecturerInfo = localStorage.getItem('lecturerInfo');
    if (!lecturerInfo) {
      throw new Error('No lecturer information found');
    }

    const { userId } = JSON.parse(lecturerInfo);
    
    const response = await fetch(`${API_URL}/courses/${courseId}?userId=${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete course');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Get a single course by ID
export const getCourseById = async (courseId) => {
  try {
    // Get lecturer info from localStorage
    const lecturerInfo = localStorage.getItem('lecturerInfo');
    if (!lecturerInfo) {
      throw new Error('No lecturer information found');
    }

    const { userId } = JSON.parse(lecturerInfo);
    
    const response = await fetch(`${API_URL}/courses/${courseId}?userId=${userId}`, {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch course');
    }
    
    return data.course;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

// Get enrolled students for a course
export const getEnrolledStudents = async (courseId) => {
  try {
    // Get lecturer info from localStorage
    const lecturerInfo = localStorage.getItem('lecturerInfo');
    if (!lecturerInfo) {
      throw new Error('No lecturer information found');
    }

    const { userId } = JSON.parse(lecturerInfo);
    
    const response = await fetch(`${API_URL}/courses/${courseId}/students?userId=${userId}`, {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch enrolled students');
    }
    
    return data.enrolledStudents;
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    throw error;
  }
}; 