import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  Play,
  Award,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MyCourses.css';

const MyCourses = () => {
  const [courseProgress, setCourseProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log(userInfo);

    fetchUserProgress(userInfo.userId);
  }, [navigate]);

  const fetchUserProgress = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/progress?userCode=${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          // If unauthorized, clear user info and redirect to login
          localStorage.removeItem('userInfo');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch course progress');
      }

      const data = await response.json();
      
      if (data.success && data.progress) {
        setCourseProgress(data.progress);
      } else {
        setError(data.message || 'Failed to fetch progress');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: courseProgress.length,
    completed: courseProgress.filter(course => course.status === 'completed').length,
    inProgress: courseProgress.filter(course => course.status === 'in-progress').length,
    averageProgress: courseProgress.length > 0 
      ? Math.round(courseProgress.reduce((acc, course) => acc + course.progress, 0) / courseProgress.length)
      : 0
  };

  const handleContinueLearning = (CourseCode, progress) => {
    navigate(`/course-content/${CourseCode}/${progress || 0}`);
  };

  const formatTimeSpent = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10B981'; // Green
      case 'in-progress':
        return '#3B82F6'; // Blue
      default:
        return '#6B7280'; // Gray for not-started
    }
  };

  if (loading) {
    return (
      <div className="mycourses-page">
        <div className="mycourses-loading">
          Loading your progress...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mycourses-page">
        <div className="mycourses-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mycourses-page">
      {/* Header Section */}
      <div className="mycourses-header">
        <div className="mycourses-header-container">
          <div className="mycourses-header-content">
            <div className="mycourses-header-text">
              <h1>My Learning Progress</h1>
              <p>Track your course progress and learning journey</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mycourses-main-container">
        {/* Stats Cards */}
        <div className="mycourses-stats-grid">
          <div className="mycourses-stat-card">
            <div className="mycourses-stat-content">
              <div className="mycourses-stat-icon mycourses-red-icon">
                <BookOpen size={24} />
              </div>
              <div className="mycourses-stat-info">
                <p className="mycourses-stat-number">{stats.total}</p>
                <p className="mycourses-stat-label">Total Courses</p>
              </div>
            </div>
          </div>

          <div className="mycourses-stat-card">
            <div className="mycourses-stat-content">
              <div className="mycourses-stat-icon mycourses-green-icon">
                <CheckCircle size={24} />
              </div>
              <div className="mycourses-stat-info">
                <p className="mycourses-stat-number">{stats.completed}</p>
                <p className="mycourses-stat-label">Completed Courses</p>
              </div>
            </div>
          </div>

          <div className="mycourses-stat-card">
            <div className="mycourses-stat-content">
              <div className="mycourses-stat-icon mycourses-blue-icon">
                <TrendingUp size={24} />
              </div>
              <div className="mycourses-stat-info">
                <p className="mycourses-stat-number">{stats.averageProgress}%</p>
                <p className="mycourses-stat-label">Average Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="mycourses-grid">
          {courseProgress.map(course => (
            <div key={course.CourseCode} className="mycourses-card">
              <div className="mycourses-content">
                <div className="mycourses-info-section">
                  <div className="mycourses-header-section">
                    <h3 className={course.CourseCode}>{course.CourseCode}</h3>
                    <div className="mycourses-progress-badge" style={{
                      backgroundColor: getStatusColor(course.status)
                    }}>
                      {course.progress}% Complete
                    </div>
                  </div>

                  <div className="mycourses-meta">
                    <div className="mycourses-meta-item">
                      <Clock size={14} />
                      <span>Time Spent: {formatTimeSpent(course.timeSpent)}</span>
                    </div>
                    <div className="mycourses-meta-item">
                      <Calendar size={14} />
                      <span>Last Accessed: {new Date(course.lastAccessed).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mycourses-meta">
                    <div className="mycourses-meta-item">
                      <CheckCircle size={14} />
                      <span>Status: {course.status}</span>
                    </div>
                    {course.completedAt && (
                      <div className="mycourses-meta-item">
                        <Award size={14} />
                        <span>Completed: {new Date(course.completedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {course.notes && (
                    <div className="mycourses-notes">
                      <p>{course.Notes}</p>
                    </div>
                  )}
                </div>

                <div className="mycourses-actions-section">
                  <button 
                    className="mycourses-continue-btn"
                    onClick={() => handleContinueLearning(course.CourseCode, course.progress)}
                  >
                    <Play size={18} />
                    {course.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courseProgress.length === 0 && (
          <div className="mycourses-empty-state">
            <BookOpen size={64} color="#d1d5db" />
            <h3>No courses in progress</h3>
            <p>You haven't started any courses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;