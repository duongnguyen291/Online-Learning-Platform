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
        <Sidebar />
        <Layout>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
            <Routes>
              <Route path="/courses" element={<CourseManagement />} />
              {/* Add other routes here */}
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App; 