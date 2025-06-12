import React from 'react';
import Navbar from '../components/landing page/navbar/Navbar';
import StudentProfile from '../components/profile/studentProfile';
import Footer from '../components/landing page/footer/Footer';
import ChatbotBubble from '../components/chatbot/ChatbotBubble';
const StudentProfilePage = () => {
  return (
    <div>
      <Navbar />
      <StudentProfile />
      <Footer />
      <ChatbotBubble />
    </div>
  );
};

export default StudentProfilePage; 