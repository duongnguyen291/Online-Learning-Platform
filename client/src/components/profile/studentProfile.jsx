import React, { useState, useEffect } from 'react';
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
  Lock,
  Badge,
  CalendarMonth
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './studentProfile.css';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [formData, setFormData] = useState({
    userCode: '',
    name: '',
    role: '',
    dob: '',
    login: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isLoggedIn || !userInfo.userId) {
      navigate('/login');
      return;
    }

    fetchProfile(userInfo.userId);
  }, [navigate]);

  const fetchProfile = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/profile?userId=${userId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('userInfo');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      if (data.success) {
        setFormData({
          userCode: data.user.UserCode || '',
          name: data.user.Name || '',
          role: data.user.Role || '',
          dob: data.user.DOB ? new Date(data.user.DOB).toISOString().split('T')[0] : '',
          login: data.user.Login || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setLoading(false);
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    // TODO: Implement save functionality when backend endpoint is available
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    
    // Get userId from localStorage and fetch profile again
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.userId) {
      fetchProfile(userInfo.userId);
    }
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

  if (loading) {
    return <div className="sp-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="sp-error">{error}</div>;
  }

  return (
    <div className="sp-container">
      <div className="sp-wrapper">
        <h1 className="sp-page-title">User Profile</h1>
        
        <div className="sp-profile-card">
          <div className="sp-avatar-section">
            {!isEditing && (
              <button className="sp-edit-btn" onClick={() => setIsEditing(true)}>
                <Edit fontSize="small" /> Edit Profile
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
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="sp-name-input"
                />
              ) : (
                formData.name
              )}
            </div>
          </div>

          <div className="sp-info-section">
            {!isEditing ? (
              <div className="sp-info-grid">
                <div className="sp-info-row">
                  <div className="sp-info-icon">
                    <Badge />
                  </div>
                  <div className="sp-info-content">
                    <div className="sp-info-label">User ID</div>
                    <div className="sp-info-value">{formData.userCode}</div>
                  </div>
                </div>

                <div className="sp-info-row">
                  <div className="sp-info-icon">
                    <Email />
                  </div>
                  <div className="sp-info-content">
                    <div className="sp-info-label">Login Email</div>
                    <div className="sp-info-value">{formData.login}</div>
                  </div>
                </div>

                <div className="sp-info-row">
                  <div className="sp-info-icon">
                    <School />
                  </div>
                  <div className="sp-info-content">
                    <div className="sp-info-label">Role</div>
                    <div className="sp-info-value">{formData.role}</div>
                  </div>
                </div>

                <div className="sp-info-row">
                  <div className="sp-info-icon">
                    <CalendarMonth />
                  </div>
                  <div className="sp-info-content">
                    <div className="sp-info-label">Date of Birth</div>
                    <div className="sp-info-value">
                      {new Date(formData.dob).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="sp-edit-form">
                <div className="sp-form-group">
                  <label className="sp-form-label">User ID</label>
                  <input
                    type="text"
                    name="userCode"
                    value={formData.userCode}
                    disabled
                    className="sp-form-input sp-input-disabled"
                  />
                </div>

                <div className="sp-form-group">
                  <label className="sp-form-label">Login Email</label>
                  <input
                    type="email"
                    name="login"
                    value={formData.login}
                    disabled
                    className="sp-form-input sp-input-disabled"
                  />
                </div>

                <div className="sp-form-group">
                  <label className="sp-form-label">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    disabled
                    className="sp-form-input sp-input-disabled"
                  />
                </div>

                <div className="sp-form-group">
                  <label className="sp-form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="sp-form-input"
                  />
                </div>

                <div className="sp-form-actions">
                  <button onClick={handleCancel} className="sp-btn sp-btn-cancel">
                    <Cancel fontSize="small" /> Cancel
                  </button>
                  <button onClick={handleSave} className="sp-btn sp-btn-save">
                    <Save fontSize="small" /> Save Changes
                  </button>
                </div>

                <div className="sp-password-section">
                  <button 
                    onClick={() => setShowPasswordChange(!showPasswordChange)} 
                    className="sp-btn sp-btn-password"
                  >
                    <Lock fontSize="small" /> Change Password
                  </button>
                  
                  {showPasswordChange && (
                    <div className="sp-password-form">
                      <div className="sp-form-group">
                        <label className="sp-form-label">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="sp-form-input"
                        />
                      </div>
                      
                      <div className="sp-form-group">
                        <label className="sp-form-label">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="sp-form-input"
                        />
                      </div>
                      
                      <div className="sp-form-group">
                        <label className="sp-form-label">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="sp-form-input"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;