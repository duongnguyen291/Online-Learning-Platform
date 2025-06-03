import React, { useState } from 'react';
import {
  Email,
  Phone,
  LocationOn,
  School,
  Info,
  Person,
  Edit,
  Camera,
  Save,
  Cancel,
  Lock
} from '@mui/icons-material';
import './StudentProfile.css';

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0123456789',
    address: 'Quận Hai Bà Trưng, Hà Nội',
    major: 'Công nghệ thông tin',
    status: 'Đang học',
    bio: 'Sinh viên năm 3 chuyên ngành Công nghệ thông tin, đam mê lập trình web và phát triển ứng dụng di động. Luôn tìm tòi học hỏi công nghệ mới và ứng dụng vào thực tế.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Saving data:', formData);
    setIsEditing(false);
    setShowPasswordChange(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPasswordChange(false);
  };

  const getStatusChip = (status) => {
    const statusClasses = {
      'Đang học': 'sp-status-active',
      'Tạm nghỉ': 'sp-status-inactive',
      'Đã tốt nghiệp': 'sp-status-graduated'
    };
    
    return (
      <span className={`sp-status-chip ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="sp-container">
      <div className="sp-wrapper">
        <h1 className="sp-page-title">Hồ Sơ Học Viên</h1>
        
        <div className="sp-profile-card">
          <div className="sp-avatar-section">
            {!isEditing && (
              <button className="sp-edit-btn" onClick={() => setIsEditing(true)}>
                <Edit fontSize="small" /> Chỉnh sửa
              </button>
            )}
            
            <div className="sp-avatar-container">
              <img src={avatarUrl} alt="Avatar" className="sp-avatar" />
              {isEditing && (
                <label htmlFor="avatar-upload" className="sp-avatar-overlay">
                  <Camera fontSize="large" />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            
            <div className="sp-student-name">
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="sp-name-input"
                />
              ) : (
                formData.fullName
              )}
            </div>
          </div>

          <div className="sp-info-section">
            {!isEditing ? (
              <div className="sp-info-grid">
                <div className="sp-info-row">
                  <div className="sp-info-icon">
                    <Email />
                  </div>
                  <div className="sp-info-content">
                    <div className="sp-info-label">Email</div>
                    <div className="sp-info-value">{formData.email}</div>
                  </div>
                </div>

                <div className="sp-info-row">
                  <div className="sp-info-icon">
                    <Phone />
                  </div>
                  <div className="sp-info-content">
                    <div className="sp-info-label">Số điện thoại</div>
                    <div className="sp-info-value">{formData.phone}</div>
                  </div>
                </div>

                <div className="sp-info-row">
                  <div className="sp-info-icon">
                    <LocationOn />
                  </div>
                  <div className="sp-info-content">
                    <div className="sp-info-label">Địa chỉ</div>
                    <div className="sp-info-value">{formData.address}</div>
                  </div>
                </div>

                <div className="sp-info-row">
                  <div className="sp-info-icon">
                    <School />
                  </div>
                  <div className="sp-info-content">
                    <div className="sp-info-label">Ngành học</div>
                    <div className="sp-info-value">{formData.major}</div>
                  </div>
                </div>

                <div className="sp-info-row">
                  <div className="sp-info-icon">
                    <Info />
                  </div>
                  <div className="sp-info-content">
                    <div className="sp-info-label">Tình trạng học tập</div>
                    <div className="sp-info-value">{getStatusChip(formData.status)}</div>
                  </div>
                </div>

                <div className="sp-info-row sp-bio-row">
                  <div className="sp-info-icon">
                    <Person />
                  </div>
                  <div className="sp-info-content">
                    <div className="sp-info-label">Giới thiệu bản thân</div>
                    <div className="sp-info-value sp-bio-text">{formData.bio}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="sp-edit-form">
                <div className="sp-form-group">
                  <label className="sp-form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="sp-form-input"
                  />
                </div>

                <div className="sp-form-group">
                  <label className="sp-form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="sp-form-input"
                  />
                </div>

                <div className="sp-form-group">
                  <label className="sp-form-label">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="sp-form-input"
                  />
                </div>

                <div className="sp-form-row">
                  <div className="sp-form-group">
                    <label className="sp-form-label">Ngành học</label>
                    <select
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      className="sp-form-select"
                    >
                      <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                      <option value="Kinh tế">Kinh tế</option>
                      <option value="Ngoại ngữ">Ngoại ngữ</option>
                      <option value="Kỹ thuật">Kỹ thuật</option>
                    </select>
                  </div>

                  <div className="sp-form-group">
                    <label className="sp-form-label">Tình trạng học tập</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="sp-form-select"
                    >
                      <option value="Đang học">Đang học</option>
                      <option value="Tạm nghỉ">Tạm nghỉ</option>
                      <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                    </select>
                  </div>
                </div>

                <div className="sp-form-group">
                  <label className="sp-form-label">Giới thiệu bản thân</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="sp-form-textarea"
                    rows="4"
                  />
                </div>

                {/* Password Change Section */}
                <div className="sp-password-section">
                  <h3 className="sp-password-title">
                    <Lock sx={{ marginRight: 1 }} />
                    Đổi mật khẩu
                  </h3>
                  <div className="sp-form-group">
                    <label className="sp-form-label">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="sp-form-input"
                    />
                  </div>
                  <div className="sp-form-row">
                    <div className="sp-form-group">
                      <label className="sp-form-label">Mật khẩu mới</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="sp-form-input"
                      />
                    </div>
                    <div className="sp-form-group">
                      <label className="sp-form-label">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="sp-form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="sp-action-buttons">
              <button className="sp-btn sp-btn-cancel" onClick={handleCancel}>
                <Cancel /> Hủy bỏ
              </button>
              <button className="sp-btn sp-btn-save" onClick={handleSave}>
                <Save /> Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;