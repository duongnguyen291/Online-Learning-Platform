import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './AdminPanel.css';
import NotificationPanel from './NotificationPanel';
import adminData from '../../assets/data/AdminData';
import { 
  BookOpen, 
  Plus, 
  Users, 
  BarChart3,
  Calendar,
  Bell,
  Search,
  Camera,
  Save,
  X
} from 'lucide-react';

const AdminPanel = () => {
  const [activeMenu, setActiveMenu] = useState('courses');
  const [adminInfo, setAdminInfo] = useState(adminData.getAdminInfo());
  const [courses, setCourses] = useState(adminData.getCourses());
  const [notifications, setNotifications] = useState(adminData.getNotifications());
  const [showNotifications, setShowNotifications] = useState(false);  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
  // Cập nhật dữ liệu khi component mount
  setAdminInfo(adminData.getAdminInfo());
  setCourses(adminData.getCourses());
  setNotifications(adminData.getNotifications());
}, []);

  const handleMenuClick = (menuId) => {
    if (menuId === 'logout') {
      console.log('Logging out...');
      return;
    }
    setActiveMenu(menuId);
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditFormData({
      fullName: adminInfo.fullName,
      email: adminInfo.email,
      phone: adminInfo.phone,
      specialization: adminInfo.specialization,
      bio: adminInfo.bio
    });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditFormData({});
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    try {
      const updatedInfo = adminData.updateAdminInfo(editFormData);
      setAdminInfo(updatedInfo);
      setIsEditingProfile(false);
      
      // Thêm thông báo thành công
      adminData.addNotification('Thông tin cá nhân đã được cập nhật thành công', 'success');
      setNotifications(adminData.getNotifications());
      
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thông tin!');
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedInfo = adminData.updateAvatar(e.target.result);
        setAdminInfo(updatedInfo);
        adminData.addNotification('Đã cập nhật ảnh đại diện', 'success');
        setNotifications(adminData.getNotifications());
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = (notificationId) => {
    adminData.markNotificationAsRead(notificationId);
    setNotifications(adminData.getNotifications());
  };

  const handleMarkAllAsRead = () => {
    adminData.markAllNotificationsAsRead();
    setNotifications(adminData.getNotifications());
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  }; 

  const filteredCourses = searchQuery 
    ? adminData.searchCourses(searchQuery)
    : courses;

  const renderMainContent = () => {
    switch (activeMenu) {
      case 'courses':
        return (
          <div className="content-section">
            <div className="content-header">
              <div className="header-info">
                <h1>Khóa học của tôi</h1>
                <p>Quản lý và theo dõi các khóa học bạn đang giảng dạy</p>
              </div>
              <button className="btn-primary">
                <Plus size={20} />
                Tạo khóa học mới
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon courses">
                  <BookOpen size={24} />
                </div>
                <div className="stat-info">
                  <h3>{adminInfo.totalCourses}</h3>
                  <p>Khóa học đang dạy</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon students">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>{adminInfo.totalStudents.toLocaleString()}</h3>
                  <p>Tổng học viên</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon completion">
                  <BarChart3 size={24} />
                </div>
                <div className="stat-info">
                  <h3>{adminInfo.completionRate}%</h3>
                  <p>Tỷ lệ hoàn thành</p>
                </div>
              </div>
            </div>

            <div className="courses-grid">
              {filteredCourses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <div className={`course-status ${course.status}`}>
                      {course.status === 'active' && 'Đang diễn ra'}
                      {course.status === 'planning' && 'Chuẩn bị'}
                      {course.status === 'completed' && 'Hoàn thành'}
                    </div>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-meta">
                    <span>{course.students} học viên</span>
                    <span>•</span>
                    <span>{course.lessons} bài học</span>
                  </div>
                  <div className="course-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${course.progress}%`}}></div>
                    </div>
                    <span>
                      {course.status === 'completed' ? 'Hoàn thành' : 
                       course.status === 'planning' ? `${course.progress}% chuẩn bị` :
                       `${course.progress}% hoàn thành`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="content-section">
            <div className="content-header">
              <div className="header-info">
                <h1>Thông tin của tôi</h1>
                <p>Quản lý thông tin cá nhân và cài đặt tài khoản</p>
              </div>
              {!isEditingProfile && (
                <button className="btn-primary" onClick={handleEditProfile}>
                  Chỉnh sửa thông tin
                </button>
              )}
            </div>

            <div className="profile-content">
              <div className="profile-card">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">
                    {adminInfo.avatar ? (
                      <img src={adminInfo.avatar} alt="Avatar" />
                    ) : (
                      <Users size={40} />
                    )}
                  </div>
                  <div className="avatar-actions">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    <button 
                      className="btn-secondary"
                      onClick={() => document.getElementById('avatar-upload').click()}
                    >
                      <Camera size={16} />
                      Thay đổi ảnh
                    </button>
                  </div>
                </div>
                
                <div className="profile-form">
                  {isEditingProfile ? (
                    <>
                      <div className="form-group">
                        <label>Họ và tên</label>
                        <input 
                          type="text" 
                          value={editFormData.fullName || ''}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input 
                          type="email" 
                          value={editFormData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Số điện thoại</label>
                        <input 
                          type="tel" 
                          value={editFormData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Chuyên môn</label>
                        <input 
                          type="text" 
                          value={editFormData.specialization || ''}
                          onChange={(e) => handleInputChange('specialization', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Giới thiệu</label>
                        <textarea 
                          rows="4" 
                          value={editFormData.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                        />
                      </div>
                      <div className="profile-actions">
                        <button className="btn-primary" onClick={handleSaveProfile}>
                          <Save size={16} />
                          Lưu thay đổi
                        </button>
                        <button className="btn-secondary" onClick={handleCancelEdit}>
                          <X size={16} />
                          Hủy bỏ
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Họ và tên</label>
                        <div className="form-display">{adminInfo.fullName}</div>
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <div className="form-display">{adminInfo.email}</div>
                      </div>
                      <div className="form-group">
                        <label>Số điện thoại</label>
                        <div className="form-display">{adminInfo.phone}</div>
                      </div>
                      <div className="form-group">
                        <label>Chuyên môn</label>
                        <div className="form-display">{adminInfo.specialization}</div>
                      </div>
                      <div className="form-group">
                        <label>Giới thiệu</label>
                        <div className="form-display">{adminInfo.bio}</div>
                      </div>
                      <div className="form-group">
                        <label>Ngày tham gia</label>
                        <div className="form-display">
                          {new Date(adminInfo.joinDate).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="content-section">
            <h1>Chào mừng đến với Admin Panel</h1>
            <p>Chọn một mục từ sidebar để bắt đầu.</p>
          </div>
        );
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
                placeholder="Tìm kiếm khóa học, học viên..." 
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
              <span className="notification-badge">
                {adminData.getUnreadNotificationCount()}
              </span>
            </button>
          </div>
        </header>

        <main className="content-area">
          {renderMainContent()}
        </main>
      </div>
      <NotificationPanel
        notifications={notifications}
        isOpen={showNotifications}
        onClose={handleCloseNotifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  );
};

export default AdminPanel;