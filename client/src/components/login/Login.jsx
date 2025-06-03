import React, { useState } from 'react';
import './login.css';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn, FaHome } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

function LoginForm() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleToggleRegister = () => {
    setIsActive(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
      login: formData.get('login'),
      password: formData.get('password')
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        // Store user info in localStorage
        localStorage.setItem('userInfo', JSON.stringify({
          isLoggedIn: true,
          email: data.login
        }));
        // Redirect to home page
        navigate('/');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      {/* Back to Home Button */}
      <Link to="/" className="back-to-home">
        <FaHome /> Back to Home
      </Link>
      
      <div className={`sign-container ${isActive ? 'active' : ''}`} id="sign-container">
        <div className="sing-form-container sign-in">
            <form onSubmit={handleSubmit}>
            <h1>Log In</h1>
            <div className="sign-social-icons">
                <a href="#" className="icon"><FaGoogle /></a>
                <a href="#" className="icon"><FaFacebookF /></a>
                <a href="#" className="icon"><FaGithub /></a>
                <a href="#" className="icon"><FaLinkedinIn /></a>
            </div>
            <span>or use your email password</span>
            <input type="email" name="login" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <a href="#">Forget Your Password?</a>
            <button type="submit">Log In</button>
            </form>
        </div>
        
        <div className="toggle-container">
            <div className="toggle">
            <div className="toggle-panel toggle-left">
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of site features</p>
            </div>
            <div className="toggle-panel toggle-right">
                <h1>Hello, Friend!</h1>
                <p>Register with your personal details to use all of site features</p>
                <Link to="/register">
                <button 
                    className="hidden" 
                    id="register"
                    onClick={handleToggleRegister}
                >
                    Sign Up
                </button>
                </Link>
            </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;