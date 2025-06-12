import React from 'react';
import Navbar from '../components/landing page/navbar/Navbar';
import Chatbot from '../components/chatbot/Chatbot';
import ChatbotBubble from '../components/chatbot/ChatbotBubble';

function ChatBotPage() {
  return (
    <>
      <Navbar />
      <Chatbot />
      <ChatbotBubble />
    </>
  );
}

export default ChatBotPage;