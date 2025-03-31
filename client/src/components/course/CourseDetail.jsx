import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './courseDetail.css';
import { coursesData, getAllCourses } from './courseData';
import { getCourseDetail } from './courseDetailData';

const CourseDetail = () => {
  const { id } = useParams();
  const allCourses = getAllCourses();
  const course = allCourses.find(course => course.id === parseInt(id));
  
  // Get extended course details
  const courseDetail = getCourseDetail(id);

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course not found</h2>
        <p>The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses">Browse all courses</Link>
      </div>
    );
  }

  const discountPercentage = Math.round(((course.originalPrice - course.discountedPrice) / course.originalPrice) * 100);

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
          <div className="course-rating-container">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="star">★</span>
            ))}
            <span className="rating-value">({course.rating})</span>
            <span className="review-count">{formatNumber(course.reviews)} ratings</span>
          </div>

          <div className="course-price-container">
            <span className="discounted-price">${course.discountedPrice.toFixed(2)}</span>
            <span className="original-price">${course.originalPrice.toFixed(2)}</span>
            <div className="discount-badge">{discountPercentage}% OFF</div>
          </div>

          <button className="buy-button">Buy</button>
          <button className="wishlist-button">
            <span className="heart-icon">♡</span> Wishlist
          </button>

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
                  <div className="similar-course-price">
                    <span className="similar-discounted-price">${similarCourse.discountedPrice}</span>
                    <span className="similar-original-price">${similarCourse.originalPrice}</span>
                  </div>
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