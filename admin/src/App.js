import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/sidebar/Sidebar';
import StudentList from './components/users/StudentList';
import InstructorList from './components/users/InstructorList';
import AdminProfile from './components/profile/AdminProfile';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout style={{ marginLeft: 150 }}>
          <Content style={{ padding: '24px', minHeight: 280 }}>
            <Routes>
              <Route path="/students" element={<StudentList />} />
              <Route path="/instructors" element={<InstructorList />} />
              <Route path="/profile" element={<AdminProfile />} />
              <Route path="/" element={<StudentList />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;