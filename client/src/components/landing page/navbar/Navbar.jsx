import React from 'react'
import "./navbar.css"
import logo from "../../../assets/images/Edusmart.png"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="logo">
        <img src={logo} alt="edusmart-logo" />
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
        <Link to="/login" className="login-button">
          Log in
        </Link>
        <Link to="/register" className="signup-button">
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default Navbar