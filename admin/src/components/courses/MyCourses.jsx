import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Users, Trash, BookOpen, BarChart3 } from 'lucide-react';
import CourseStudents from './CourseStudents';
import './MyCourses.css';

const MyCourses = ({ courses = [], adminInfo = {}, onDeleteCourse }) => {
  const navigate = useNavigate();
  const [showStudents, setShowStudents] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleEditClick = (course) => {
    navigate(`/admin/courses/edit/${course.id}`);
  };

  const handleStudentsClick = (course) => {
    setSelectedCourse(course);
    setShowStudents(true);
  };

  const handleCreateCourse = () => {
    navigate('/admin/courses/new');
  };

  return (
    <div className="my-courses">
      <div className="content-header">
        <div className="header-info">
          <h1>Khóa học của tôi</h1>
          <p>Quản lý và theo dõi các khóa học bạn đang giảng dạy</p>
        </div>
        <button className="btn-primary" onClick={handleCreateCourse}>
          <Plus size={20} />
          Tạo khóa học mới
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon courses">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <h3>{courses.length}</h3>
            <p>Khóa học đang dạy</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon students">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{courses.reduce((total, course) => total + (course.students?.length || 0), 0)}</h3>
            <p>Tổng học viên</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completion">
            <BarChart3 size={24} />
          </div>
          <div className="stat-info">
            <h3>{Math.round(courses.filter(c => c.status === 'completed').length / courses.length * 100) || 0}%</h3>
            <p>Tỷ lệ hoàn thành</p>
          </div>
        </div>
      </div>

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-thumbnail">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} />
              ) : (
                <div className="thumbnail-placeholder">
                  <span>{course.title.charAt(0)}</span>
                </div>
              )}
              <div className="course-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEditClick(course)}
                  title="Chỉnh sửa khóa học"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleStudentsClick(course)}
                  title="Quản lý học viên"
                >
                  <Users size={20} />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => onDeleteCourse(course.id)}
                  title="Xóa khóa học"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>

            <div className="course-info">
              <h3>{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <div className="course-meta">
                <span className={`status-badge ${course.status}`}>
                  {course.status === 'active' ? 'Đang diễn ra' :
                   course.status === 'completed' ? 'Hoàn thành' : 'Chuẩn bị'}
                </span>
                <span className="students-count">
                  <Users size={16} />
                  {course.students?.length || 0} học viên
                </span>
              </div>
              {course.progress !== undefined && (
                <div className="course-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span>
                    {course.status === 'completed' ? 'Hoàn thành' : 
                     course.status === 'planning' ? `${course.progress}% chuẩn bị` :
                     `${course.progress}% hoàn thành`}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showStudents && selectedCourse && (
        <CourseStudents
          course={selectedCourse}
          onClose={() => setShowStudents(false)}
        />
      )}
    </div>
  );
};

export default MyCourses; 