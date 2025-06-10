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
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isLoggedIn || !userInfo.userId) {
      navigate('/login');
      return;
    }

    fetchEnrolledCourses(userInfo.userId);
  }, [navigate]);

  const fetchEnrolledCourses = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/my-courses?userId=${userId}`, {
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
        throw new Error('Failed to fetch enrolled courses');
      }

      const data = await response.json();
      
      if (data.success && data.courses) {
        const formattedCourses = data.courses.map(course => ({
          id: course._id,
          courseCode: course.courseCode,
          title: course.name,
          lecturer: course.lecturer,
          status: course.status,
          progress: course.progress,
          score: course.score,
          enrollmentDate: course.enrollmentDate,
        }));
        setMyCourses(formattedCourses);
      } else {
        setError(data.message || 'Failed to fetch courses');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = myCourses.filter(course => {
    return true;
  });

  const stats = {
    total: myCourses.length,
    inProgress: myCourses.length, // Since we don't have percentage progress, all courses are "in progress"
    completed: 0 // We'll need a different way to determine completed courses
  };

  const getTitleClass = (title) => {
    return title.length > 40 ? 'mycourses-title long-title' : 'mycourses-title';
  };

  const handleContinueLearning = (courseCode, progress) => {
    // Navigate to the course content page with the progress code
    navigate(`/course-content/${courseCode}/${progress || ''}`);
  };

  if (loading) {
    return (
      <div className="mycourses-page">
        <div className="mycourses-loading">
          Loading your courses...
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
              <h1>My Learning Journey</h1>
              <p>Track your progress and continue learning</p>
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
              <div className="mycourses-stat-icon mycourses-blue-icon">
                <Award size={24} />
              </div>
              <div className="mycourses-stat-info">
                <p className="mycourses-stat-number">{myCourses.length > 0 ? (myCourses.reduce((acc, course) => acc + course.score, 0) / myCourses.length).toFixed(1) : 0}</p>
                <p className="mycourses-stat-label">Average Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="mycourses-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="mycourses-card">
              <div className="mycourses-content">
                <div className="mycourses-info-section">
                  <div className="mycourses-header-section">
                    <h3 className={getTitleClass(course.title)}>{course.title}</h3>
                  </div>

                  <div className="mycourses-meta">
                    <div className="mycourses-meta-item">
                      <BookOpen size={14} />
                      <span>Course Code: {course.courseCode}</span>
                    </div>
                    <div className="mycourses-meta-item">
                      <Award size={14} />
                      <span>Score: {course.score}</span>
                    </div>
                  </div>

                  <div className="mycourses-meta">
                    <div className="mycourses-meta-item">
                      <Calendar size={14} />
                      <span>Enrolled: {new Date(course.enrollmentDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mycourses-meta">
                    <div className="mycourses-meta-item">
                      <Users size={14} />
                      <span>Lecturer: {course.lecturer}</span>
                    </div>
                    <div className="mycourses-meta-item">
                      <Clock size={14} />
                      <span>Status: {course.status}</span>
                    </div>
                  </div>
                </div>

                <div className="mycourses-actions-section">
                  <button 
                    className="mycourses-continue-btn"
                    onClick={() => handleContinueLearning(course.courseCode, course.progress)}
                  >
                    <Play size={18} />
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="mycourses-empty-state">
            <BookOpen size={64} color="#d1d5db" />
            <h3>No courses found</h3>
            <p>You don't have any courses in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;