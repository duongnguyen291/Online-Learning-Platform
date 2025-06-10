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
    // Get admin data from URL parameter
    const adminData = searchParams.get('adminData');
    
    if (adminData) {
      try {
        // Parse and store the admin data
        const adminInfo = JSON.parse(decodeURIComponent(adminData));
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Error processing admin data:', error);
        // Redirect to login page if there's an error
        navigate('/login', { replace: true });
      }
    } else {
      // No admin data found, redirect to login
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