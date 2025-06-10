import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // First check if adminInfo already exists in localStorage (from iframe method)
    const existingAdminInfo = localStorage.getItem('adminInfo');
    
    if (existingAdminInfo) {
      try {
        // Validate the existing admin info
        const adminData = JSON.parse(existingAdminInfo);
        if (adminData && adminData.isLoggedIn) {
          console.log('Using existing admin data from localStorage');
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Error parsing existing admin data:', error);
        // Continue with URL parameter method if parsing fails
      }
    }
    
    // Get admin data from URL parameters (fallback method)
    const params = new URLSearchParams(location.search);
    const adminDataParam = params.get('adminData');
    
    if (adminDataParam) {
      try {
        // Decode and parse the admin data
        const adminData = JSON.parse(decodeURIComponent(adminDataParam));
        
        // Store admin data in localStorage
        localStorage.setItem('adminInfo', JSON.stringify(adminData));
        
        console.log('Admin data saved to localStorage from URL parameters:', adminData);
        
        // Redirect to the main admin page
        navigate('/');
      } catch (error) {
        console.error('Error processing admin data from URL:', error);
        navigate('/login');
      }
    } else {
      // No admin data found in URL parameters or localStorage, redirect to login
      console.error('No admin data found in URL parameters or localStorage');
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Authenticating...</p>
    </div>
  );
};

export default AuthHandler; 