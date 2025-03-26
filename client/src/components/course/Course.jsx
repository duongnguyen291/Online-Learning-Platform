import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './course.css';

const Course = ({ title, rating, reviews, originalPrice, discountedPrice }) => {
  return (
    <div className="course-card">
      <div className="course-badge-container">
        <span className="course-badge best-seller">Best Seller</span>
        <span className="course-badge discount">20% OFF</span>
      </div>
      
      <div className="course-image-container">
        <img 
          src="/path/to/graduation-cap.png" 
          alt={title} 
          className="course-image"
        />
      </div>
      
      <div className="course-details">
        <h3 className="course-title">{title}</h3>
        
        <div className="course-rating">
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="star">★</span>
            ))}
          </div>
          <span className="rating-value">({rating})</span>
          <span className="review-count">{reviews} ratings</span>
        </div>
        
        <div className="course-pricing">
          <span className="discounted-price">${discountedPrice}</span>
          <span className="original-price">${originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

const ProfessionalDegreePage = () => {
  const [activeCategory, setActiveCategory] = useState('Engineering');

  const categories = [
    'All Recommendation', 
    'Engineering', 
    'Management', 
    'Medical & Pharmacy', 
    'Science and Technology', 
    'Arts & Humanities', 
    'Law', 
    'Commerce'
  ];

  const engineeringCourses = [
    {
      id: 1,
      title: 'Introduction to Engineering and Design',
      rating: 4.7,
      reviews: 10000,
      originalPrice: 100,
      discountedPrice: 80
    },
    {
      id: 2,
      title: 'Introduction to Engineering and Design',
      rating: 4.7,
      reviews: 10000,
      originalPrice: 100,
      discountedPrice: 80
    },
    {
      id: 3,
      title: 'Introduction to Engineering and Design',
      rating: 4.7,
      reviews: 10000,
      originalPrice: 100,
      discountedPrice: 80
    },
    {
      id: 4,
      title: 'Introduction to Engineering and Design',
      rating: 4.7,
      reviews: 10000,
      originalPrice: 100,
      discountedPrice: 80
    }
  ];

  return (
    <div className="professional-degree-page">
      <header className="page-header">
        <h1>Professional Degree Programs</h1>
        <p>Shape your future with our comprehensive range of professional courses</p>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search courses or specialization..." 
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>
      </header>

      <nav className="category-nav">
        {categories.map((category, index) => (
          <button 
            key={index} 
            className={`category-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
        <button className="category-button more-button">More</button>
      </nav>

      <section className="courses-section">
        <div className="section-header">
          <h2>{activeCategory}</h2>
          <Link to="/courses" className="see-more">See more &gt;</Link>
        </div>

        <div className="courses-grid">
          {engineeringCourses.map((course) => (
            <Link to={`/course/${course.id}`} key={course.id}>
              <Course 
                title={course.title}
                rating={course.rating}
                reviews={course.reviews}
                originalPrice={course.originalPrice}
                discountedPrice={course.discountedPrice}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfessionalDegreePage;