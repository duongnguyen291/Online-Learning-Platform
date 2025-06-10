import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, User, BookOpen, Award, Clock } from 'lucide-react';
import { getEnrolledStudents, getCourseById } from '../../services/CourseService';
import './EnrolledStudents.css';

const EnrolledStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch course details
      const courseData = await getCourseById(courseId);
      setCourse(courseData);
      
      // Fetch enrolled students
      const studentsData = await getEnrolledStudents(courseId);
      setStudents(studentsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/courses/edit/${courseId}`);
  };

  const handleSearch = (e) => {
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
    link.setAttribute('download', `students-${courseId}.csv`);
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách học viên...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchData} className="retry-button">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="enrolled-students-container">
      <div className="students-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1>Học viên đã đăng ký</h1>
      </div>

      {course && (
        <div className="course-info">
          <h2>{course.Name}</h2>
          <div className="course-stats">
            <div className="stat">
              <User size={16} />
              <span>{students.length} học viên</span>
            </div>
            <div className="stat">
              <BookOpen size={16} />
              <span>{course.Lessons || 0} bài học</span>
            </div>
            <div className="stat">
              <Clock size={16} />
              <span>{course.totalLength || '0h 0m'}</span>
            </div>
            {course.rating > 0 && (
              <div className="stat">
                <Award size={16} />
                <span>{course.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="students-tools">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm học viên..."
            value={searchTerm}
            onChange={handleSearch}
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

      {filteredStudents.length === 0 ? (
        <div className="no-students">
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
  );
};

export default EnrolledStudents; 