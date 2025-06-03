import React, { useState, useEffect } from 'react';
import { Camera, Save, X, User } from 'lucide-react';
import './MyProfile.css';

// Import AdminData
class AdminData {
  constructor() {
    this.adminInfo = {
      id: 'admin001',
      fullName: 'Nguyễn Văn A',
      email: 'gvien@email.com',
      phone: '0123456789',
      specialization: 'Lập trình Web, Mobile',
      bio: 'Giảng viên với 8 năm kinh nghiệm trong lĩnh vực phát triển phần mềm và đào tạo lập trình.',
      avatar: null,
      joinDate: '2020-01-15',
      totalCourses: 12,
      totalStudents: 1245,
      completionRate: 89,
      weeklyClasses: 24
    };
  }

  getAdminInfo() {
    return { ...this.adminInfo };
  }

  updateAdminInfo(updatedInfo) {
    this.adminInfo = {
      ...this.adminInfo,
      ...updatedInfo
    };
    return this.adminInfo;
  }

  updateAvatar(avatarData) {
    this.adminInfo.avatar = avatarData;
    return this.adminInfo;
  }
}

const adminData = new AdminData();

const MyProfile = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    // Load admin data when component mounts
    const data = adminData.getAdminInfo();
    setAdminInfo(data);
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditFormData({
      fullName: adminInfo?.fullName || '',
      email: adminInfo?.email || '',
      phone: adminInfo?.phone || '',
      specialization: adminInfo?.specialization || '',
      bio: adminInfo?.bio || ''
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

  const handleSaveProfile = () => {
    const updatedInfo = adminData.updateAdminInfo(editFormData);
    setAdminInfo(updatedInfo);
    setIsEditing(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedInfo = adminData.updateAvatar(e.target.result);
        setAdminInfo(updatedInfo);
      };
      reader.readAsDataURL(file);
    }
  };

  // Show loading if adminInfo is not loaded yet
  if (!adminInfo) {
    return (
      <div className="loading-container">
        <div className="loading-text">Đang tải thông tin...</div>
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
                  {adminInfo.avatar ? (
                    <img 
                      src={adminInfo.avatar} 
                      alt="Avatar"
                    />
                  ) : (
                    <User size={48} className="avatar-icon" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="avatar-upload-input"
                  />
                  <button 
                    className="avatar-upload-btn"
                    onClick={() => document.getElementById('avatar-upload').click()}
                  >
                    <Camera size={16} />
                    Thay đổi ảnh
                  </button>
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
                        value={editFormData.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        value={editFormData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Số điện thoại</label>
                      <input 
                        type="tel" 
                        value={editFormData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Chuyên môn</label>
                      <input 
                        type="text" 
                        value={editFormData.specialization || ''}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Giới thiệu</label>
                      <textarea 
                        rows="4" 
                        value={editFormData.bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="form-textarea"
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
                      <label className="form-label">Họ và tên</label>
                      <div className="form-display">
                        {adminInfo.fullName || 'Chưa cập nhật'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <div className="form-display">
                        {adminInfo.email || 'Chưa cập nhật'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Số điện thoại</label>
                      <div className="form-display">
                        {adminInfo.phone || 'Chưa cập nhật'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Chuyên môn</label>
                      <div className="form-display">
                        {adminInfo.specialization || 'Chưa cập nhật'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Giới thiệu</label>
                      <div className="form-display bio-display">
                        {adminInfo.bio || 'Chưa cập nhật'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Ngày tham gia</label>
                      <div className="form-display">
                        {adminInfo.joinDate ? new Date(adminInfo.joinDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
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