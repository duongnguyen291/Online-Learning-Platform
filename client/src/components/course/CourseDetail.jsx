import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../assets/css/courseDetail.css';
import { coursesData, getAllCourses } from '../../assets/data/courseData';
import { getCourseDetail } from '../../assets/data/courseDetailData';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const allCourses = getAllCourses();
  const course = allCourses.find(course => course.id === parseInt(id));
  const [enrollmentStatus, setEnrollmentStatus] = useState(null); // 'pending', 'enrolled', or null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Get extended course details
  const courseDetail = getCourseDetail(id);

  useEffect(() => {
    // Check login status
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setIsLoggedIn(!!userInfo?.isLoggedIn);
    
    // If logged in, fetch enrollment status
    if (userInfo?.isLoggedIn) {
      fetchEnrollmentStatus();
    }
  }, [id]);

  const fetchEnrollmentStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/enrollment-status/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setEnrollmentStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching enrollment status:', error);
    }
  };

  const handleEnrollClick = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/v1/enroll/${id}`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setEnrollmentStatus('pending');
        setShowSuccessMessage(true);
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course not found</h2>
        <p>The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses">Browse all courses</Link>
      </div>
    );
  }

  // Get the category directly from the course data itself
  const courseCategory = course.category;
  
  // Helper function to format ratings with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Get similar courses based on the same category
  const getCategoryCourses = () => {
    // Get courses from the same category, excluding the current course
    const categoryCourses = coursesData[courseCategory] ? 
      coursesData[courseCategory].filter(c => c.id !== parseInt(id)) : 
      [];
    
    // Return up to 3 similar courses
    return categoryCourses.slice(0, 3);
  };
  
  const similarCourses = getCategoryCourses();

  const getEnrollButtonText = () => {
    if (isLoading) return 'Processing...';
    if (!isLoggedIn) return 'Login to Enroll';
    switch (enrollmentStatus) {
      case 'pending':
        return 'Enrollment Pending';
      case 'enrolled':
        return 'Go to Course';
      default:
        return 'Enroll Now';
    }
  };

  const getEnrollButtonClass = () => {
    if (isLoading) return 'enroll-button loading';
    if (!isLoggedIn) return 'enroll-button login-required';
    switch (enrollmentStatus) {
      case 'pending':
        return 'enroll-button pending';
      case 'enrolled':
        return 'enroll-button enrolled';
      default:
        return 'enroll-button';
    }
  };

  return (
    <div className="course-detail-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> | <Link to="/courses">Courses</Link> | 
        <Link to="/courses" state={{ category: courseCategory }}>
          {courseCategory}
        </Link> | 
        <span className="current-page">{course.title}</span>
      </div>

      {/* Course Title */}
      <h1 className="course-title">{course.title}</h1>

      <div className="course-detail-content">
        {/* Left Side - Course Image */}
        <div className="course-image-section">
          <img 
            src={course.image || "/path/to/default-course-image.png"} 
            alt={course.title} 
            className="course-detail-image"
          />
        </div>

        {/* Right Side - Course Info */}
        <div className="course-info-section">
          <button 
            className={getEnrollButtonClass()}
            onClick={handleEnrollClick}
            disabled={isLoading || enrollmentStatus === 'pending'}
          >
            {getEnrollButtonText()}
          </button>

          {showSuccessMessage && (
            <div className="enrollment-success-message">
              Your enrollment request has been sent successfully!
            </div>
          )}

          {enrollmentStatus === 'pending' && (
            <div className="enrollment-status-message">
              Your enrollment request is being reviewed by the lecturer.
              We'll notify you once it's approved.
            </div>
          )}

          <div className="course-specs">
            <div className="spec-item">
              <span className="spec-icon">📋</span>
              <span className="spec-text">{courseDetail.sections} Sections</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">📚</span>
              <span className="spec-text">{courseDetail.lectures} Lectures</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">⏱️</span>
              <span className="spec-text">{courseDetail.totalLength} total length</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">🔊</span>
              <span className="spec-text">{courseDetail.language}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="course-description-section">
        <h2 className="section-title">Course Details</h2>
        {courseDetail.description.map((paragraph, index) => (
          <p key={index} className="description-text">{paragraph}</p>
        ))}
      </div>

      {/* Certification Section */}
      <div className="certification-section">
        <h2 className="section-title">Certification</h2>
        <p className="description-text">{courseDetail.certification}</p>
      </div>

      {/* Who this course is for Section */}
      <div className="who-for-section">
        <h2 className="section-title">Who this course is for</h2>
        <p className="description-text">{courseDetail.whoFor}</p>
      </div>

      {/* What you'll learn Section */}
      <div className="what-learn-section">
        <h2 className="section-title">What you'll learn in this course:</h2>
        <ul className="learn-list">
          {courseDetail.whatLearn.map((item, index) => (
            <li key={index} className="learn-item">{item}</li>
          ))}
        </ul>
      </div>

      {/* Similar Courses Section */}
      <div className="similar-courses-section">
        <div className="similar-header">
          <h2 className="section-title">Similar Courses</h2>
          <Link to="/courses" state={{ category: courseCategory }} className="see-more-link">
            See more &gt;
          </Link>
        </div>
        
        <div className="similar-courses-grid">
          {similarCourses.map((similarCourse) => (
            <div key={similarCourse.id} className="similar-course-card">
              <Link to={`/course/${similarCourse.id}`} className="similar-course-link">
                <div className="similar-course-image-container">
                  <img
                    src={similarCourse.image || "/path/to/default-course-image.png"}
                    alt={similarCourse.title}
                    className="similar-course-image"
                  />
                </div>
                <div className="similar-course-details">
                  <h3 className="similar-course-title">{similarCourse.title}</h3>
                  <p className="similar-course-desc">
                    Comprehensive course on {similarCourse.title.toLowerCase()} with expert instruction and practical exercises.
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;