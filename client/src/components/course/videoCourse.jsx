// videoCourse.jsx
import React, { useState, useRef, useEffect } from 'react';
import { courseData } from '../../assets/data/VideoCourseData';
import '../../assets/css/videoCourse.css';

const VideoCourse = () => {
  const [currentLesson, setCurrentLesson] = useState(courseData.currentLesson);
  const [expandedChapters, setExpandedChapters] = useState(['chapter-001']);

  // Chuyển đổi YouTube URL sang embed format
  const getYouTubeEmbedUrl = (url) => {
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }
    
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // Chapter and lesson handlers
  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const selectLesson = (chapterId, lesson) => {
    const newCurrentLesson = {
      chapterId,
      lessonId: lesson.lessonId,
      title: lesson.title,
      description: getChapterByLesson(lesson.lessonId)?.description || courseData.currentLesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration
    };
    setCurrentLesson(newCurrentLesson);
  };

  const getChapterByLesson = (lessonId) => {
    for (const chapter of courseData.chapters) {
      const lesson = chapter.lessons.find(l => l.lessonId === lessonId);
      if (lesson) return chapter;
    }
    return null;
  };

  const getLessonNumber = (lessonId) => {
    let count = 1;
    for (const chapter of courseData.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.lessonId === lessonId) return count;
        count++;
      }
    }
    return count;
  };

  return (
    <div className="video-course-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="course-header">
          <button className="back-button">←</button>
          <h1 className="course-title">{courseData.title}</h1>
          <div className="course-meta">
            <span className="meta-item">📚 {courseData.totalLectures} lectures</span>
            <span className="meta-item">⏱️ {courseData.totalDuration}</span>
          </div>
        </div>

        {/* Video Section */}
        <div className="video-section">
          <div className="video-container">
            <iframe
              className="video-player"
              src={getYouTubeEmbedUrl(currentLesson.videoUrl)}
              title={currentLesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Lesson Information */}
        <div className="lesson-info">
          <div className="lesson-header">
            <div className="lesson-number">{getLessonNumber(currentLesson.lessonId)}</div>
            <h2 className="lesson-title">{currentLesson.title}</h2>
          </div>

          <div className="instructor-info">
            <img 
              src={courseData.instructor.avatar} 
              alt={courseData.instructor.name}
              className="instructor-avatar"
            />
            <div className="instructor-details">
              <h4>{courseData.instructor.name}</h4>
              <p className="instructor-stats">
                ⭐ {courseData.instructor.rating} • {courseData.instructor.students.toLocaleString()} students
              </p>
            </div>
          </div>

          <div className="lesson-meta">
            <span>Last updated: {courseData.lastUpdated}</span>
            <span>Duration: {currentLesson.duration}</span>
          </div>

          <div className="lesson-description">
            <p>{currentLesson.description}</p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Course Contents</h3>
          <p className="course-progress">{courseData.completionRate}% Complete</p>
        </div>

        {courseData.chapters.map((chapter) => (
          <div key={chapter.chapterId} className="chapter">
            <div 
              className="chapter-header"
              onClick={() => toggleChapter(chapter.chapterId)}
            >
              <div className="chapter-info">
                <h3>{chapter.title}</h3>
                <div className="chapter-meta">
                  <span>📚 {chapter.lectures} lectures</span>
                  <span>⏱️ {chapter.duration}</span>
                </div>
              </div>
              <button 
                className={`chapter-toggle ${expandedChapters.includes(chapter.chapterId) ? 'expanded' : ''}`}
              >
                ⌄
              </button>
            </div>

            <div className={`lessons-list ${expandedChapters.includes(chapter.chapterId) ? 'expanded' : ''}`}>
              {chapter.lessons.map((lesson, index) => (
                <div
                  key={lesson.lessonId}
                  className={`lesson-item ${currentLesson.lessonId === lesson.lessonId ? 'active' : ''}`}
                  onClick={() => selectLesson(chapter.chapterId, lesson)}
                >
                  <div className={`lesson-status ${
                    lesson.completed ? 'completed' : 
                    currentLesson.lessonId === lesson.lessonId ? 'current' : 'pending'
                  }`}>
                    {lesson.completed ? '✓' : 
                     currentLesson.lessonId === lesson.lessonId ? '▶' : index + 1}
                  </div>
                  
                  <div className="lesson-details">
                    <h4>{lesson.title}</h4>
                    <span className="lesson-duration">⏱️ {lesson.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoCourse;