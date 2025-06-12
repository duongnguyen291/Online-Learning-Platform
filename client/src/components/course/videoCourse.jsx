// videoCourse.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../../assets/css/videoCourse.css';
import { useNavigate } from 'react-router-dom';


const VideoCourse = () => {
  const navigate = useNavigate();
  const { courseCode, progress } = useParams();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [courseInfo, setCourseInfo] = useState({
    title: '',
    totalLectures: 0,
    totalDuration: '0h 0m',
    instructor: {
      name: '',
      avatar: '',
      rating: 0,
      students: 0
    },
    lastUpdated: '',
    completionRate: 0
  });

  // Get userInfo from localStorage
  const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  };

  // Fetch chapters when component mounts
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const userInfo = getUserInfo();
        if (!userInfo || !userInfo.userId) {
          console.error('User not logged in');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/v1/chapters?userCode=${userInfo.userId}&courseCode=${courseCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'credentials': 'include'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setChapters(data.chapters);
          // Set first chapter's first lesson as current if available
          if (data.chapters.length > 0) {
            setExpandedChapters([data.chapters[0].chapterCode]);
          }
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    if (courseCode) {
      fetchChapters();
    }
  }, [courseCode]);

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
  const toggleChapter = (chapterCode) => {
    setExpandedChapters(prev => 
      prev.includes(chapterCode) 
        ? prev.filter(id => id !== chapterCode)
        : [...prev, chapterCode]
    );
  };

  const selectLesson = (chapterCode, lesson) => {
    const chapter = chapters.find(ch => ch.chapterCode === chapterCode);
    if (chapter) {
      setCurrentLesson({
        chapterCode,
        lessonId: lesson.lessonId,
        title: lesson.title,
        description: chapter.description || '',
        videoUrl: lesson.videoUrl,
        duration: lesson.duration
      });
    }
  };

  return (
    <div className="video-course-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="course-header">
          <button className="back-button" onClick={() => navigate('/my-courses')}>←</button>
          <h1 className="course-title">{courseInfo.title}</h1>
          <div className="course-meta">
            <span className="meta-item">📚 {courseInfo.totalLectures} lectures</span>
            <span className="meta-item">⏱️ {courseInfo.totalDuration}</span>
          </div>
        </div>

        {/* Video Section */}
        {currentLesson && (
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
        )}

        {/* Lesson Information */}
        {currentLesson && (
          <div className="lesson-info">
            <div className="lesson-header">
              <h2 className="lesson-title">{currentLesson.title}</h2>
            </div>

            <div className="instructor-info">
              <img 
                src={courseInfo.instructor.avatar} 
                alt={courseInfo.instructor.name}
                className="instructor-avatar"
              />
              <div className="instructor-details">
                <h4>{courseInfo.instructor.name}</h4>
                <p className="instructor-stats">
                  ⭐ {courseInfo.instructor.rating} • {courseInfo.instructor.students.toLocaleString()} students
                </p>
              </div>
            </div>

            <div className="lesson-meta">
              <span>Last updated: {courseInfo.lastUpdated}</span>
              <span>Duration: {currentLesson.duration}</span>
            </div>

            <div className="lesson-description">
              <p>{currentLesson.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Course Contents</h3>
          <p className="course-progress">{courseInfo.completionRate}% Complete</p>
        </div>

        {chapters.map((chapter) => (
          <div key={chapter.chapterCode} className="chapter">
            <div 
              className="chapter-header"
              onClick={() => toggleChapter(chapter.chapterCode)}
            >
              <div className="chapter-info">
                <h3>{chapter.name}</h3>
                <div className="chapter-meta">
                  <span>{chapter.description}</span>
                </div>
              </div>
              <button 
                className={`chapter-toggle ${expandedChapters.includes(chapter.chapterCode) ? 'expanded' : ''}`}
              >
                ⌄
              </button>
            </div>

            <div className={`lessons-list ${expandedChapters.includes(chapter.chapterCode) ? 'expanded' : ''}`}>
              {chapter.lessons && chapter.lessons.map((lesson, index) => (
                <div
                  key={lesson.lessonId}
                  className={`lesson-item ${currentLesson?.lessonId === lesson.lessonId ? 'active' : ''}`}
                  onClick={() => selectLesson(chapter.chapterCode, lesson)}
                >
                  <div className={`lesson-status ${
                    lesson.completed ? 'completed' : 
                    currentLesson?.lessonId === lesson.lessonId ? 'current' : 'pending'
                  }`}>
                    {lesson.completed ? '✓' : 
                     currentLesson?.lessonId === lesson.lessonId ? '▶' : index + 1}
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