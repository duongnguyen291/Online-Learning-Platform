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
import './MyCourses.css';

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      // First, fetch the course codes
      const response = await fetch('http://localhost:5000/api/v1/user/courses', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch enrolled courses');
      }

      const data = await response.json();
      
      if (data.success) {
        // Transform the course codes into course objects with progress
        const coursesWithProgress = data.courseCodes.map(courseCode => ({
          id: courseCode,
          title: `Course ${courseCode}`, // You can fetch actual course details if available
          progress: Math.floor(Math.random() * 100), // Replace with actual progress
          enrollmentDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          students: Math.floor(Math.random() * 2000) + 500,
          duration: "12 hours"
        }));
        setMyCourses(coursesWithProgress);
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
    if (activeTab === 'completed') return course.progress === 100;
    if (activeTab === 'inProgress') return course.progress > 0 && course.progress < 100;
    return true;
  });

  const stats = {
    total: myCourses.length,
    inProgress: myCourses.filter(course => course.progress > 0 && course.progress < 100).length,
    completed: myCourses.filter(course => course.progress === 100).length
  };

  const getTitleClass = (title) => {
    return title.length > 40 ? 'mycourses-title long-title' : 'mycourses-title';
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
              <div className="mycourses-stat-icon mycourses-orange-icon">
                <Clock size={24} />
              </div>
              <div className="mycourses-stat-info">
                <p className="mycourses-stat-number">{stats.inProgress}</p>
                <p className="mycourses-stat-label">In Progress</p>
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
                <p className="mycourses-stat-label">Completed</p>
              </div>
            </div>
          </div>

          <div className="mycourses-stat-card">
            <div className="mycourses-stat-content">
              <div className="mycourses-stat-icon mycourses-blue-icon">
                <TrendingUp size={24} />
              </div>
              <div className="mycourses-stat-info">
                <p className="mycourses-stat-number">{Math.round(myCourses.reduce((acc, course) => acc + course.progress, 0) / myCourses.length) || 0}%</p>
                <p className="mycourses-stat-label">Average Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="mycourses-tabs">
          <button 
            className={`mycourses-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <BookOpen size={18} />
            All Courses ({stats.total})
          </button>
          <button 
            className={`mycourses-tab-btn ${activeTab === 'inProgress' ? 'active' : ''}`}
            onClick={() => setActiveTab('inProgress')}
          >
            <Clock size={18} />
            In Progress ({stats.inProgress})
          </button>
          <button 
            className={`mycourses-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <CheckCircle size={18} />
            Completed ({stats.completed})
          </button>
        </div>

        {/* Courses Grid */}
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
                      <Users size={14} />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="mycourses-meta-item">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  
                  <div className="mycourses-progress-section">
                    <div className="mycourses-progress-header">
                      <span>Progress</span>
                      <span className="mycourses-progress-percent">{course.progress}%</span>
                    </div>
                    <div className="mycourses-progress-bar">
                      <div 
                        className="mycourses-progress-fill"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mycourses-enrollment-date">
                    <Calendar size={14} />
                    <span>Enrolled: {new Date(course.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mycourses-actions-section">
                  <button className="mycourses-continue-btn">
                    {course.progress === 100 ? (
                      <>
                        <Award size={18} />
                        View Certificate
                      </>
                    ) : course.progress > 0 ? (
                      <>
                        <Play size={18} />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <Play size={18} />
                        Start Course
                      </>
                    )}
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