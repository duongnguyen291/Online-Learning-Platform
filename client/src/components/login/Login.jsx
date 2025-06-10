import React, { useState } from 'react';
import './login.css';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn, FaHome } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

function LoginForm() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('student'); // 'student' or 'admin'
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggleRegister = () => {
    setIsActive(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const formData = new FormData(e.target);
    const data = {
      login: formData.get('login'),
      password: formData.get('password')
    };

    try {
      if (userType === 'student') {
        // Student login
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
            login: result.user.login,
            password: result.user.password,
            userId: result.user.userCode,
            name: result.user.name,
            role: result.user.role || 'student'
          }));
          
          // Redirect to home page
          navigate('/');
        } else {
          setError(result.message || 'Login failed. Please check your credentials.');
        }
      } else {
        // Admin login
        const response = await fetch('http://localhost:5000/api/v2/admin-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          // Create admin info object
          const adminInfo = {
            isLoggedIn: true,
            login: result.admin.login,
            password: result.admin.password,
            userId: result.admin.userCode,
            name: result.admin.name,
            role: result.admin.role || 'admin'
          };
          
          // Store in client localStorage
          localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
          
          // Method 1: Use localStorage synchronization via iframe
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = 'http://localhost:3001/auth-sync.html';
          document.body.appendChild(iframe);
          
          // Wait for iframe to load
          iframe.onload = () => {
            // Send admin info to iframe
            iframe.contentWindow.postMessage({
              type: 'SYNC_ADMIN_DATA',
              adminInfo: adminInfo
            }, 'http://localhost:3001');
            
            // Redirect after a short delay to ensure data is saved
            setTimeout(() => {
              window.location.href = 'http://localhost:3001/';
            }, 500);
          };
          
          // Fallback if iframe method fails
          setTimeout(() => {
            // Remove iframe if it's still there
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
              
              // Use URL parameters as fallback
              const encodedAdminInfo = encodeURIComponent(JSON.stringify(adminInfo));
              window.location.href = `http://localhost:3001/auth?adminData=${encodedAdminInfo}`;
            }
          }, 2000);
        } else {
          setError(result.message || 'Admin login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
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
            
            {/* User Type Selection */}
            <div className="user-type-selector">
              <label>
                <input 
                  type="radio" 
                  name="userType" 
                  value="student" 
                  checked={userType === 'student'} 
                  onChange={() => setUserType('student')}
                />
                <span>Student</span>
              </label>
              <label>
                <input 
                  type="radio" 
                  name="userType" 
                  value="admin" 
                  checked={userType === 'admin'} 
                  onChange={() => setUserType('admin')}
                />
                <span>Admin</span>
              </label>
            </div>
            
            <input type="email" name="login" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <a href="#">Forget Your Password?</a>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
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