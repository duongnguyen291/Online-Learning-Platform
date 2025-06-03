import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './AdminPanel.css';
import NotificationPanel from './NotificationPanel';
import MyCourses from '../courses/MyCourses';
import MyProfile from '../profile/MyProfile';
import EditCoursePage from '../../pages/EditCoursePage';
import CreateCoursePage from '../../pages/CreateCoursePage';
import { Bell, Search } from 'lucide-react';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../../data/courseData';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);  
  const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
    // Load initial data
    setCourses(getCourses());
}, []);

  const handleMenuClick = (menuId) => {
    if (menuId === 'logout') {
      console.log('Logging out...');
      return;
    }
    setActiveMenu(menuId);

    // Update URL based on menu selection
    switch (menuId) {
      case 'courses':
        navigate('/admin/courses');
        break;
      case 'profile':
        navigate('/admin/profile');
        break;
      default:
        navigate('/admin');
    }
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  }; 

  // Course management handlers
  const handleCreateCourse = (courseData) => {
    addCourse(courseData);
    setCourses(getCourses());
    // Add notification
    const newNotification = {
      id: `notification_${Date.now()}`,
      message: 'Đã tạo khóa học mới thành công',
      type: 'success',
      read: false,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleEditCourse = (courseData) => {
    updateCourse(courseData.id, courseData);
    setCourses(getCourses());
    // Add notification
    const newNotification = {
      id: `notification_${Date.now()}`,
      message: 'Đã cập nhật khóa học thành công',
      type: 'success',
      read: false,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      deleteCourse(courseId);
      setCourses(getCourses());
      // Add notification
      const newNotification = {
        id: `notification_${Date.now()}`,
        message: 'Đã xóa khóa học thành công',
        type: 'success',
        read: false,
        timestamp: new Date()
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  return (
    <div className="admin-panel">
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
      
      <div className="main-content">
        <header className="top-header">
          <div className="search-section">
            <div className="search-box">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm khóa học..." 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className="notification-btn"
              onClick={handleToggleNotifications}
            >
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
              <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
              </span>
              )}
            </button>
          </div>
        </header>

        <main className="content-area">
          <Routes>
            <Route path="/" element={
              <MyCourses
                courses={courses}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
                onCreateCourse={handleCreateCourse}
              />
            } />
            <Route path="/courses" element={
              <MyCourses
                courses={courses}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
                onCreateCourse={handleCreateCourse}
              />
            } />
            <Route path="/courses/new" element={
              <CreateCoursePage
                onCreateCourse={handleCreateCourse}
              />
            } />
            <Route path="/courses/edit/:courseId" element={
              <EditCoursePage
                courses={courses}
                onEditCourse={handleEditCourse}
              />
            } />
            <Route path="/profile" element={
              <MyProfile />
            } />
          </Routes>
        </main>
      </div>

      <NotificationPanel
        notifications={notifications}
        isOpen={showNotifications}
        onClose={handleCloseNotifications}
      />
    </div>
  );
};

export default AdminPanel;