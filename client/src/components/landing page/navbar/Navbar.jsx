import React, { useState, useEffect } from 'react'
import "./navbar.css"
import logo from "../../../assets/images/Edusmart.png"
import { Link, useNavigate } from "react-router-dom"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.isLoggedIn) {
      setIsLoggedIn(true);
      setUserEmail(userInfo.email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Clear user info from localStorage
        localStorage.removeItem('userInfo');
        setIsLoggedIn(false);
        setUserEmail('');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="navbar-container">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="edusmart-logo" />
        </a>
      </div>

      <div className="nav-items">
        <Link to="/courses" className="nav-link">
          <h3>Course</h3>
        </Link>
        <Link to="/chatbot" className="nav-link">
          <h3>Chatbot</h3>
        </Link>
        <Link to="/how-to-use" className="nav-link">
          <h3>How to use</h3>
        </Link>
        <Link to="/about" className="nav-link">
          <h3>About us</h3>
        </Link>
      </div>

      <div className="side-nav-items">
        {isLoggedIn ? (
          <>
            <span className="user-email">{userEmail}</span>
            <button onClick={handleLogout} className="logout-button">
              Log out
            </button>
          </>
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