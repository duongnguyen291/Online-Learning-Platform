import React, { useState } from 'react';
import { Search, X, Mail, Phone, UserCheck, UserX, Download, Upload, Users } from 'lucide-react';
import './CourseStudents.css';

const CourseStudents = ({ course, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('enrolled'); // 'enrolled' or 'pending'

  // Dummy data for demonstration
  const [enrolledStudents, setEnrolledStudents] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      status: 'active',
      progress: 75,
      lastAccess: '2024-03-15'
    },
  ]);

  const [pendingStudents, setPendingStudents] = useState([
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0987654321',
      requestDate: '2024-03-16',
      message: 'Tôi rất quan tâm đến khóa học này và muốn tham gia để nâng cao kiến thức.'
    },
  ]);

  const handleApproveStudent = (student) => {
    if (window.confirm(`Bạn có chắc chắn muốn phê duyệt học viên ${student.name}?`)) {
      const approvedStudent = {
        ...student,
        status: 'active',
        progress: 0,
        lastAccess: new Date().toISOString().split('T')[0]
      };
      setEnrolledStudents([...enrolledStudents, approvedStudent]);
      setPendingStudents(pendingStudents.filter(s => s.id !== student.id));
    }
  };

  const handleRejectStudent = (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu tham gia này?')) {
      setPendingStudents(pendingStudents.filter(student => student.id !== studentId));
    }
  };

  const handleRemoveStudent = (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này khỏi khóa học?')) {
      setEnrolledStudents(enrolledStudents.filter(student => student.id !== studentId));
    }
  };

  const handleExportStudents = () => {
    // Implement CSV export functionality
    console.log('Exporting students...');
  };

  const handleImportStudents = () => {
    // Implement CSV import functionality
    console.log('Importing students...');
  };

  const filteredEnrolledStudents = enrolledStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phone.includes(searchQuery)
  );

  const filteredPendingStudents = pendingStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phone.includes(searchQuery)
  );

  return (
    <div className="course-students">
      <div className="students-header">
        <div className="header-title">
          <h2>Quản lý học viên</h2>
          <p className="course-name">{course.title}</p>
        </div>
        <button className="btn-icon" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="students-toolbar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="toolbar-actions">
          <button className="btn-secondary" onClick={handleExportStudents}>
            <Download size={20} />
            Xuất danh sách
          </button>
          <button className="btn-secondary" onClick={handleImportStudents}>
            <Upload size={20} />
            Nhập danh sách
          </button>
        </div>
      </div>

      <div className="students-tabs">
        <button
          className={`tab-button ${activeTab === 'enrolled' ? 'active' : ''}`}
          onClick={() => setActiveTab('enrolled')}
        >
          <Users size={20} />
          Học viên đang học
          <span className="count">{enrolledStudents.length}</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <UserCheck size={20} />
          Chờ duyệt
          <span className="count">{pendingStudents.length}</span>
        </button>
      </div>

      {activeTab === 'enrolled' ? (
        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>Học viên</th>
                <th>Liên hệ</th>
                <th>Trạng thái</th>
                <th>Tiến độ</th>
                <th>Truy cập gần nhất</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrolledStudents.map(student => (
                <tr key={student.id}>
                  <td className="student-name">{student.name}</td>
                  <td className="student-contact">
                    <div className="contact-info">
                      <span><Mail size={16} /> {student.email}</span>
                      <span><Phone size={16} /> {student.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${student.status}`}>
                      {student.status === 'active' ? 'Đang học' : 'Đã nghỉ'}
                    </span>
                  </td>
                  <td>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${student.progress}%` }}
                      />
                      <span>{student.progress}%</span>
                    </div>
                  </td>
                  <td>{student.lastAccess}</td>
                  <td>
                    <button
                      className="btn-icon"
                      onClick={() => handleRemoveStudent(student.id)}
                      title="Xóa khỏi khóa học"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>Học viên</th>
                <th>Liên hệ</th>
                <th>Ngày yêu cầu</th>
                <th>Lời nhắn</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPendingStudents.map(student => (
                <tr key={student.id}>
                  <td className="student-name">{student.name}</td>
                  <td className="student-contact">
                    <div className="contact-info">
                      <span><Mail size={16} /> {student.email}</span>
                      <span><Phone size={16} /> {student.phone}</span>
                    </div>
                  </td>
                  <td>{student.requestDate}</td>
                  <td className="student-message">{student.message}</td>
                  <td className="action-buttons">
                    <button
                      className="btn-icon approve"
                      onClick={() => handleApproveStudent(student)}
                      title="Phê duyệt"
                    >
                      <UserCheck size={16} />
                    </button>
                    <button
                      className="btn-icon reject"
                      onClick={() => handleRejectStudent(student.id)}
                      title="Từ chối"
                    >
                      <UserX size={16} />
                    </button>
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

export default CourseStudents; 