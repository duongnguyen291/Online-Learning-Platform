import React, { useState } from 'react'
import "./navbar2.css"
import logo from "../../../assets/images/Edusmart.png"
import { Link } from "react-router-dom"
import { getCurrentStudent } from "../../../assets/data/student" // Import hàm lấy thông tin học viên

const Navbar2 = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Lấy thông tin học viên hiện tại
  const currentStudent = getCurrentStudent()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleSignOut = () => {
    // Thêm logic sign out ở đây (clear token, redirect, etc.)
    console.log("Sign out clicked")
    // Ví dụ: localStorage.removeItem('token')
    // window.location.href = '/'
  }

  return (
    <div className="navbar-container">
      {/* Logo bên trái */}
      <div className="logo">
        <a href="/">
          <img src={logo} alt="edusmart-logo" />
        </a>
      </div>

      {/* Navigation items ở giữa */}
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

      {/* Avatar học viên bên phải */}
      <div className="side-nav-items">
        <div className="user-avatar-section">
          <div className="avatar-container" onClick={toggleDropdown}>
            <img 
              src={currentStudent?.avatar || "/src/assets/images/avatar.jpg"} // Lấy avatar từ student data
              alt="User Avatar" 
              className="user-avatar"
            />
            <span className="user-name">{currentStudent?.name || "Học viên"}</span>
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
                Thông tin cá nhân
              </Link>
              <Link to="/my-courses" className="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Khóa học của tôi
              </Link>
              <Link to="/certificates" className="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Chứng chỉ
              </Link>
              <Link to="/settings" className="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Cài đặt
              </Link>
              <hr className="dropdown-divider" />
              <button onClick={handleSignOut} className="dropdown-item sign-out">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar2