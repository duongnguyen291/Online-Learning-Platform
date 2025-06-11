import React, { useState } from 'react';
import './register.css';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn, FaHome } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggleLogin = () => {
    setIsActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const formData = new FormData(e.target);
    const rawData = Object.fromEntries(formData);
    
    try {
      // Generate a unique user code based on role
      const rolePrefix = rawData.role === 'Lecturer' ? 'LEC' : 'STU';
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const userCode = `${rolePrefix}${randomNum}`;

      // Format data according to the schema
      const formattedData = {
        UserCode: userCode,
        Name: rawData.name,
        Role: rawData.role,
        DOB: rawData.DOB,
        Login: rawData.login,
        Password: rawData.password,
        Status: 'pending'
      };

      // Different endpoints for lecturer and student registrations
      const endpoint = rawData.role === 'Lecturer' 
        ? 'http://localhost:5000/api/v1/pending-registration'
        : 'http://localhost:5000/api/v1/register';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(formattedData)
      });

      const result = await response.json();

      if (result.success) {
        if (rawData.role === 'Lecturer') {
          alert('Registration submitted successfully! Please wait for admin approval.');
        } else {
          alert('Registration successful! You can now log in.');
        }
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed');
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during registration');
      alert('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Back to Home Button */}
      <Link to="/" className="back-to-home">
        <FaHome /> Back to Home
      </Link>
      <div className={`sign-container ${isActive ? 'active' : ''}`} id="sign-container">
        <div className="sign-form-container sign-up">
          <form onSubmit={handleSubmit}>
            <div className="sign-social-icons">
              <a href="#" className="icon"><FaGoogle /></a>
              <a href="#" className="icon"><FaFacebookF /></a>
              <a href="#" className="icon"><FaGithub /></a>
              <a href="#" className="icon"><FaLinkedinIn /></a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" name="name" placeholder="Full Name" required />
            <input type="date" name="DOB" required />
            <select name="role" required>
              <option value="">Select Role</option>
              <option value="Student">Student</option>
              <option value="Lecturer">Lecturer</option>
            </select>
            <input type="email" name="login" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Sign Up'}
            </button>
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