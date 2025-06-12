import React from 'react';
import Navbar from '../components/landing page/navbar/Navbar';
import Footer from '../components/landing page/footer/Footer';
import ProfessionalDegreePage from '../components/course/Course';
import ChatbotBubble from '../components/chatbot/ChatbotBubble';
function CoursePage() {
  return (
    <>
      <Navbar />
      <ProfessionalDegreePage/>
      <Footer />
      <ChatbotBubble />
    </>
  );
}

export default CoursePage;