import React, { useState, useEffect } from 'react';
import { Camera, Save, X, User } from 'lucide-react';
import './MyProfile.css';

const MyProfile = () => {
  const [lecturerInfo, setLecturerInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load lecturer data from localStorage
    const storedInfo = localStorage.getItem('lecturerInfo');
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        
        // Fetch additional profile data from the server
        fetchLecturerProfile(parsedInfo.userId);
      } catch (error) {
        console.error('Error parsing lecturer info:', error);
        setError('Failed to load profile data');
        setIsLoading(false);
      }
    } else {
      // No stored info, use dummy data
      setLecturerInfo({
        UserCode: 'LECT1234',
        Name: 'Lecturer Name',
        Role: 'Lecturer',
        DOB: new Date().toISOString().split('T')[0],
        Login: 'lecturer@example.com',
        Password: '********'
      });
      setIsLoading(false);
    }
  }, []);

  const fetchLecturerProfile = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v3/profile?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setLecturerInfo(data.user);
      } else {
        throw new Error(data.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditFormData({
      Name: lecturerInfo?.Name || '',
      Login: lecturerInfo?.Login || '',
      DOB: lecturerInfo?.DOB ? new Date(lecturerInfo.DOB).toISOString().split('T')[0] : ''
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    // In a real implementation, you would update the profile on the server
    // For now, we'll just update the local state
    setLecturerInfo(prev => ({
      ...prev,
      ...editFormData
    }));
    
    setIsEditing(false);
    setIsLoading(false);
  };

  // Show loading if lecturerInfo is not loaded yet
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Đang tải thông tin...</div>
      </div>
    );
  }

  // Show error if there was an error loading the profile
  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-header-info">
            <h1>Thông tin của tôi</h1>
            <p>Quản lý thông tin cá nhân và cài đặt tài khoản</p>
          </div>
          {!isEditing && (
            <button className="btn-edit" onClick={handleEditProfile}>
              Chỉnh sửa thông tin
            </button>
          )}
        </div>

        <div className="profile-card">
          <div className="profile-card-content">
            <div className="profile-layout">
              {/* Avatar Section */}
              <div className="profile-avatar-section">
                <div className="profile-avatar-large">
                  <User size={48} className="avatar-icon" />
                </div>
              </div>

              {/* Form Section */}
              <div className="profile-form">
                {isEditing ? (
                  <div className="form-fields">
                    <div className="form-group">
                      <label className="form-label">Họ và tên</label>
                      <input 
                        type="text" 
                        value={editFormData.Name || ''}
                        onChange={(e) => handleInputChange('Name', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        value={editFormData.Login || ''}
                        onChange={(e) => handleInputChange('Login', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Ngày sinh</label>
                      <input 
                        type="date" 
                        value={editFormData.DOB || ''}
                        onChange={(e) => handleInputChange('DOB', e.target.value)}
                        className="form-input"
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
                  </div>
                ) : (
                  <div className="form-fields">
                    <div className="form-group">
                      <label className="form-label">Mã người dùng</label>
                      <div className="form-display">
                        {lecturerInfo.UserCode || 'Chưa cập nhật'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Họ và tên</label>
                      <div className="form-display">
                        {lecturerInfo.Name || 'Chưa cập nhật'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <div className="form-display">
                        {lecturerInfo.Login || 'Chưa cập nhật'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Vai trò</label>
                      <div className="form-display">
                        {lecturerInfo.Role || 'Chưa cập nhật'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Ngày sinh</label>
                      <div className="form-display">
                        {lecturerInfo.DOB ? new Date(lecturerInfo.DOB).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;