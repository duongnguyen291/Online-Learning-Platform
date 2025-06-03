import React from 'react';
import { 
  BookOpen, 
  User, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeMenu, onMenuClick }) => {
  const menuItems = [
    {
      id: 'courses',
      label: 'Khóa học của tôi',
      icon: BookOpen
    },
    {
      id: 'profile',
      label: 'Thông tin của tôi',
      icon: User
    },
    {
      id: 'logout',
      label: 'Đăng xuất',
      icon: LogOut,
      isAction: true
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <GraduationCap size={32} />
          <h2>EduSmart</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="nav-item-group">
              <button
                className={`sidebar-item ${activeMenu === item.id ? 'active' : ''} ${item.isAction ? 'action-item' : ''}`}
                onClick={() => onMenuClick(item.id)}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="teacher-info">
          <div className="teacher-avatar">
            <User size={16} />
          </div>
          <div className="teacher-details">
            <p className="teacher-name">Giảng viên</p>
            <p className="teacher-role">Educator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;