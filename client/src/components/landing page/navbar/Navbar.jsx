import React, { useState, useEffect } from 'react'
import "./navbar.css"
import "./navbar2.css"
import logo from "../../../assets/images/Edusmart.png"
import { Link, useNavigate, useLocation } from "react-router-dom"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userLogin, setUserLogin] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check login status from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.isLoggedIn) {
      setIsLoggedIn(true);
      setUserName(userInfo.name || '');
      setUserLogin(userInfo.login || '');
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // Always clear localStorage, regardless of server response
      localStorage.removeItem('userInfo');
      setIsLoggedIn(false);
      setUserName('');
      setUserLogin('');
      
      // If we're not on the landing page, navigate to it
      if (location.pathname !== '/') {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear localStorage even if server request fails
      localStorage.removeItem('userInfo');
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar-container">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="edusmart-logo" />
        </Link>
      </div>

      <div className="nav-items">
        <Link to="/courses" className="nav-link">
          <h3>Course</h3>
        </Link>
        <Link to="/chatbot" className="nav-link">
          <h3>Chatbot</h3>
        </Link>
      </div>

      <div className="side-nav-items">
        {isLoggedIn ? (
          <div className="user-avatar-section">
            <div className="avatar-container" onClick={toggleDropdown}>
              <img 
                src="/src/assets/images/avatar.jpg"
                alt="User Avatar" 
                className="user-avatar"
              />
              <span className="user-name">{userName || userLogin}</span>
              <svg 
                className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Profile
                </Link>
                <Link to="/my-courses" className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  My Courses
                </Link>
                <hr className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item sign-out">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="login-button">
              Log in
            </Link>
            <Link to="/register" className="signup-button">
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar