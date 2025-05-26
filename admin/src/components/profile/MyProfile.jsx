import React, { useState } from 'react';
import { Camera, Save, X, User } from 'lucide-react';
import './MyProfile.css';

const MyProfile = ({ adminInfo, onUpdateProfile, onUpdateAvatar }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditFormData({
      fullName: adminInfo.fullName,
      email: adminInfo.email,
      phone: adminInfo.phone,
      specialization: adminInfo.specialization,
      bio: adminInfo.bio
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
    onUpdateProfile(editFormData);
    setIsEditing(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdateAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="content-section">
      <div className="content-header">
        <div className="header-info">
          <h1>Thông tin của tôi</h1>
          <p>Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>
        {!isEditing && (
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
                <User size={40} />
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
            {isEditing ? (
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
};

export default MyProfile; 