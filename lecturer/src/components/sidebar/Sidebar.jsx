import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  User, 
  LogOut,
  GraduationCap,
  X,
  AlertTriangle
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('');
  const [lecturerInfo, setLecturerInfo] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Get path from URL to set active menu
    const path = window.location.pathname;
    if (path.includes('/courses')) {
      setActiveMenu('courses');
    } else if (path.includes('/profile')) {
      setActiveMenu('profile');
    }

    // Get lecturer info from localStorage
    const storedInfo = localStorage.getItem('lecturerInfo');
    if (storedInfo) {
      setLecturerInfo(JSON.parse(storedInfo));
    }
  }, []);

  const handleMenuClick = (menuId) => {
    if (menuId === 'logout') {
      setShowLogoutConfirm(true);
      return;
    }

    setActiveMenu(menuId);
    
    switch (menuId) {
      case 'courses':
        navigate('/courses');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('lecturerInfo');
    localStorage.removeItem('token');
    
    // Redirect to main application
    window.location.href = 'http://localhost:3000';
  };

  const menuItems = [
    {
      id: 'courses',
      label: 'Khóa học của tôi',
      icon: BookOpen
    },
    {
      id: 'profile',
      label: 'Thông tin của tôi',
      icon: User
    },
    {
      id: 'logout',
      label: 'Đăng xuất',
      icon: LogOut,
      isAction: true
    }
  ];

  return (
    <>
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <GraduationCap size={32} />
          <h2>EduSmart</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="nav-item-group">
              <button
                className={`sidebar-item ${activeMenu === item.id ? 'active' : ''} ${item.isAction ? 'action-item' : ''}`}
                  onClick={() => handleMenuClick(item.id)}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="teacher-info">
          <div className="teacher-avatar">
            <User size={16} />
          </div>
          <div className="teacher-details">
              <p className="teacher-name">{lecturerInfo?.name || 'Giảng viên'}</p>
              <p className="teacher-role">Lecturer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div className="modal-title">
                <AlertTriangle size={20} />
                <h3>Xác nhận đăng xuất</h3>
              </div>
              <button 
                className="modal-close" 
                onClick={() => setShowLogoutConfirm(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Hủy bỏ
              </button>
              <button 
                className="confirm-button"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default Sidebar;