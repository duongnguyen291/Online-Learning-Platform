import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, BookOpen, Users, Clock, Award, X, Search, Download, User } from 'lucide-react';
import { getLecturerCourses, deleteCourse, getEnrolledStudents } from '../../services/CourseService';
import './MyCourses.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'draft'
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentError, setStudentError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLecturerCourses();
  }, []);

  const fetchLecturerCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the CourseService to fetch courses
      const coursesData = await getLecturerCourses();
      setCourses(coursesData || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to load courses');
      // Use dummy data if API fails
      setCourses([
        {
          CourseCode: 'CS101',
          Name: 'Introduction to Computer Science',
          category: 'Computer Science',
          image: 'https://via.placeholder.com/300x200?text=CS101',
          Status: 'Active',
          Lessons: '12',
          totalLength: '24h 30m',
          enrollmentCount: 45
        },
        {
          CourseCode: 'MATH201',
          Name: 'Advanced Calculus',
          category: 'Mathematics',
          image: 'https://via.placeholder.com/300x200?text=MATH201',
          Status: 'Active',
          Lessons: '10',
          totalLength: '20h 15m',
          enrollmentCount: 32
        },
        {
          CourseCode: 'PHYS101',
          Name: 'Introduction to Physics',
          category: 'Physics',
          image: 'https://via.placeholder.com/300x200?text=PHYS101',
          Status: 'Draft',
          Lessons: '8',
          totalLength: '16h 45m',
          enrollmentCount: 0
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = () => {
    navigate('/courses/new');
  };

  const handleEditCourse = (course) => {
    navigate(`/courses/edit/${course.CourseCode}`);
  };

  const handleDeleteCourse = async (courseCode) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        // Call API to delete course
        await deleteCourse(courseCode);
        // Refresh the course list
        fetchLecturerCourses();
      } catch (err) {
        setError(err.message || 'Failed to delete course');
      }
    }
  };

  const handleViewStudents = async (course) => {
    setSelectedCourse(course);
    setIsLoadingStudents(true);
    setStudentError(null);
    setSearchTerm('');

    try {
      const studentsData = await getEnrolledStudents(course.CourseCode);
      setStudents(studentsData || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudentError(err.message || 'Failed to load students');
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const closeStudentPopup = () => {
    setSelectedCourse(null);
    setStudents([]);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExportCSV = () => {
    if (!students.length) return;

    // Prepare CSV data
    const headers = ['Student ID', 'Name', 'Email', 'Progress', 'Score', 'Start Date'];
    const csvData = students.map(item => [
      item.student.userCode,
      item.student.name,
      item.student.email || 'N/A',
      item.enrollment.progress,
      item.enrollment.score,
      new Date(item.enrollment.startDate).toLocaleDateString()
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `students-${selectedCourse.CourseCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const student = item.student;
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.userCode.toLowerCase().includes(searchLower) ||
      (student.email && student.email.toLowerCase().includes(searchLower))
    );
  });

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.Status.toLowerCase() === filter;
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải khóa học...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchLecturerCourses} className="retry-button">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="my-courses-container">
      <div className="courses-header">
        <h1>Khóa học của tôi</h1>
        <button className="create-course-btn" onClick={handleCreateCourse}>
          <Plus size={16} />
          Tạo khóa học mới
        </button>
      </div>

      <div className="courses-filter">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả ({courses.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Đang hoạt động ({courses.filter(c => c.Status.toLowerCase() === 'active').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
          onClick={() => setFilter('draft')}
        >
          Bản nháp ({courses.filter(c => c.Status.toLowerCase() === 'draft').length})
        </button>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="no-courses">
          <p>Không có khóa học nào {filter !== 'all' ? `ở trạng thái "${filter}"` : ''}</p>
          <button className="create-course-btn" onClick={handleCreateCourse}>
            <Plus size={16} />
            Tạo khóa học mới
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div key={course.CourseCode} className="course-card">
              <div className="course-image">
                <img src={course.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={course.Name} />
                <div className={`course-status ${course.Status.toLowerCase()}`}>
                  {course.Status === 'Active' ? 'Đang hoạt động' : 'Bản nháp'}
                </div>
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.Name}</h3>
                <p className="course-category">{course.category}</p>
                
                <div className="course-stats">
                  <div className="stat">
                    <BookOpen size={16} />
                    <span>{course.Lessons} bài học</span>
                  </div>
                  <div className="stat">
                    <Clock size={16} />
                    <span>{course.totalLength}</span>
                  </div>
                  <div 
                    className="stat clickable"
                    onClick={() => handleViewStudents(course)}
                    title="Xem danh sách học viên"
                  >
                    <Users size={16} />
                    <span>{course.enrollmentCount || 0} học viên</span>
                  </div>
                  {course.rating > 0 && (
                    <div className="stat">
                      <Award size={16} />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                <div className="course-actions">
                  <button 
                    className="view-students-btn"
                    onClick={() => handleViewStudents(course)}
                  >
                    <Users size={16} />
                    Học viên
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit size={16} />
                    Chỉnh sửa
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteCourse(course.CourseCode)}
                  >
                    <Trash2 size={16} />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student List Popup */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={closeStudentPopup}>
          <div className="modal-container student-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Users size={20} />
                <h3>Danh sách học viên - {selectedCourse.Name}</h3>
              </div>
              <button 
                className="modal-close" 
                onClick={closeStudentPopup}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="course-stats-summary">
                <div className="stat">
                  <Users size={16} />
                  <span>{selectedCourse.enrollmentCount || 0} học viên đã đăng ký</span>
                </div>
                <div className="stat">
                  <BookOpen size={16} />
                  <span>{selectedCourse.Lessons || 0} bài học</span>
                </div>
              </div>

              <div className="students-tools">
                <div className="search-container">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm học viên..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                </div>
                <button 
                  className="export-button"
                  onClick={handleExportCSV}
                  disabled={!students.length}
                >
                  <Download size={16} />
                  <span>Xuất CSV</span>
                </button>
              </div>

              {isLoadingStudents ? (
                <div className="loading-indicator">
                  <div className="loading-spinner small"></div>
                  <p>Đang tải danh sách học viên...</p>
                </div>
              ) : studentError ? (
                <div className="error-message-compact">
                  {studentError}
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="no-students-message">
                  {students.length === 0 ? (
                    <p>Chưa có học viên nào đăng ký khóa học này</p>
                  ) : (
                    <p>Không tìm thấy học viên phù hợp với từ khóa "{searchTerm}"</p>
                  )}
                </div>
              ) : (
                <div className="students-table-container">
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>Mã học viên</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Ngày bắt đầu</th>
                        <th>Tiến độ</th>
                        <th>Điểm số</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((item, index) => (
                        <tr key={index}>
                          <td>{item.student.userCode}</td>
                          <td>{item.student.name}</td>
                          <td>{item.student.email || 'N/A'}</td>
                          <td>{new Date(item.enrollment.startDate).toLocaleDateString()}</td>
                          <td>
                            <div className="progress-cell">
                              <div className="progress-info">{item.enrollment.progress}</div>
                            </div>
                          </td>
                          <td>
                            <div className="score-badge">
                              {item.enrollment.score}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="close-button"
                onClick={closeStudentPopup}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses; 