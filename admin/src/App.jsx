import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/sidebar/Sidebar';
import CourseManagement from './components/courses/CourseManagement';

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Routes>          
          {/* Protected routes with sidebar */}
          <Route path="/*" element={
              <>
        <Sidebar />
        <Layout>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
            <Routes>
              <Route path="/courses" element={<CourseManagement />} />
                      <Route path="/" element={<div>Admin Dashboard</div>} />
              {/* Add other routes here */}
            </Routes>
          </Content>
        </Layout>
              </>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App; 