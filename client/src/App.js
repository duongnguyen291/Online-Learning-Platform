import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursePage from './pages/CoursePage';
import CourseDetailPage from './pages/CourseDetailPage';
import VideoCoursePage from './pages/VideoCourse';
import ChatbotBubble from './components/chatbot/ChatbotBubble';
import ChatBotPage from './pages/ChatBotPage';
import ProfileStudent from './pages/ProfileStudent';
import InnerCoursePage from './pages/InnerCoursePage';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path='/course/:id' element={<CourseDetailPage />} />
        <Route path='/coursecourse' element={<InnerCoursePage />} />
        <Route path='/courseDetails' element={<VideoCoursePage />} />
        <Route path='/chatbot' element={<ChatBotPage />}/>
        <Route path='/profile' element={<ProfileStudent />}/>
      </Routes>
    </Router>
    <ChatbotBubble />
    </>
  );
}

export default App;