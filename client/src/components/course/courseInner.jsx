import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Circle } from 'lucide-react';
import { courseData } from '../../assets/data/courseInnerData.js';
import '../../assets/css/courseInner.css';

export default function InnerCourse() {
  // State to track which chapters are expanded
  const [expandedChapters, setExpandedChapters] = useState({
    'chapter1': true,
    'chapter2': false,
    'chapter3': false
  });

  // Function to toggle chapter expansion
  const toggleChapter = (chapterId) => {
    setExpandedChapters({
      ...expandedChapters,
      [chapterId]: !expandedChapters[chapterId]
    });
  };

  return (
    <div className="ehoc-container">
      {/* Left Sidebar */}
      <div className="ehoc-sidebar">
        <div className="ehoc-sidebar-header">
          <div className="ehoc-sidebar-logo-container">
            <div className="ehoc-logo-wrapper">
              <div className="ehoc-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
            <div className="ehoc-course-title">
              <div>Embedded Hardware</div>
              <div>and Operating Systems</div>
            </div>
          </div>
        </div>
        
        <div className="ehoc-sidebar-content">
          <div className="ehoc-sidebar-section">
            <div className="ehoc-sidebar-heading">
              <ChevronDown className="ehoc-icon" />
              <span className="ehoc-sidebar-heading-text">Course Material</span>
            </div>
            
            <div className="ehoc-chapter-list">
              {courseData.chapters.map((chapter, index) => (
                <div key={chapter.id} className="ehoc-chapter-item">
                  {chapter.completed ? 
                    <CheckCircle className="ehoc-chapter-icon ehoc-chapter-icon-completed" /> : 
                    <Circle className="ehoc-chapter-icon ehoc-chapter-icon-incomplete" />
                  }
                  <span className={`ehoc-chapter-text ${index === 0 ? 'ehoc-chapter-text-active' : 'ehoc-chapter-text-inactive'}`}>
                    {chapter.title.replace("Chapter ", "")}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="ehoc-sidebar-section ehoc-sidebar-section-border">
            <div className="ehoc-sidebar-heading">
              <ChevronDown className="ehoc-icon" />
              <span className="ehoc-sidebar-heading-text">Assignment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ehoc-main">
        <div className="ehoc-content-wrapper">
          <div className="ehoc-course-container">
            <h1 className="ehoc-course-header">
              {courseData.title}
            </h1>
            <div className="ehoc-badge-container">
              <div className="ehoc-badge">Complete</div>
            </div>

            {/* Chapters and Lessons */}
            {courseData.chapters.map((chapter) => (
              <div key={chapter.id} className="ehoc-chapter-container">
                <div 
                  className="ehoc-chapter-header" 
                  onClick={() => toggleChapter(chapter.id)}
                >
                  <div className="ehoc-chapter-header-left">
                    {expandedChapters[chapter.id] ? 
                      <ChevronUp className="ehoc-icon" /> : 
                      <ChevronDown className="ehoc-icon" />
                    }
                    <h2 className="ehoc-chapter-title">{chapter.title}</h2>
                  </div>
                  <div>
                    {chapter.completed && (
                      <div className="ehoc-badge">Complete</div>
                    )}
                  </div>
                </div>

                {/* Lessons */}
                {expandedChapters[chapter.id] && (
                  <div className="ehoc-lessons-container">
                    {chapter.lessons.map((lesson) => (
                      <div key={lesson.id} className="ehoc-lesson-item">
                        <div className="ehoc-lesson-icon-wrapper">
                          {lesson.completed ? 
                            <CheckCircle className="ehoc-lesson-icon" /> : 
                            <Circle className="ehoc-lesson-icon" />
                          }
                        </div>
                        <div className="ehoc-lesson-content">
                          <h3 className="ehoc-lesson-title">{lesson.title}</h3>
                          <div className="ehoc-lesson-details">
                            <span>{lesson.type}</span>
                            <span className="ehoc-lesson-details-separator">·</span>
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}