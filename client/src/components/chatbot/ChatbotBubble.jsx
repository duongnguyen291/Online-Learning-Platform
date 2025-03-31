import React, { useState, useEffect, useRef } from 'react';
import './chatbotBubble.css';

const ChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nunc justo.', 
      sender: 'bot',
      time: '7:20'
    },
    {
      id: 2,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nunc justo, vehicula vel sollicitudin non, tincidunt et odio',
      sender: 'user',
      time: '7:20'
    },
    {
      id: 3,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nunc justo',
      sender: 'bot',
      time: '7:20'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // Thêm ref cho hộp chứa tin nhắn
  const messagesEndRef = useRef(null);

  // Auto-scroll xuống cuối mỗi khi messages thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const currentTime = new Date();
    const options = { timeZone: 'Asia/Ho_Chi_Minh', hour12: false, hour: '2-digit', minute: '2-digit' };
    const timeString = currentTime.toLocaleTimeString('en-GB', options);

    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      time: timeString
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Giả lập phản hồi từ bot sau 1 giây
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        sender: 'bot',
        time: timeString
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="chatbot-avatar">
                <div className="bot-icon"></div>
              </div>
              <div className="title-text">
                <h2>Chatbot</h2>
                <span className="status-indicator">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button className="close-button" onClick={toggleChat}>
              <span>−</span>
            </button>
          </div>
          
          {/* Gán ref vào hộp chứa tin nhắn */}
          <div className="chatbot-messages" ref={messagesEndRef}>
            {messages.map((message) => (
              <div key={message.id} className={`message-container ${message.sender}`}>
                {message.sender === 'bot' && (
                  <div className="bot-avatar">
                    <div className="bot-icon"></div>
                  </div>
                )}
                {message.sender === 'user' && (
                  <div className="user-avatar">
                    <img src="..\..\assets\images\avatar.jpg" alt="User" />
                  </div>
                )}
                <div className="message-content">
                  <div className={`message ${message.sender}`}>
                    {message.text}
                  </div>
                  <div className="message-time">
                    {message.time} {message.sender === 'bot' ? '✓' : '✓✓'}
                  </div>
                </div>
              </div>  
            ))}
          </div>
          
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Type your message here..." 
              value={newMessage}
              onChange={handleInputChange}
            />
            <button type="submit" className="send-button">
              <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <button className="chatbot-bubble-button" onClick={toggleChat}>
          <div className="bubble-icon">
            <div className="bot-icon"></div>
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatbotBubble;
