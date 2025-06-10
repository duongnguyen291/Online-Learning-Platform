import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const lecturerInfo = localStorage.getItem('lecturerInfo');
    
    if (!lecturerInfo) {
      setIsAuthenticated(false);
    } else {
      try {
        // Parse the lecturer info to check if it's valid
        const parsed = JSON.parse(lecturerInfo);
        if (parsed && parsed.userId && parsed.role === 'Lecturer') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Invalid lecturer info in localStorage');
        setIsAuthenticated(false);
      }
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to the main application login page
    window.location.href = 'http://localhost:3000/login';
    return null;
  }

  return children;
};

export default ProtectedRoute; 