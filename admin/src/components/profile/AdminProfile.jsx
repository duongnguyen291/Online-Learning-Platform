import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import './Profile.css';
import axios from 'axios';

const AdminProfile = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    console.log('Fetching admin profile...');
    try {
      const storedAdminInfo = localStorage.getItem('adminInfo');
      console.log('Raw stored admin info:', storedAdminInfo);
      
      if (!storedAdminInfo) {
        setError('Admin information not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      let parsedAdminInfo;
      try {
        parsedAdminInfo = JSON.parse(storedAdminInfo);
        console.log('Parsed admin info:', parsedAdminInfo);
      } catch (err) {
        console.error('Error parsing admin info from localStorage:', err);
        setError('Invalid admin information. Please log in again.');
        setLoading(false);
        return;
      }
      
      if (!parsedAdminInfo.login) {
        console.error('No login found in admin info');
        setError('Invalid admin information. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Try GET request with query params first
      try {
        console.log('Attempting GET request...');
        const response = await axios.get(`http://localhost:5000/api/v2/profile?login=${parsedAdminInfo.login}`);
        console.log('GET response:', response.data);
        
        if (response.data.success) {
          console.log('Setting admin info from GET response:', response.data.admin);
          setAdminInfo({
            UserCode: response.data.admin.userCode,
            Name: response.data.admin.name,
            Login: response.data.admin.login,
            DOB: response.data.admin.dob,
            Role: response.data.admin.role
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('GET request failed, trying POST...', err);
      }
      
      // If GET fails, try POST with body
      console.log('Attempting POST request...');
      try {
        const response = await axios.post('http://localhost:5000/api/v2/profile', {
          login: parsedAdminInfo.login
        });
        console.log('POST response:', response.data);
        
        if (response.data.success) {
          console.log('Setting admin info from POST response:', response.data.admin);
          setAdminInfo({
            UserCode: response.data.admin.userCode,
            Name: response.data.admin.name,
            Login: response.data.admin.login,
            DOB: response.data.admin.dob,
            Role: response.data.admin.role
          });
        } else {
          setError(response.data.message || 'Failed to fetch profile data');
        }
      } catch (err) {
        console.error('POST request error:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
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
      const storedAdminInfo = localStorage.getItem('adminInfo');
      if (!storedAdminInfo) {
        setError('Admin information not found. Please log in again.');
        return;
      }
      
      const parsedAdminInfo = JSON.parse(storedAdminInfo);
      
      // Add the current login to the form data
      const updatedFormData = {
        ...editFormData,
        currentLogin: parsedAdminInfo.login
      };
      
      const response = await axios.put(
        `http://localhost:5000/api/v2/profile/update?currentLogin=${parsedAdminInfo.login}`, 
        updatedFormData
      );
      
      if (response.data.success) {
        // Update local state
        setAdminInfo({
          UserCode: response.data.admin.userCode,
          Name: response.data.admin.name,
          Login: response.data.admin.login,
          DOB: response.data.admin.dob,
          Role: response.data.admin.role
        });
        
        // Update localStorage
        const updatedAdminInfo = {
          ...parsedAdminInfo,
          name: response.data.admin.name,
          login: response.data.admin.login,
          role: response.data.admin.role,
          dob: response.data.admin.dob
        };
        
        if (editFormData.newPassword) {
          updatedAdminInfo.password = editFormData.newPassword;
        }
        
        localStorage.setItem('adminInfo', JSON.stringify(updatedAdminInfo));
        
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <div className="loading-text error-message">{error}</div>
        <button onClick={fetchAdminProfile} className="btn-primary">Retry</button>
      </div>
    );
  }

  if (!adminInfo) {
    return (
      <div className="loading-container">
        <div className="loading-text">No profile data found. Please log in again.</div>
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
                  <label htmlFor="avatar-upload" className="avatar-upload-btn">
                    Change Photo
                  </label>
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="profile-form">
                {!isEditing ? (
                  <div className="form-fields">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <div className="form-display">{adminInfo.Name || 'Not set'}</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email/Login</label>
                      <div className="form-display">{adminInfo.Login || 'Not set'}</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <div className="form-display">{formatDate(adminInfo.DOB)}</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <div className="form-display">{adminInfo.Role || 'Admin'}</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">User Code</label>
                      <div className="form-display">{adminInfo.UserCode || 'Not available'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="form-fields">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        className="form-input"
                        value={editFormData.Name || ''}
                        onChange={(e) => handleInputChange('Name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email/Login</label>
                      <input
                        type="email"
                        id="email"
                        className="form-input"
                        value={editFormData.Login || ''}
                        onChange={(e) => handleInputChange('Login', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="dob">Date of Birth</label>
                      <input
                        type="date"
                        id="dob"
                        className="form-input"
                        value={editFormData.DOB || ''}
                        onChange={(e) => handleInputChange('DOB', e.target.value)}
                      />
                    </div>
                    
                    <div className="password-section">
                      <h3 className="password-section-title">Change Password</h3>
                      
                      <div className="form-group">
                        <label className="form-label" htmlFor="current-password">Current Password</label>
                        <div className="password-input-wrapper">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="current-password"
                            className="form-input password-input"
                            value={editFormData.currentPassword || ''}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="new-password">New Password</label>
                        <div className="password-input-wrapper">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="new-password"
                            className="form-input password-input"
                            value={editFormData.newPassword || ''}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="confirm-password">Confirm New Password</label>
                        <div className="password-input-wrapper">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirm-password"
                            className="form-input password-input"
                            value={editFormData.confirmPassword || ''}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="profile-actions">
                      <button className="btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                      <button className="btn-primary" onClick={handleSaveProfile}>Save Changes</button>
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