import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/course.css';
import SearchBar from './Searchbar';
import { getAllCourses } from '../../services/courseService';

const Course = ({ course }) => {
  const navigate = useNavigate();
  
  const handleSeeDetail = (e) => {
    e.stopPropagation();
    
    // Debug check for courseCode
    const courseCode = course.CourseCode || course.courseCode;
    if (!courseCode) {
      console.error('Course code is undefined:', course);
      alert('Course code is missing. Please try again later.');
      return;
    }
    
    navigate(`/course/${courseCode}`);
  };
  
  return (
    <div className="course-card">
      <div className="course-image-container">
        <img 
          src={course.image || "/path/to/graduation-cap.png"} 
          alt={course.title} 
          className="course-image"
        />
      </div>
      
      <div className="course-details-general">
        <h3 className="course-title-general">{course.title}</h3>
        
        {course.rating && (
          <div className="course-rating">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <span key={index} className={`star ${index < Math.floor(course.rating) ? 'filled' : ''}`}>★</span>
              ))}
            </div>
            <span className="rating-value">({course.rating})</span>
            <span className="review-count">{course.reviews} reviews</span>
          </div>
        )}
        
        <button 
          className="see-detail-button"
          onClick={handleSeeDetail}
        >
          See Detail
        </button>
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
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(['All Recommendation']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const coursesPerPage = 20;

  // Fetch courses from the database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await getAllCourses();
        
        // Format courses to match the expected structure
        const formattedCourses = coursesData.map(course => ({
          id: course._id,
          courseCode: course.CourseCode || course.courseCode,
          title: course.Name || course.title,
          description: course.Description || course.description,
          image: course.image,
          category: course.category,
          rating: course.rating,
          reviews: course.reviews,
          originalPrice: course.originalPrice,
          discountedPrice: course.discountedPrice
        }));
        
        setCourses(formattedCourses);
        
        // Extract unique categories from courses
        const uniqueCategories = ['All Recommendation', ...new Set(formattedCourses.map(course => course.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  // Handle search submission
  const handleSearch = (term) => {
    // Filter courses based on search term
    const filteredCourses = courses.filter(course => 
      course.title.toLowerCase().includes(term.toLowerCase()) || 
      course.description.toLowerCase().includes(term.toLowerCase())
    );
    
    // Check if search matches a specific category
    const matchingCategories = categories.filter(category => 
      category.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults({
      term,
      courses: filteredCourses,
      categories: matchingCategories
    });
    
    setIsSearching(true);
    setCurrentPage(1);
    
    // If a category was selected directly, update activeCategory
    if (matchingCategories.length === 1 && matchingCategories[0] !== 'All Recommendation') {
      setActiveCategory(matchingCategories[0]);
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
      filteredCourses = courses;
    } else {
      filteredCourses = courses.filter(course => course.category === activeCategory);
    }
    
    // Calculate pagination
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    return filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  };
  
  // Effect to handle category from route state
  useEffect(() => {
    if (categoryFromState && categories.includes(categoryFromState)) {
      setActiveCategory(categoryFromState);
      setIsSearching(false);
      setSearchResults(null);
      setCurrentPage(1);
    }
  }, [categoryFromState, categories]);
  
  // Reset page to 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
    setIsSearching(false);
    setSearchResults(null);
  }, [activeCategory]);
  
  // Calculate total pages
  const currentCoursesData = isSearching && searchResults 
    ? searchResults.courses 
    : (activeCategory === 'All Recommendation' 
      ? courses 
      : courses.filter(course => course.category === activeCategory));
    
  const totalPages = Math.ceil(currentCoursesData.length / coursesPerPage);
  
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="professional-degree-page">
      <header className="page-header">
        <h1>Professional Degree Programs</h1>
        <p>Shape your future with our comprehensive range of professional courses</p>
        
        {/* Use SearchBar component with imported data */}
        <SearchBar onSearch={handleSearch} />
      </header>

      <nav className="category-nav">
        {categories.map((category, index) => (
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
        {categories.length > 10 && (
          <button className="category-button more-button">More</button>
        )}
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
          {getCurrentCourses().map((course) => {
            const courseCode = course.CourseCode || course.courseCode;
            return (
              <div key={course.id}>
                <Link to={courseCode ? `/course/${courseCode}` : '#'} style={{ textDecoration: 'none' }}>
                  <Course course={course} />
                </Link>
              </div>
            );
          })}
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