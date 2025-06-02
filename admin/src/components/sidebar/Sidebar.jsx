import React from 'react';
import { Layout, Menu } from 'antd';
import { GraduationCap } from 'lucide-react';

import { UserOutlined, TeamOutlined, ProfileOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    if (item.key === '/logout') {
      // Handle logout logic here
      console.log('Logging out...');
      // You can add your logout logic here, such as:
      // - Clear user session/tokens
      // - Redirect to login page
      // - Call logout API
      return;
    }
    navigate(item.key);
  };

  const handleLogoutClick = (item) => {
    if (item.key === '/logout') {
      // Handle logout logic here
      console.log('Logging out...');
      // Add your logout logic here
      return;
    }
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
            G
          </div>
          <div className="user-info">
            <h3>Quản trị viên</h3>
            <p>ADMIN</p>
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;