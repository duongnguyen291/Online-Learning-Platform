import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursePage from './pages/CoursePage';
import CourseDetailPage from './pages/CourseDetailPage';
import VideoCoursePage from './pages/VideoCourse';
import ChatBotPage from './pages/ChatBotPage';
import InnerCoursePage from './pages/InnerCoursePage';
import MyCoursesPage from './pages/MyCoursesPage';
import StudentProfilePage from './pages/StudentProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path='/course/:courseCode' element={
          <ProtectedRoute allowedRoles={['student']}>
            <CourseDetailPage />
          </ProtectedRoute>
        } />
        <Route path='/courseInner' element={
          <ProtectedRoute allowedRoles={['student']}>
            <InnerCoursePage />
          </ProtectedRoute>
        } />
        <Route path='/course-content/:courseCode/:progressCode' element={
          <ProtectedRoute allowedRoles={['student']}>
            <VideoCoursePage />
          </ProtectedRoute>
        } />
        <Route path='/chatbot' element={
          <ProtectedRoute allowedRoles={['student', 'lecturer']}>
            <ChatBotPage />
          </ProtectedRoute>
        } />
        <Route path='/my-courses' element={
          <ProtectedRoute allowedRoles={['student']}>
            <MyCoursesPage />
          </ProtectedRoute>
        } />
        <Route path='/profile' element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
   
    </>
  );
}

export default App;