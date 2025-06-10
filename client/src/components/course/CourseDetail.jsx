import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../assets/css/courseDetail.css';
import { getCourseById, getSimilarCourses, checkEnrollmentStatus, enrollInCourse } from '../../services/courseService';

const CourseDetail = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [similarCourses, setSimilarCourses] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [progressCode, setProgressCode] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check login status
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setIsLoggedIn(!!userInfo?.isLoggedIn);

        // Fetch course details - try by courseCode first, then by id if it looks like an ObjectId
        const courseData = await getCourseById(courseCode);
        setCourse(courseData);

        // If logged in, fetch enrollment status
        if (userInfo?.isLoggedIn) {
          const enrollmentData = await checkEnrollmentStatus(courseCode);
          setEnrollmentStatus(enrollmentData.status);
          setProgressCode(enrollmentData.progressCode);
          setScore(enrollmentData.score);
        }

        // Fetch similar courses
        const similar = await getSimilarCourses(courseData.category, courseCode);
        setSimilarCourses(similar);

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseCode]);

  const handleEnrollClick = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // If already enrolled, navigate to course content
    if (enrollmentStatus === 'enrolled') {
      navigate(`/course-content/${courseCode}/${progressCode || ''}`);
      return;
    }

    try {
      setIsLoading(true);
      // Use courseCode for enrollment
      const result = await enrollInCourse(courseCode);
      if (result.success) {
        setEnrollmentStatus('enrolled');
        setProgressCode(result.enrollment.Progress);
        setScore(result.enrollment.Score);
        setShowSuccessMessage(true);
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      }
    } catch (error) {
      setError('Failed to enroll in course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/courses">Browse all courses</Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course not found</h2>
        <p>The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses">Browse all courses</Link>
      </div>
    );
  }

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

  // Format price with commas and currency symbol
  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
  };

  // Extract chapter and lesson info from progress code (e.g., "C01 LSE1001" -> Chapter 1, Lesson 1)
  const getProgressInfo = () => {
    if (!progressCode) return null;
    
    try {
      const chapterMatch = progressCode.match(/C(\d+)/);
      const lessonMatch = progressCode.match(/LSE(\d+)/);
      
      const chapter = chapterMatch ? parseInt(chapterMatch[1]) : null;
      const lesson = lessonMatch ? parseInt(lessonMatch[1]) : null;
      
      return {
        chapter,
        lesson
      };
    } catch (err) {
      return null;
    }
  };

  const progressInfo = getProgressInfo();

  return (
    <div className="course-detail-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> | <Link to="/courses">Courses</Link> | 
        <Link to="/courses" state={{ category: course.category }}>
          {course.category}
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
          
          {/* Price Information */}
          {course.originalPrice && (
            <div className="course-price-info">
              {course.discountedPrice < course.originalPrice ? (
                <>
                  <span className="discounted-price">{formatPrice(course.discountedPrice)}</span>
                  <span className="original-price">{formatPrice(course.originalPrice)}</span>
                  <span className="discount-percentage">
                    {Math.round((1 - course.discountedPrice / course.originalPrice) * 100)}% off
                  </span>
                </>
              ) : (
                <span className="regular-price">{formatPrice(course.originalPrice)}</span>
              )}
            </div>
          )}
          
          {/* Rating Display */}
          {course.rating > 0 && (
            <div className="course-rating-display">
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={`star ${index < Math.floor(course.rating) ? 'filled' : ''}`}>★</span>
                ))}
              </div>
              <span className="rating-value">{course.rating.toFixed(1)}</span>
              <span className="reviews-count">({course.reviews.toLocaleString()} reviews)</span>
            </div>
          )}
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
              You've successfully enrolled in this course!
            </div>
          )}

          {enrollmentStatus === 'pending' && (
            <div className="enrollment-status-message">
              Your enrollment request is being reviewed by the lecturer.
              We'll notify you once it's approved.
            </div>
          )}

          {enrollmentStatus === 'enrolled' && progressInfo && (
            <div className="enrollment-progress">
              <h3>Your Progress</h3>
              <div className="progress-details">
                <div className="progress-item">
                  <span className="progress-label">Current Chapter:</span>
                  <span className="progress-value">{progressInfo.chapter}</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Current Lesson:</span>
                  <span className="progress-value">{progressInfo.lesson}</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Score:</span>
                  <span className="progress-value">{score}</span>
                </div>
              </div>
            </div>
          )}

          <div className="course-specs">
            <div className="spec-item">
              <span className="spec-icon">📋</span>
              <span className="spec-text">{course.sections} Sections</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">📚</span>
              <span className="spec-text">{course.lectures} Lectures</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">⏱️</span>
              <span className="spec-text">{course.totalLength}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">🔊</span>
              <span className="spec-text">{course.language}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">👨‍🏫</span>
              <span className="spec-text">Instructor: {course.lecturer}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Description Section */}
      <div className="course-description-section">
        <h2 className="section-title">Course Details</h2>
        <div className="course-description">
          {course.description}
        </div>
      </div>

      {/* What You'll Learn Section */}
      {course.whatLearn && course.whatLearn.length > 0 && (
        <div className="what-learn-section">
          <h2 className="section-title">What You'll Learn</h2>
          <ul className="what-learn-list">
            {course.whatLearn.map((item, index) => (
              <li key={index} className="what-learn-item">
                <span className="check-icon">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certification Section */}
      {course.certification && (
        <div className="certification-section">
          <h2 className="section-title">Certification</h2>
          <div className="certification-content">
            <span className="certificate-icon">🎓</span>
            <p>{course.certification}</p>
          </div>
        </div>
      )}

      {/* Who This Course Is For Section */}
      {course.whoFor && (
        <div className="who-for-section">
          <h2 className="section-title">Who This Course Is For</h2>
          <div className="who-for-content">
            <span className="target-icon">🎯</span>
            <p>{course.whoFor}</p>
          </div>
        </div>
      )}

      {/* Similar Courses Section */}
      {similarCourses.length > 0 && (
        <div className="similar-courses-section">
          <h2 className="section-title">Similar Courses</h2>
          <div className="similar-courses-grid">
            {similarCourses.map(similarCourse => (
              <Link 
                key={similarCourse._id}
                to={`/course/${similarCourse.courseCode}`}
                className="similar-course-card"
              >
                <div className="similar-course-image-container">
                  <img 
                    src={similarCourse.image || "/path/to/default-image.jpg"}
                    alt={similarCourse.Name} 
                    className="similar-course-image"
                  />
                </div>
                <div className="similar-course-details">
                  <h4 className="similar-course-title">{similarCourse.Name}</h4>
                  <div className="similar-course-rating">
                    
                    <span className="rating-value">({similarCourse.rating})</span>
                  </div>
                  <div className="similar-course-price">
                    {similarCourse.discountedPrice !== similarCourse.originalPrice ? (
                      <>
                        <span className="discounted-price">${similarCourse.discountedPrice}</span>
                        <span className="original-price">${similarCourse.originalPrice}</span>
                      </>
                    ) : (
                      <span className="regular-price">${similarCourse.originalPrice}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;