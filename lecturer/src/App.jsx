import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/sidebar/Sidebar';
import MyCourses from './components/courses/MyCourses';
import CreateCoursePage from './pages/CreateCoursePage';
import EditCoursePage from './pages/EditCoursePage';
import EnrolledStudents from './components/courses/EnrolledStudents';
import ProtectedRoute from './components/auth/ProtectedRoute';

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/courses" replace />} />
        
        {/* Protected routes with sidebar */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout>
                  <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                    <Routes>
                      <Route path="/courses" element={<MyCourses />} />
                      <Route path="/courses/new" element={<CreateCoursePage />} />
                      <Route path="/courses/edit/:courseId" element={<EditCoursePage />} />
                      <Route path="/courses/:courseId/students" element={<EnrolledStudents />} />
                      {/* Add other routes here */}
                    </Routes>
                  </Content>
                </Layout>
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App; 