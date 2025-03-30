import React, { useState } from 'react';
import './register.css';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn, FaHome } from "react-icons/fa";
import { Link } from 'react-router-dom';

function Register() {
  const [isActive, setIsActive] = useState(true);

  const handleToggleLogin = () => {
    setIsActive(false);
  };

  return (
    <>
          {/* Back to Home Button */}
          <Link to="/" className="back-to-home">
            <FaHome /> Back to Home
          </Link>
    <div className={`sign-container ${isActive ? 'active' : ''}`} id="sign-container">
      <div className="sign-form-container sign-up">
        <form action="/register" method="POST">
          <h1>Create Account</h1>
          <div className="sign-social-icons">
            <a href="#" className="icon"><FaGoogle /></a>
            <a href="#" className="icon"><FaFacebookF /></a>
            <a href="#" className="icon"><FaGithub /></a>
            <a href="#" className="icon"><FaLinkedinIn /></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" name="username" placeholder="Username" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <input type="password" name="confirm-password" placeholder="Confirm Password" required />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <Link to="/login">
              <button 
                className="hidden" 
                id="login"
                onClick={handleToggleLogin}
              >
                Log In
              </button>
            </Link>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Register;