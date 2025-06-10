import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { useNavigate } from 'react-router-dom';

// API functions
const API_BASE_URL = 'http://localhost:8000/api/rag';

const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upload document');
  }
  
  return response.json();
};

const queryRAG = async (message, context = null) => {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      context,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get answer');
  }
  
  return response.json();
};

const getContext = async (query) => {
  const response = await fetch(`${API_BASE_URL}/context`, {
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

const suggestLearningPath = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/suggest-learning-path/${userId}`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get learning path suggestion');
  }
  
  return response.json();
};

const Chatbot = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [conversations, setConversations] = useState([
    { id: 'default', name: 'New conversation', messages: [] }
  ]);
  const [activeConversation, setActiveConversation] = useState('default');
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

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

  const handleCameraCapture = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        // Upload the file
        const result = await uploadDocument(file);
        
        if (result.status === 'success') {
          // Show preview
          const reader = new FileReader();
          reader.onload = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
          
          // Add system message about successful upload
          const systemMessage = {
            id: Date.now().toString(),
            content: `Successfully uploaded document: ${file.name}. You can now ask questions about it.`,
            sender: 'ai',
            timestamp: new Date()
          };
          
          const updatedMessages = [...messages, systemMessage];
          setMessages(updatedMessages);
          
          // Update conversation
          const updatedConversations = conversations.map(conv => {
            if (conv.id === activeConversation) {
              return {
                ...conv,
                messages: updatedMessages
              };
            }
            return conv;
          });
          
          setConversations(updatedConversations);
        } else {
          // Handle error
          const errorMessage = {
            id: Date.now().toString(),
            content: `Failed to upload document: ${result.message}`,
            sender: 'ai',
            timestamp: new Date()
          };
          
          const updatedMessages = [...messages, errorMessage];
          setMessages(updatedMessages);
          
          // Update conversation
          const updatedConversations = conversations.map(conv => {
            if (conv.id === activeConversation) {
              return {
                ...conv,
                messages: updatedMessages
              };
            }
            return conv;
          });
          
          setConversations(updatedConversations);
        }
      } catch (error) {
        // Handle API error
        const errorMessage = {
          id: Date.now().toString(),
          content: `Error uploading document: ${error.message}`,
          sender: 'ai',
          timestamp: new Date()
        };
        
        const updatedMessages = [...messages, errorMessage];
        setMessages(updatedMessages);
        
        // Update conversation
        const updatedConversations = conversations.map(conv => {
          if (conv.id === activeConversation) {
            return {
              ...conv,
              messages: updatedMessages
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        // Upload the file
        const result = await uploadDocument(file);
        
        if (result.status === 'success') {
          // Show preview
          const reader = new FileReader();
          reader.onload = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
          
          // Add system message about successful upload
          const systemMessage = {
            id: Date.now().toString(),
            content: `Successfully uploaded document: ${file.name}. You can now ask questions about it.`,
            sender: 'ai',
            timestamp: new Date()
          };
          
          const updatedMessages = [...messages, systemMessage];
          setMessages(updatedMessages);
          
          // Update conversation
          const updatedConversations = conversations.map(conv => {
            if (conv.id === activeConversation) {
              return {
                ...conv,
                messages: updatedMessages
              };
            }
            return conv;
          });
          
          setConversations(updatedConversations);
        } else {
          // Handle error
          const errorMessage = {
            id: Date.now().toString(),
            content: `Failed to upload document: ${result.message}`,
            sender: 'ai',
            timestamp: new Date()
          };
          
          const updatedMessages = [...messages, errorMessage];
          setMessages(updatedMessages);
          
          // Update conversation
          const updatedConversations = conversations.map(conv => {
            if (conv.id === activeConversation) {
              return {
                ...conv,
                messages: updatedMessages
              };
            }
            return conv;
          });
          
          setConversations(updatedConversations);
        }
      } catch (error) {
        // Handle API error
        const errorMessage = {
          id: Date.now().toString(),
          content: `Error uploading document: ${error.message}`,
          sender: 'ai',
          timestamp: new Date()
        };
        
        const updatedMessages = [...messages, errorMessage];
        setMessages(updatedMessages);
        
        // Update conversation
        const updatedConversations = conversations.map(conv => {
          if (conv.id === activeConversation) {
            return {
              ...conv,
              messages: updatedMessages
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
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
    
    try {
      // Get answer from RAG
      const result = await queryRAG(input);
      
      if (result.status === 'success') {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: result.answer,
          sender: 'ai',
          timestamp: new Date(),
          sources: result.sources
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
      } else {
        // Handle error
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error while processing your request. Please try again.',
          sender: 'ai',
          timestamp: new Date()
        };
        
        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);
        
        // Update conversation with error message
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
      }
    } catch (error) {
      // Handle API error
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error.message}`,
        sender: 'ai',
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      
      // Update conversation with error message
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
    } finally {
      setIsLoading(false);
    }
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
  
  const handleLearningPathSuggestion = async () => {
    try {
      setIsLoading(true);
      
      // Add a user message to show the request
      const userMessage = {
        id: Date.now().toString(),
        content: "Vui lòng gợi ý lộ trình học phù hợp cho tôi.",
        sender: 'user',
        timestamp: new Date()
      };
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Get learning path suggestion
      const result = await suggestLearningPath(userId);
      
      if (result.status === 'success') {
        // Format the recommendation for better display
        const formattedRecommendation = `🎯 Gợi ý lộ trình học của bạn:

${result.recommendation}

${result.courses ? `
📚 Các khóa học được đề xuất:
${result.courses.map((course, index) => `
${index + 1}. ${course.name}
   - Độ khó: ${course.difficulty}
   - Thời lượng: ${course.estimatedHours} giờ
   - Chủ đề: ${course.topics.join(', ')}
`).join('')}` : ''}

${result.nextSteps ? `
⭐ Các bước tiếp theo:
${result.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}` : ''}

Bạn có thể nhấn "Xem chi tiết" để xem thông tin chi tiết hơn về lộ trình học này.`;

        const aiMessage = {
          id: Date.now().toString(),
          content: formattedRecommendation,
          sender: 'ai',
          timestamp: new Date(),
          sources: result.sources,
          type: 'learning_path'
        };
        
        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        
        // Update conversation
        const updatedConversations = conversations.map(conv => {
          if (conv.id === activeConversation) {
            return {
              ...conv,
              messages: finalMessages,
              name: 'Gợi ý lộ trình học'
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now().toString(),
        content: `❌ Không thể lấy gợi ý lộ trình học: ${error.message}. Vui lòng thử lại sau.`,
        sender: 'ai',
        timestamp: new Date()
      };
      
      const updatedMessages = [...messages, errorMessage];
      setMessages(updatedMessages);
      
      // Update conversation
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: updatedMessages
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      {/* Left Sidebar */}
      <div className={`ai-chat-sidebar`}>
        <div className="sidebar-header">
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

          {userId && (
            <button
              className="suggest-path-button"
              onClick={handleLearningPathSuggestion}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Gợi ý lộ trình</span>
            </button>
          )}
        </div>
        
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
              {userId && (
                <button
                  className="suggest-path-button"
                  onClick={handleLearningPathSuggestion}
                  disabled={isLoading}
                >
                  Gợi ý lộ trình học
                </button>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">
                      {message.sender === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    {message.type === 'learning_path' && (
                      <button
                        className="view-details-button"
                        onClick={() => navigate('/learning-path')}
                      >
                        Xem chi tiết
                      </button>
                    )}
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
                    {message.sources && message.sources.length > 0 && (
                      <div className="message-sources">
                        <h4>Sources:</h4>
                        {message.sources.map((source, index) => (
                          <div key={index} className="source-item">
                            <p>{source.content}</p>
                            {source.metadata && (
                              <small>
                                {source.metadata.source && `Source: ${source.metadata.source}`}
                                {source.metadata.page && `, Page: ${source.metadata.page}`}
                              </small>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {(isLoading || isUploading) && (
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
                accept=".txt,.pdf,.doc,.docx"
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
              disabled={isLoading || isUploading || (!input.trim() && !imagePreview)}
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