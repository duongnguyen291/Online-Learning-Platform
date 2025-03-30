import React, { useState, useEffect, useRef } from 'react';
import './searchbar.css';

const SearchBar = ({ allCourses, categories, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState({ courses: [], categories: [] });
  const searchContainerRef = useRef(null);

  // Generate a flat list of all courses
  const allCoursesList = Object.values(allCourses).flat();

  // Filter recommendations based on search term
  useEffect(() => {
    if (searchTerm.length < 1) {
      setRecommendations({ courses: [], categories: [] });
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    
    // Filter courses
    const filteredCourses = allCoursesList
      .filter(course => course.title.toLowerCase().includes(searchTermLower))
      .slice(0, 5); // Limit to 5 results
    
    // Filter categories
    const filteredCategories = categories
      .filter(category => category.toLowerCase().includes(searchTermLower))
      .slice(0, 3); // Limit to 3 results
    
    setRecommendations({
      courses: filteredCourses,
      categories: filteredCategories
    });
  }, [searchTerm, allCoursesList, categories]);

  // Close recommendations when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowRecommendations(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowRecommendations(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Call the onSearch function with filtered results
    performSearch(searchTerm);
    setShowRecommendations(false);
  };

  const performSearch = (term) => {
    const searchTermLower = term.toLowerCase();
    
    // Get full search results (not limited to 5)
    const courseResults = allCoursesList
      .filter(course => course.title.toLowerCase().includes(searchTermLower));
    
    const categoryResults = categories
      .filter(category => category.toLowerCase().includes(searchTermLower));
    
    // Pass the search results up to parent component
    onSearch({
      term: searchTerm,
      courses: courseResults,
      categories: categoryResults
    });
  };

  const selectRecommendation = (text, type, item) => {
    setSearchTerm(text);
    setShowRecommendations(false);
    
    // If it's a direct selection, perform the search immediately
    if (type === 'category') {
      onSearch({
        term: text,
        categories: [text],
        courses: allCourses[text] || []
      });
    } else if (type === 'course') {
      onSearch({
        term: text,
        courses: [item],
        categories: []
      });
    }
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowRecommendations(true)}
            placeholder="Search courses or specialization..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </form>

      {showRecommendations && (searchTerm.length > 0) && (
        <div className="search-recommendations">
          {recommendations.categories.length > 0 && (
            <div className="recommendation-section">
              <h4>Categories</h4>
              <ul>
                {recommendations.categories.map((category, index) => (
                  <li 
                    key={`category-${index}`} 
                    onClick={() => selectRecommendation(category, 'category')}
                  >
                    <div className="recommendation-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
                    </div>
                    <span>{category}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.courses.length > 0 && (
            <div className="recommendation-section">
              <h4>Courses</h4>
              <ul>
                {recommendations.courses.map((course) => (
                  <li 
                    key={`course-${course.id}`}
                    onClick={() => selectRecommendation(course.title, 'course', course)}
                  >
                    <div className="recommendation-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </div>
                    <span>{course.title}</span>
                    <div className="recommendation-rating">
                      <span className="star">★</span>
                      <span>{course.rating}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.courses.length === 0 && recommendations.categories.length === 0 && (
            <div className="no-results">
              <p>No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;