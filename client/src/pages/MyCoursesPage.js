import React from 'react';
import Navbar from '../components/landing page/navbar/Navbar';
import MyCourses from '../components/course/MyCourses';
import Footer from '../components/landing page/footer/Footer';
import ChatbotBubble from '../components/chatbot/ChatbotBubble';
const MyCoursesPage = () => {
  return (
    <div>
      <Navbar />
      <MyCourses />
      <Footer />
      <ChatbotBubble />
    </div>
  );
};

export default MyCoursesPage; 