import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { GraduationCap } from 'lucide-react';

import { UserOutlined, TeamOutlined, ProfileOutlined, LogoutOutlined, BookFilled } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminInfo, setAdminInfo] = useState(null);

  // Get admin info from localStorage on component mount
  useEffect(() => {
    const storedAdminInfo = localStorage.getItem('adminInfo');
    if (storedAdminInfo) {
      setAdminInfo(JSON.parse(storedAdminInfo));
    }
  }, []);

  // Main menu items (excluding logout)
  const mainMenuItems = [
  
    {
      key: '/students',
      icon: <TeamOutlined />,
      label: 'Duyệt học viên',
    },
    {
      key: '/instructors',
      icon: <UserOutlined />,
      label: 'Duyệt giảng viên',
    },
    {
      key: '/profile',
      icon: <ProfileOutlined />,
      label: 'Thông tin cá nhân',
    },
  ];

  // Logout menu item
  const logoutMenuItem = [
    {
      key: '/logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  const handleMenuClick = (item) => {
    navigate(item.key);
  };

  const handleLogoutClick = async (item) => {
    if (item.key === '/logout') {
      try {
        
        // Clear admin data from localStorage
        localStorage.removeItem('adminInfo');

        window.location.href = 'http://localhost:3000';
      } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
        
        // Still clear localStorage and redirect even if there's an error
        localStorage.removeItem('adminInfo');
        window.location.href = 'http://localhost:3000';
      }
    }
  };

  // Get first letter of admin name for avatar
  const getAvatarLetter = () => {
    if (!adminInfo || !adminInfo.name) return 'A';
    return adminInfo.name.charAt(0).toUpperCase();
  };

  return (
    <Sider
      width={280}
      className="sidebar"
      breakpoint="lg"
      collapsedWidth="0"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <div className="logo">
        <div className="logo-content">
          <div className="logo-icon">
            <GraduationCap size={32} />
          </div>
          <h1>EduSmart</h1>
        </div>
      </div>
      
      <div className="menu-container">
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={mainMenuItems}
          onClick={handleMenuClick}
        />
      </div>

      {/* Bottom section with logout and user profile - fixed at bottom */}
      <div className="sidebar-bottom">
        <div className="logout-menu">
          <Menu
            theme="light"
            mode="inline"
            items={logoutMenuItem}
            onClick={handleLogoutClick}
            selectedKeys={[]} // No selection for logout
          />
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            {getAvatarLetter()}
          </div>
          <div className="user-info">
            <h3>{adminInfo?.name || 'Quản trị viên'}</h3>
            <p>{adminInfo?.role || 'ADMIN'}</p>
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;