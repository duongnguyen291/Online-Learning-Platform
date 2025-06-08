import React, { useState } from 'react';
import './register.css';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn, FaHome } from "react-icons/fa";
import { Link } from 'react-router-dom';

function Register() {
  const [isActive, setIsActive] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState('');

  const handleToggleLogin = () => {
    setIsActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Add the default role
    data.role = 'Student';

    // Send the data to the backend
    fetch('http://localhost:5000/api/v1/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setRegistrationStatus('pending');
      } else {
        setRegistrationStatus('error');
        alert(data.message || 'Registration failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setRegistrationStatus('error');
      alert('An error occurred during registration');
    });
  };

  if (registrationStatus === 'pending') {
    return (
      <div className="registration-status-container">
        <h2>Registration Submitted!</h2>
        <p>Your registration request has been submitted successfully and is pending admin approval.</p>
        <p>You will be able to log in once an administrator approves your registration.</p>
        <Link to="/login" className="back-to-login">
          <button>Back to Login</button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Back to Home Button */}
      <Link to="/" className="back-to-home">
        <FaHome /> Back to Home
      </Link>
      <div className={`sign-container ${isActive ? 'active' : ''}`} id="sign-container">
        <div className="sign-form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <div className="sign-social-icons">
              <a href="#" className="icon"><FaGoogle /></a>
              <a href="#" className="icon"><FaFacebookF /></a>
              <a href="#" className="icon"><FaGithub /></a>
              <a href="#" className="icon"><FaLinkedinIn /></a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" name="userCode" placeholder="User Code" required />
            <input type="text" name="name" placeholder="Full Name" required />
            <input type="date" name="DOB" required />
            <input type="text" name="login" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
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