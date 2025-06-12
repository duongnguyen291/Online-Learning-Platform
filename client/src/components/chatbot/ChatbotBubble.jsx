import React, { useState, useEffect, useRef } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { TypeAnimation } from 'react-type-animation';
import 'katex/dist/katex.min.css';
import './chatbotBubble.css';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const uploadDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/rag/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload document');
    }
    
    const result = await response.json();
    return {
      status: 'success',
      message: `Tài liệu "${file.name}" đã được tải lên thành công. Bạn có thể hỏi các câu hỏi về nội dung tài liệu.`,
      ...result
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    return {
      status: 'error',
      message: `Lỗi khi tải lên tài liệu: ${error.message}`
    };
  }
};

const queryRAG = async (message, context = null) => {
  try {
    const endpoint = `${API_BASE_URL}/api/rag/query`;
    console.log('Sending RAG query to:', endpoint);
    
    const payload = {
      message,
      context: context || {}
    };
    console.log('Request payload:', payload);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || 'Unknown error occurred';
      } catch (e) {
        errorMessage = await response.text() || response.statusText;
      }
      throw new Error(`RAG query failed: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Error in queryRAG:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối và thử lại.');
    }
    throw error;
  }
};

const getContext = async (query) => {
  const response = await fetch(`${API_BASE_URL}/api/rag/context`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get context');
  }
  
  return response.json();
};

// Helper function to detect and parse math formulas
const parseMathFormulas = (text) => {
  if (!text) return [];
  
  // Regular expressions for detecting inline and block math formulas
  const inlineRegex = /\$(.*?)\$/g;
  const blockRegex = /\$\$(.*?)\$\$/g;
  
  let parts = [];
  let lastIndex = 0;
  
  // Find all block math formulas
  text.replace(blockRegex, (match, formula, index) => {
    if (index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, index) });
    }
    parts.push({ type: 'block-math', content: formula });
    lastIndex = index + match.length;
    return match;
  });
  
  // Process remaining text for inline math formulas
  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    let inlineLastIndex = 0;
    remainingText.replace(inlineRegex, (match, formula, index) => {
      if (index > inlineLastIndex) {
        parts.push({ type: 'text', content: remainingText.slice(inlineLastIndex, index) });
      }
      parts.push({ type: 'inline-math', content: formula });
      inlineLastIndex = index + match.length;
      return match;
    });
    
    if (inlineLastIndex < remainingText.length) {
      parts.push({ type: 'text', content: remainingText.slice(inlineLastIndex) });
    }
  }
  
  return parts;
};

// Component to render message content with math formulas
const MessageContent = ({ content, isTyping }) => {
  const parts = parseMathFormulas(content);
  
  if (isTyping) {
    return (
      <TypeAnimation
        sequence={[content]}
        wrapper="div"
        cursor={true}
        repeat={0}
        speed={50}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    );
  }
  
  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      {parts.map((part, index) => {
        switch (part.type) {
          case 'inline-math':
            return <InlineMath key={index} math={part.content} />;
          case 'block-math':
            return <BlockMath key={index} math={part.content} />;
          default:
            return <span key={index}>{part.content}</span>;
        }
      })}
    </div>
  );
};

const ChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const result = await uploadDocument(file);
        
        const systemMessage = {
          id: Date.now(),
          text: result.message,
          sender: 'bot',
          time: new Date().toLocaleTimeString('en-GB', { 
            timeZone: 'Asia/Ho_Chi_Minh', 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        
        setMessages(prev => [...prev, systemMessage]);
        setSelectedFile(file);
      } catch (error) {
        console.error('Error uploading file:', error);
        const errorMessage = {
          id: Date.now(),
          text: `Lỗi khi tải lên tập tin: ${error.message}`,
          sender: 'bot',
          time: new Date().toLocaleTimeString('en-GB', { 
            timeZone: 'Asia/Ho_Chi_Minh', 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
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

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      try {
        setIsLoading(true);
        const result = await uploadDocument(files[0]);
        
        const systemMessage = {
          id: Date.now(),
          text: result.message,
          sender: 'bot',
          time: new Date().toLocaleTimeString('en-GB', { 
            timeZone: 'Asia/Ho_Chi_Minh', 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        
        setMessages(prev => [...prev, systemMessage]);
        setSelectedFile(files[0]);
      } catch (error) {
        console.error('Error uploading file:', error);
        const errorMessage = {
          id: Date.now(),
          text: `Lỗi khi tải lên tập tin: ${error.message}`,
          sender: 'bot',
          time: new Date().toLocaleTimeString('en-GB', { 
            timeZone: 'Asia/Ho_Chi_Minh', 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !selectedFile) return;

    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString('en-GB', { 
      timeZone: 'Asia/Ho_Chi_Minh', 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Add user message
    if (newMessage.trim() !== '') {
      const userMessage = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        time: timeString
      };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      try {
        setIsLoading(true);
        
        // Get RAG response
        const ragResponse = await queryRAG(newMessage, {
          chat_history: messages
            .filter(msg => msg.text && msg.text.trim() !== '')
            .map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            }))
        });
        
        if (ragResponse.status === 'success') {
          const botMessage = {
            id: Date.now(),
            text: ragResponse.answer,
            sender: 'bot',
            time: timeString,
            sources: ragResponse.sources || [],
            isTyping: true
          };
          setMessages(prev => [...prev, botMessage]);
          
          // Remove typing effect after animation completes
          setTimeout(() => {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === botMessage.id 
                  ? { ...msg, isTyping: false }
                  : msg
              )
            );
          }, botMessage.text.length * 50 + 1000); // Adjust timing based on text length
        } else {
          throw new Error(ragResponse.message || 'Failed to get response');
        }
      } catch (error) {
        console.error('Error getting response:', error);
        const errorMessage = {
          id: Date.now(),
          text: 'Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
          sender: 'bot',
          time: timeString,
          isTyping: true
        };
        setMessages(prev => [...prev, errorMessage]);
        
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === errorMessage.id 
                ? { ...msg, isTyping: false }
                : msg
            )
          );
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    }
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
    
    if (message.sources && message.sources.length > 0) {
      return (
        <>
          <div className="chatbot-bubble__message-text">
            <MessageContent 
              content={message.text} 
              isTyping={message.sender === 'bot' && message.isTyping} 
            />
          </div>
          <div className="chatbot-bubble__sources">
            <button 
              className="chatbot-bubble__sources-toggle"
              onClick={() => {
                const messageElement = document.getElementById(`message-${message.id}`);
                if (messageElement) {
                  const sourcesElement = messageElement.querySelector('.chatbot-bubble__sources-content');
                  if (sourcesElement) {
                    sourcesElement.style.display = sourcesElement.style.display === 'none' ? 'block' : 'none';
                  }
                }
              }}
            >
              Xem nguồn tài liệu
            </button>
            <div className="chatbot-bubble__sources-content" style={{ display: 'none' }}>
              {message.sources.map((source, index) => (
                <div key={index} className="chatbot-bubble__source">
                  <h4>Trích dẫn {index + 1}:</h4>
                  <p>{source.content}</p>
                  {source.metadata && source.metadata.source && (
                    <p className="chatbot-bubble__source-metadata">
                      Nguồn: {source.metadata.source}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }
    
    return (
      <MessageContent 
        content={message.text} 
        isTyping={message.sender === 'bot' && message.isTyping} 
      />
    );
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
                <h2 className="chatbot-bubble__title">EduSmart Assistant</h2>
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
            {messages.length === 0 ? (
              <div className="chatbot-bubble__welcome">
                <h3>Xin chào! Tôi là trợ lý AI của EduSmart</h3>
                <p>Tôi có thể giúp bạn:</p>
                <ul>
                  <li>Trả lời câu hỏi về nội dung học tập</li>
                  <li>Tư vấn và gợi ý khóa học phù hợp</li>
                  <li>Giải đáp thắc mắc về hệ thống</li>
                  <li>Phân tích tài liệu học tập</li>
                </ul>
                <p>Hãy đặt câu hỏi hoặc tải lên tài liệu để bắt đầu!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  id={`message-${message.id}`}
                  className={`chatbot-bubble__message ${message.sender === 'user' ? 'chatbot-bubble__message--user' : 'chatbot-bubble__message--bot'}`}
                >
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
              ))
            )}
            {isLoading && (
              <div className="chatbot-bubble__message chatbot-bubble__message--bot">
                <div className="chatbot-bubble__avatar chatbot-bubble__avatar--bot">
                  <div className="chatbot-bubble__avatar-face">
                    <div className="chatbot-bubble__avatar-eye chatbot-bubble__avatar-eye--small-left"></div>
                    <div className="chatbot-bubble__avatar-eye chatbot-bubble__avatar-eye--small-right"></div>
                  </div>
                </div>
                <div className="chatbot-bubble__message-content">
                  <div className="chatbot-bubble__message-bubble chatbot-bubble__message-bubble--bot">
                    <div className="chatbot-bubble__typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              accept=".txt,.pdf,.doc,.docx"
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
              disabled={isLoading || (!newMessage.trim() && !selectedFile)}
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