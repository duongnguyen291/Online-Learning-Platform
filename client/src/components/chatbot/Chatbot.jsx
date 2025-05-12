import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [conversations, setConversations] = useState([
    { id: 'default', name: 'New conversation', messages: [] }
  ]);
  const [activeConversation, setActiveConversation] = useState('default');
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Load active conversation messages
  useEffect(() => {
    const currentConversation = conversations.find(conv => conv.id === activeConversation);
    if (currentConversation) {
      setMessages(currentConversation.messages);
    }
  }, [activeConversation, conversations]);

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!input.trim() && !imagePreview) return;
    
    // Add user message with image
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      image: imagePreview || undefined
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Update conversation in the list
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: updatedMessages,
          name: input.trim() ? input.trim().substring(0, 20) + '...' : conv.name
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setInput('');
    setImagePreview(null);
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated response to: "${input}"${imagePreview ? ' (with an image)' : ''}`,
        sender: 'ai',
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      // Update conversation again with AI response
      const finalConversations = updatedConversations.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: finalMessages
          };
        }
        return conv;
      });
      
      setConversations(finalConversations);
      setIsLoading(false);
    }, 1000);
  };

  const handleNewChat = () => {
    const newConversationId = Date.now().toString();
    const newConversation = {
      id: newConversationId,
      name: 'New conversation',
      messages: []
    };
    
    setConversations([...conversations, newConversation]);
    setActiveConversation(newConversationId);
    setMessages([]);
    setInput('');
    setImagePreview(null);
    setIsLoading(false);
  };
  
  const handleDeleteConversation = (id) => {
  // Don't delete if it's the only conversation
  if (conversations.length <= 1) {
    // You could add a notification here that at least one conversation is required
    return;
  }
  
  // Filter out the deleted conversation
  const updatedConversations = conversations.filter(conv => conv.id !== id);
  setConversations(updatedConversations);
  
  // If the active conversation was deleted, switch to another one
  if (id === activeConversation) {
    setActiveConversation(updatedConversations[0].id);
  }
};

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
    if (textareaRef.current) {
      textareaRef.current.classList.add('dragging');
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (textareaRef.current) {
      textareaRef.current.classList.remove('dragging');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (textareaRef.current) {
      textareaRef.current.classList.remove('dragging');
    }
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  
  const selectConversation = (id) => {
    setActiveConversation(id);
  };
  

  return (
    <div className="ai-chat-container">
      {/* Left Sidebar */}
      <div className={`ai-chat-sidebar`}>
        
        <button 
        className="new-chat-button"
        onClick={handleNewChat}
        aria-label="Start New Chat"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
        </svg>
        <span>New chat</span>
        </button>
        
        <div className="conversation-list">
          {conversations.map((conversation) => (
            <div 
            key={conversation.id} 
            className={`conversation-item ${activeConversation === conversation.id ? 'active' : ''}`}
            onClick={() => selectConversation(conversation.id)}
            >
            <div className="conversation-info">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="conversation-name">{conversation.name}</span>
            </div>
            
            <button 
                className="delete-conversation-button" 
                onClick={(e) => {
                e.stopPropagation();
                handleDeleteConversation(conversation.id);
                }}
                aria-label="Delete conversation"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className={`ai-chat-main`}>
        <div className="ai-chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h3>Xin chào, tôi có thể giúp gì cho bạn?</h3>
              <p>Hãy hỏi tôi bất cứ điều gì và tôi sẽ cố gắng hết sức để giúp bạn!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">{message.sender === 'user' ? 'You' : 'AI Assistant'}</span>
                  </div>
                  <div className="message-text">
                    {message.content}
                    {message.image && (
                      <div className="message-image-container">
                        <img 
                          src={message.image} 
                          alt="Uploaded" 
                          className="message-image" 
                          onClick={() => window.open(message.image, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message ai-message">
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">AI Assistant</span>
                </div>
                <div className="message-text typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="ai-chat-input" onSubmit={handleSubmit}>
          <div className="input-container">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              placeholder="Hãy nhập câu hỏi của bạn..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
            {isDragging && (
              <div className="drag-indicator">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
            )}
              
            {/* Camera button */}
            <label className="camera-button">
              <input 
                type="file" 
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture} 
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </label>
              
            {/* File upload button */}
            <label className="file-upload-button">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileUpload} 
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </label>
              
            <button 
              type="submit" 
              className="send-button"
              disabled={isLoading || (!input.trim() && !imagePreview)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          
          {/* Image preview */}
          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button 
                className="remove-image-button"
                onClick={() => setImagePreview(null)}
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chatbot;