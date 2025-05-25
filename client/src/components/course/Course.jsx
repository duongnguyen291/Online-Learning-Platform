import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/course.css';
import SearchBar from './Searchbar';
import { coursesData, getAllCourses, courseCategories } from '../../assets/data/courseData';

const Course = ({ title, rating, reviews, originalPrice, discountedPrice, image }) => {
  return (
    <div className="course-card">
      <div className="course-badge-container">
        <span className="course-badge best-seller">Best Seller</span>
        <span className="course-badge discount">20% OFF</span>
      </div>
      
      <div className="course-image-container">
        <img 
          src={image || "/path/to/graduation-cap.png"} 
          alt={title} 
          className="course-image"
        />
      </div>
      
      <div className="course-details-general">
        <h3 className="course-title-general">{title}</h3>
        
        <div className="course-rating">
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="star">★</span>
            ))}
          </div>
          <span className="rating-value">({rating})</span>
          <span className="review-count">{reviews} </span>
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
  const location = useLocation();
  // Check if we have a category passed via state
  const categoryFromState = location.state?.category;
  
  const [activeCategory, setActiveCategory] = useState(categoryFromState || 'All Recommendation');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const coursesPerPage = 20;

  // Get all courses list from the imported function
  const allCoursesList = getAllCourses();
  
  // Handle search submission
  const handleSearch = (results) => {
    setSearchResults(results);
    setIsSearching(true);
    setCurrentPage(1);
    
    // If a category was selected directly, update activeCategory
    if (results.categories.length === 1 && results.categories[0] !== 'All Recommendation') {
      setActiveCategory(results.categories[0]);
      setIsSearching(false); // Use normal category display instead
    }
  };
  
  // Clear search results and return to normal browsing
  const clearSearch = () => {
    setSearchResults(null);
    setIsSearching(false);
  };
  
  // Get current courses based on category/search and pagination
  const getCurrentCourses = () => {
    let filteredCourses = [];
    
    if (isSearching && searchResults) {
      filteredCourses = searchResults.courses;
    } else if (activeCategory === 'All Recommendation') {
      filteredCourses = allCoursesList;
    } else {
      filteredCourses = coursesData[activeCategory] || [];
    }
    
    // Calculate pagination
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    return filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  };
  
  // Effect to handle category from route state
  useEffect(() => {
    if (categoryFromState && courseCategories.includes(categoryFromState)) {
      setActiveCategory(categoryFromState);
      setIsSearching(false);
      setSearchResults(null);
      setCurrentPage(1);
    }
  }, [categoryFromState]);
  
  // Reset page to 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
    setIsSearching(false);
    setSearchResults(null);
  }, [activeCategory]);
  
  // Calculate total pages
  const currentCourses = isSearching && searchResults 
    ? searchResults.courses 
    : (activeCategory === 'All Recommendation' 
      ? allCoursesList 
      : (coursesData[activeCategory] || []));
    
  const totalPages = Math.ceil(currentCourses.length / coursesPerPage);
  
  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Get section header text
  const getSectionHeaderText = () => {
    if (isSearching && searchResults) {
      return `Search Results for "${searchResults.term}" (${searchResults.courses.length} courses found)`;
    }
    return activeCategory;
  };

  // Check if we should show the "See more" link
  const shouldShowSeeMore = activeCategory !== 'All Recommendation' && !isSearching;

  return (
    // Rest of the component remains unchanged
    <div className="professional-degree-page">
      <header className="page-header">
        <h1>Professional Degree Programs</h1>
        <p>Shape your future with our comprehensive range of professional courses</p>
        
        {/* Use SearchBar component with imported data */}
        <SearchBar 
          allCourses={coursesData} 
          categories={courseCategories} 
          onSearch={handleSearch} 
        />
      </header>

      <nav className="category-nav">
        {courseCategories.map((category, index) => (
          <button 
            key={index} 
            className={`category-button ${activeCategory === category && !isSearching ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(category);
              clearSearch();
            }}
          >
            {category}
          </button>
        ))}
        <button className="category-button more-button">More</button>
      </nav>

      <section className="courses-section">
        <div className="section-header">
          <h2>{getSectionHeaderText()}</h2>
          
          {isSearching && (
            <button 
              onClick={clearSearch}
              className="clear-search-button"
            >
              Clear Search
            </button>
          )}
          
          {shouldShowSeeMore && (
            <Link to="/courses" className="see-more">See more &gt;</Link>
          )}
        </div>

        {isSearching && searchResults && searchResults.courses.length === 0 && (
          <div className="no-search-results">
            <p>No courses found matching "{searchResults.term}"</p>
            <p>Try a different search term or browse by category</p>
          </div>
        )}

        <div className="courses-grid">
          {getCurrentCourses().map((course) => (
            <div key={course.id}>
              <Link to={`/course/${course.id}`} style={{ textDecoration: 'none' }}>
                <Course 
                  title={course.title}
                  rating={course.rating}
                  reviews={course.reviews}
                  originalPrice={course.originalPrice}
                  discountedPrice={course.discountedPrice}
                  image={course.image}
                />
              </Link>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              &lt;
            </button>
            
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              &gt;
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfessionalDegreePage;