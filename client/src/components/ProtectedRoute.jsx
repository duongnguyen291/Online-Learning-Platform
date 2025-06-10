import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * A component that protects routes based on user roles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 * @returns {React.ReactNode} - Either the children or a redirect to login
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check for user info in localStorage
    const userInfo = localStorage.getItem('userInfo');
    const lecturerInfo = localStorage.getItem('lecturerInfo');
    const adminInfo = localStorage.getItem('adminInfo');

    // Parse the info objects if they exist
    const user = userInfo ? JSON.parse(userInfo) : null;
    const lecturer = lecturerInfo ? JSON.parse(lecturerInfo) : null;
    const admin = adminInfo ? JSON.parse(adminInfo) : null;

    // Determine if the current user has an allowed role
    let hasAllowedRole = false;
    
    if (user && user.isLoggedIn && allowedRoles.includes(user.role?.toLowerCase())) {
      hasAllowedRole = true;
    }
    
    if (lecturer && lecturer.isLoggedIn && allowedRoles.includes(lecturer.role?.toLowerCase())) {
      hasAllowedRole = true;
    }
    
    if (admin && admin.isLoggedIn && allowedRoles.includes(admin.role?.toLowerCase())) {
      hasAllowedRole = true;
    }

    setIsAuthorized(hasAllowedRole);
    setIsLoading(false);
  }, [allowedRoles]);

  if (isLoading) {
    // Show loading state while checking authorization
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    // Redirect to login if not authorized
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authorized
  return children;
};

export default ProtectedRoute; 