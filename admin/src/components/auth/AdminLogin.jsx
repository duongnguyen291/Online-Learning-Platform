import React, { useEffect } from 'react';
import { Button, Card, Typography, Space } from 'antd';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const redirectToClientLogin = () => {
    window.location.href = 'http://localhost:3000/login';
  };

  useEffect(() => {
    // Check if admin is already logged in
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      try {
        const parsedInfo = JSON.parse(adminInfo);
        if (parsedInfo.isLoggedIn) {
          // Admin is already logged in, redirect to dashboard
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error parsing admin info:', error);
        // Clear invalid data
        localStorage.removeItem('adminInfo');
      }
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, textAlign: 'center', padding: '20px' }}>
        <Space direction="vertical" size="large">
          <Title level={2}>Admin Login</Title>
          <Text>
            Please log in through the main site to access the admin dashboard.
          </Text>
          <Button type="primary" size="large" onClick={redirectToClientLogin}>
            Go to Login Page
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default AdminLogin; 