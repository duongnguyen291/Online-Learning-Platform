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
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !selectedFile) return;

    const currentTime = new Date();
    const options = { timeZone: 'Asia/Ho_Chi_Minh', hour12: false, hour: '2-digit', minute: '2-digit' };
    const timeString = currentTime.toLocaleTimeString('en-GB', options);

    if (selectedFile) {
      const fileMessage = {
        id: messages.length + 1,
        type: 'file',
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
        sender: 'user',
        time: timeString
      };
      setMessages([...messages, fileMessage]);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    if (newMessage.trim() !== '') {
      const textMessage = {
        id: messages.length + (selectedFile ? 2 : 1),
        text: newMessage,
        sender: 'user',
        time: timeString
      };
      setMessages(prev => [...prev, textMessage]);
    }

    setNewMessage('');

    // Giả lập phản hồi từ bot sau 1 giây
    setTimeout(() => {
      const botResponse = {
        id: messages.length + (selectedFile && newMessage ? 3 : selectedFile || newMessage ? 2 : 1),
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        sender: 'bot',
        time: timeString
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  const renderMessage = (message) => {
    if (message.type === 'file') {
      return (
        <div className="chatbot-bubble__file-display">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="chatbot-bubble__file-icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <div className="chatbot-bubble__file-info">
            <span className="chatbot-bubble__file-name">{message.fileName}</span>
            <span className="chatbot-bubble__file-size">{message.fileSize}</span>
          </div>
        </div>
      );
    }
    return message.text;
  };

  return (
    <div className="chatbot-bubble__container">
      {isOpen ? (
        <div className="chatbot-bubble__window">
          <div className="chatbot-bubble__header">
            <div className="chatbot-bubble__header-info">
              <div className="chatbot-bubble__avatar-header">
                <div className="chatbot-bubble__avatar-face">
                  <div className="chatbot-bubble__avatar-eye chatbot-bubble__avatar-eye--left"></div>
                  <div className="chatbot-bubble__avatar-eye chatbot-bubble__avatar-eye--right"></div>
                </div>
              </div>
              <div className="chatbot-bubble__header-text">
                <h2 className="chatbot-bubble__title">Chatbot</h2>
                <span className="chatbot-bubble__status">
                  <span className="chatbot-bubble__status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button 
              className="chatbot-bubble__close-btn" 
              onClick={toggleChat}
            >
              <span>−</span>
            </button>
          </div>
          
          <div 
            className={`chatbot-bubble__messages ${isDragOver ? 'chatbot-bubble__messages--drag-over' : ''}`}
            ref={messagesEndRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragOver && (
              <div className="chatbot-bubble__drag-overlay">
                Drop file here to upload
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`chatbot-bubble__message ${message.sender === 'user' ? 'chatbot-bubble__message--user' : 'chatbot-bubble__message--bot'}`}>
                {message.sender === 'bot' && (
                  <div className="chatbot-bubble__avatar chatbot-bubble__avatar--bot">
                    <div className="chatbot-bubble__avatar-face">
                      <div className="chatbot-bubble__avatar-eye chatbot-bubble__avatar-eye--small-left"></div>
                      <div className="chatbot-bubble__avatar-eye chatbot-bubble__avatar-eye--small-right"></div>
                    </div>
                  </div>
                )}
                {message.sender === 'user' && (
                  <div className="chatbot-bubble__avatar chatbot-bubble__avatar--user">
                    U
                  </div>
                )}
                <div className="chatbot-bubble__message-content">
                  <div className={`chatbot-bubble__message-bubble ${message.sender === 'bot' 
                      ? 'chatbot-bubble__message-bubble--bot' 
                      : message.type === 'file'
                        ? 'chatbot-bubble__message-bubble--file'
                        : 'chatbot-bubble__message-bubble--user'
                  }`}>
                    {renderMessage(message)}
                  </div>
                  <div className={`chatbot-bubble__message-time ${message.sender === 'user' ? 'chatbot-bubble__message-time--user' : ''}`}>
                    {message.time} {message.sender === 'bot' ? '✓' : '✓✓'}
                  </div>
                </div>
              </div>  
            ))}
          </div>
          
          {selectedFile && (
            <div className="chatbot-bubble__file-preview">
              <div className="chatbot-bubble__file-preview-content">
                <div className="chatbot-bubble__file-preview-info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="chatbot-bubble__file-preview-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <div className="chatbot-bubble__file-preview-details">
                    <span className="chatbot-bubble__file-preview-name">{selectedFile.name}</span>
                    <span className="chatbot-bubble__file-preview-size">{formatFileSize(selectedFile.size)}</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="chatbot-bubble__file-remove-btn" 
                  onClick={removeSelectedFile}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="chatbot-bubble__close-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="chatbot-bubble__input-area">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="chatbot-bubble__file-input"
            />
            <button 
              type="button" 
              className="chatbot-bubble__attach-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="chatbot-bubble__attach-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input 
              type="text" 
              placeholder="Type your message here..." 
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
              className="chatbot-bubble__text-input"
            />
            <button 
              type="button" 
              className="chatbot-bubble__send-btn"
              onClick={handleSendMessage}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="chatbot-bubble__send-icon">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="chatbot-bubble__toggle-btn" 
          onClick={toggleChat}
        >
          <div className="chatbot-bubble__toggle-content">
            <div className="chatbot-bubble__toggle-avatar">
              <div className="chatbot-bubble__toggle-eye chatbot-bubble__toggle-eye--left"></div>
              <div className="chatbot-bubble__toggle-eye chatbot-bubble__toggle-eye--right"></div>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatbotBubble;