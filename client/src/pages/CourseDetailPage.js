import React from 'react';
import Navbar from '../components/landing page/navbar/Navbar';
import Footer from '../components/landing page/footer/Footer';
import CourseDetail from '../components/course/CourseDetail';
import ChatbotBubble from '../components/chatbot/ChatbotBubble';

function CourseDetailPage() {
  return (
    <>
      <Navbar />
      <CourseDetail/>
      <Footer />
      <ChatbotBubble />
    </>
  );
}

export default CourseDetailPage;