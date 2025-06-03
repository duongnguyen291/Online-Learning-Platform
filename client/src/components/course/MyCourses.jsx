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

// Sample course data - moved outside component
const sampleCourses = [
  {
    id: 1,
    title: "React Development Masterclass",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    instructor: "John Smith",
    rating: 4.8,
    students: 1250,
    duration: "12 hours",
    level: "Intermediate"
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
    instructor: "Sarah Johnson",
    rating: 4.9,
    students: 890,
    duration: "8 hours",
    level: "Beginner"
  },
  {
    id: 3,
    title: "JavaScript Advanced Concepts",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
    instructor: "Mike Chen",
    rating: 4.7,
    students: 2100,
    duration: "15 hours",
    level: "Advanced"
  },
  {
    id: 4,
    title: "Python for Data Science",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
    instructor: "Dr. Lisa Wang",
    rating: 4.8,
    students: 1680,
    duration: "20 hours",
    level: "Intermediate"
  },
  {
    id: 5,
    title: "Digital Marketing Strategy",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    instructor: "Alex Rivera",
    rating: 4.6,
    students: 950,
    duration: "10 hours",
    level: "Beginner"
  },
  {
    id: 6,
    title: "Mobile App Development",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
    instructor: "Emma Taylor",
    rating: 4.9,
    students: 1350,
    duration: "18 hours",
    level: "Advanced"
  }
];

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const userCourses = sampleCourses.map(course => ({
      ...course,
      progress: Math.floor(Math.random() * 100),
      enrollmentDate: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
    setMyCourses(userCourses);
  }, []); // Empty dependency array is now correct

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