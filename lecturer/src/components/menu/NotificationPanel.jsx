import React from 'react';
import { X, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import './NotificationPanel.css';

const NotificationPanel = ({ 
  notifications, 
  isOpen, 
  onClose, 
  onMarkAsRead, 
  onMarkAllAsRead 
}) => {
  if (!isOpen) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="icon-success" />;
      case 'warning':
        return <AlertCircle size={20} className="icon-warning" />;
      case 'error':
        return <AlertCircle size={20} className="icon-error" />;
      default:
        return <Info size={20} className="icon-info" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now - notificationTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  return (
    <>
      <div className="notification-overlay" onClick={onClose}></div>
      <div className="notification-panel">
        <div className="notification-header">
          <div className="header-left">
            <h3>Thông báo</h3>
            <span className="notification-count">
              {notifications.filter(n => !n.read).length} chưa đọc
            </span>
          </div>
          <div className="header-actions">
            <button 
              className="btn-text"
              onClick={onMarkAllAsRead}
              disabled={notifications.filter(n => !n.read).length === 0}
            >
              Đánh dấu tất cả đã đọc
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <Info size={48} />
              <p>Không có thông báo nào</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  <div className="notification-time">
                    <Clock size={14} />
                    {formatTime(notification.timestamp)}
                  </div>
                </div>
                {!notification.read && (
                  <div className="unread-dot"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;