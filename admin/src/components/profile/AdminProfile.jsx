import React, { useState, useEffect } from 'react';
import { Camera, Save, X, User, Eye, EyeOff } from 'lucide-react';
import './Profile.css';
import axios from 'axios';

const AdminProfile = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v2/profile');
      if (response.data.success) {
        setAdminInfo(response.data.admin);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditFormData({
      Name: adminInfo?.Name || '',
      Login: adminInfo?.Login || '',
      DOB: adminInfo?.DOB ? new Date(adminInfo.DOB).toISOString().split('T')[0] : '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (editFormData.newPassword && editFormData.newPassword !== editFormData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put('http://localhost:5000/api/v2/profile/update', editFormData);
      if (response.data.success) {
        setAdminInfo(response.data.admin);
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdminInfo(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not updated';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  if (!adminInfo) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-header-info">
            <h1>My Profile</h1>
            <p>Manage your account information and settings</p>
          </div>
          {!isEditing && (
            <button className="btn-edit" onClick={handleEditProfile}>
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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
                    Change Photo
                  </button>
                </div>
              </div>

              {/* Form Section */}
              <div className="profile-form">
                {isEditing ? (
                  <div className="form-fields">
                    <div className="form-group">
                      <label className="form-label">User Code</label>
                      <div className="form-display">
                        {adminInfo.UserCode}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        value={editFormData.Name || ''}
                        onChange={(e) => handleInputChange('Name', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Login</label>
                      <input 
                        type="text" 
                        value={editFormData.Login || ''}
                        onChange={(e) => handleInputChange('Login', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input 
                        type="date" 
                        value={editFormData.DOB || ''}
                        onChange={(e) => handleInputChange('DOB', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    {/* Password Section */}
                    <div className="password-section">
                      <h3 className="password-section-title">
                        Change Password (Optional)
                      </h3>
                      
                      <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <div className="password-input-wrapper">
                          <input 
                            type={showCurrentPassword ? "text" : "password"}
                            value={editFormData.currentPassword || ''}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                            className="form-input password-input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="password-toggle-btn"
                          >
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <div className="password-input-wrapper">
                          <input 
                            type={showNewPassword ? "text" : "password"}
                            value={editFormData.newPassword || ''}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            className="form-input password-input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="password-toggle-btn"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <div className="password-input-wrapper">
                          <input 
                            type={showConfirmPassword ? "text" : "password"}
                            value={editFormData.confirmPassword || ''}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="form-input password-input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="password-toggle-btn"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="profile-actions">
                      <button 
                        className="btn-primary" 
                        onClick={handleSaveProfile}
                        disabled={loading}
                      >
                        <Save size={16} />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button className="btn-secondary" onClick={handleCancelEdit}>
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="form-fields">
                    <div className="form-group">
                      <label className="form-label">User Code</label>
                      <div className="form-display">
                        {adminInfo.UserCode || 'Not updated'}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <div className="form-display">
                        {adminInfo.Name || 'Not updated'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Login</label>
                      <div className="form-display">
                        {adminInfo.Login || 'Not updated'}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <div className="form-display">
                        {formatDate(adminInfo.DOB)}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <div className="form-display">
                        {adminInfo.Role || 'Not updated'}
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

export default AdminProfile;