import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Chatbot.css';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const uploadDocument = async (file) => {
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
  
  return response.json();
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

const SUGGESTIONS = [
  {
    text: "Đưa ra lời khuyên",
    value: "Bạn có thể đưa ra lời khuyên cho tôi về cách học tập hiệu quả không?"
},
    {
        text: "Gợi ý khóa học phù hợp",
        value: "Bạn có thể gợi ý cho tôi những khóa học phù hợp với trình độ hiện tại của tôi không?"
    },
    {
        text: "Hỏi về khóa học",
        value: "Bạn có thể cho tôi biết thêm thông tin về các khóa học hiện có không?"
    },
    {
        text: "Tìm kiếm theo chủ đề",
        value: "Tôi muốn tìm các khóa học liên quan đến một chủ đề cụ thể"
    },
    {
        text: "Hỗ trợ học tập",
        value: "Bạn có thể giúp tôi với các câu hỏi về nội dung học tập không?"
    }
];

const formatCourseRecommendations = (courses) => {
  if (!courses || courses.length === 0) {
    return "Không tìm thấy khóa học phù hợp.";
  }

  let formattedText = "Dựa trên trình độ và sở thích học tập của bạn, đây là những khóa học được đề xuất:\n\n";
  
  courses.forEach((course, index) => {
    formattedText += `${index + 1}. ${course.Name}\n`;
    formattedText += `   - Cấp độ: ${course.level || 'Beginner'}\n`;
    formattedText += `   - Danh mục: ${course.category}\n`;
    if (course.Description) {
      formattedText += `   - Mô tả: ${course.Description.substring(0, 100)}...\n`;
    }
    formattedText += `   - Thời lượng: ${course.totalLength || '0h 0m'}\n`;
    formattedText += `   - Giá: $${course.discountedPrice} (Giảm từ $${course.originalPrice})\n`;
    if (course.rating) {
      formattedText += `   - Đánh giá: ${course.rating}/5 (${course.reviews || 0} lượt đánh giá)\n`;
    }
    formattedText += '\n';
  });

  formattedText += "Bạn có thể chọn một trong những khóa học trên để bắt đầu. Bạn cần tôi giải thích thêm về khóa học nào không?";
  
  return formattedText;
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [conversations, setConversations] = useState([
    { id: 'default', name: 'New conversation', messages: [] }
  ]);
  const [activeConversation, setActiveConversation] = useState('default');
  const [userCode, setUserCode] = useState(null);
  
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

  useEffect(() => {
    // Get user code from userInfo in localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo.userId) {
          console.log("Setting userCode:", parsedUserInfo.userId);
          setUserCode(parsedUserInfo.userId);
        } else {
          console.error("No userId found in userInfo:", parsedUserInfo);
          // Add initial message when user code is not found
          setMessages([{
            id: 'initial-message',
            text: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.',
            isUser: false,
            timestamp: new Date()
          }]);
          // Clear localStorage and redirect to login
          localStorage.clear();
          window.location.href = '/login';
        }
      } catch (error) {
        console.error("Error parsing userInfo:", error);
        localStorage.clear();
        window.location.href = '/login';
      }
    } else {
      console.log("No userInfo found in localStorage");
      // Add initial message when user is not logged in
      setMessages([{
        id: 'initial-message',
        text: 'Vui lòng đăng nhập để sử dụng đầy đủ các tính năng của chatbot.',
        isUser: false,
        timestamp: new Date()
      }]);
      // Redirect to login
      window.location.href = '/login';
    }
  }, []);

  const handleUserMessage = async (message) => {
    try {
      // Validate userCode before making request
      if (!userCode) {
        console.error("No userCode available");
        throw new Error('Vui lòng đăng nhập lại để tiếp tục.');
      }
      console.log("Using userCode for request:", userCode);

      // Create user message object
      const userMessageObj = {
        id: `user-${Date.now()}`,
        text: message,
        isUser: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessageObj]);
      setIsLoading(true);

      let response;
      // Check message type based on SUGGESTIONS
      const isAdviceRequest = message === SUGGESTIONS[0].value;
      const isCourseRecommendation = message === SUGGESTIONS[1].value;
      
      if (isAdviceRequest) {
        // Call learning path advice endpoint
        console.log("Making learning path advice request for userCode:", userCode);
        const apiResponse = await fetch(`${API_BASE_URL}/learning-path/advice/${userCode}`);
        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          throw new Error(errorData.detail || 'Failed to get learning path advice');
        }
        const data = await apiResponse.json();
        if (data.status === 'success') {
          response = data.advice;
        } else {
          throw new Error(data.message || 'Failed to get learning path advice');
        }
      } else if (isCourseRecommendation) {
        // Call course recommendations endpoint
        console.log("Making course recommendation request for userCode:", userCode);
        const apiResponse = await fetch(`${API_BASE_URL}/learning-path/recommendations/${userCode}`);
        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          throw new Error(errorData.detail || 'Failed to get course recommendations');
        }
        const data = await apiResponse.json();
        if (data.status === 'success') {
          response = formatCourseRecommendations(data.courses);
        } else {
          throw new Error(data.message || 'Failed to get course recommendations');
        }
      } else {
        // For all other queries, use RAG-based response
        console.log('Sending RAG query:', {
          message,
          context: { 
            chat_history: messages.map(msg => ({
              role: msg.isUser ? "user" : "assistant",
              content: msg.text
            }))
          }
        });

        const ragResponse = await queryRAG(message, { 
          chat_history: messages.map(msg => ({
            role: msg.isUser ? "user" : "assistant",
            content: msg.text
          }))
        });

        console.log('RAG response status:', ragResponse.status);
        
        if (!ragResponse.ok) {
          const errorData = await ragResponse.text();
          console.error('RAG error response:', errorData);
          throw new Error(`Failed to get response from RAG service: ${errorData}`);
        }

        const data = await ragResponse.json();
        console.log('RAG response data:', data);
        
        if (data.status === 'success') {
          response = data.answer;
          if (data.has_context) {
            response += "\n\n(Câu trả lời này được tham khảo từ tài liệu đã được tải lên)";
          }
        } else {
          throw new Error(data.message || 'Failed to get response');
        }
      }

      // Add AI response
      const aiMessageObj = {
        id: `ai-${Date.now()}`,
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessageObj]);

    } catch (error) {
      console.error('Error handling message:', error);
      const errorMessageObj = {
        id: `error-${Date.now()}`,
        text: 'Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

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
    if (!input.trim()) return;
    await handleUserMessage(input.trim());
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
              <div className="suggestion-buttons">
                {SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    className="suggestion-button"
                    onClick={() => handleUserMessage(suggestion.value)}
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">
                      {message.isUser ? 'You' : 'AI Assistant'}
                    </span>
                  </div>
                  <div className="message-text">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Override default components to maintain styling
                        h1: ({node, ...props}) => <h1 className="markdown-h1" {...props} />,
                        h2: ({node, ...props}) => <h2 className="markdown-h2" {...props} />,
                        h3: ({node, ...props}) => <h3 className="markdown-h3" {...props} />,
                        h4: ({node, ...props}) => <h4 className="markdown-h4" {...props} />,
                        p: ({node, ...props}) => <p className="markdown-p" {...props} />,
                        ul: ({node, ...props}) => <ul className="markdown-ul" {...props} />,
                        ol: ({node, ...props}) => <ol className="markdown-ol" {...props} />,
                        li: ({node, ...props}) => <li className="markdown-li" {...props} />,
                        strong: ({node, ...props}) => <strong className="markdown-strong" {...props} />,
                        em: ({node, ...props}) => <em className="markdown-em" {...props} />,
                        code: ({node, ...props}) => <code className="markdown-code" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="markdown-blockquote" {...props} />
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
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