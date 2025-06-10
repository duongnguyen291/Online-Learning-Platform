import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/AuthPage.css';

/**
 * Auth page component that handles URL parameter-based authentication
 * This is a fallback method if localStorage synchronization via iframe fails
 */
const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Get lecturer data from URL parameter
    const lecturerData = searchParams.get('lecturerData');
    
    if (lecturerData) {
      try {
        // Parse and store the lecturer data
        const lecturerInfo = JSON.parse(decodeURIComponent(lecturerData));
        localStorage.setItem('lecturerInfo', JSON.stringify(lecturerInfo));
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Error processing lecturer data:', error);
        // Redirect to login page if there's an error
        navigate('/login', { replace: true });
      }
    } else {
      // No lecturer data found, redirect to login
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);
  
  return (
    <div className="auth-page">
      <div className="loading-container">
        <h2>Authenticating...</h2>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default AuthPage; 