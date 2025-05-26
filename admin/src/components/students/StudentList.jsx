import React, { useState } from 'react';
import { Search, UserPlus, Check, X, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import studentData from '../../assets/data/StudentData';
import './StudentList.css';

const StudentList = () => {
  const [students, setStudents] = useState(studentData.getStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const results = studentData.searchStudents(query);
      setStudents(results);
    } else {
      setStudents(studentData.getStudents());
    }
  };

  const handleStatusChange = (studentId, newStatus) => {
    if (window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái của học viên này?')) {
      studentData.updateStudentStatus(studentId, newStatus);
      setStudents(studentData.getStudents());
    }
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này?')) {
      studentData.deleteStudent(studentId);
      setStudents(studentData.getStudents());
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'inactive':
        return 'status-inactive';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang học';
      case 'pending':
        return 'Chờ duyệt';
      case 'inactive':
        return 'Ngừng học';
      default:
        return status;
    }
  };

  return (
    <div className="content-section">
      <div className="content-header">
        <div className="header-info">
          <h1>Danh sách học viên</h1>
          <p>Quản lý thông tin và trạng thái học viên</p>
        </div>
        <button className="btn-primary">
          <UserPlus size={20} />
          Thêm học viên
        </button>
      </div>

      <div className="list-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm học viên..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>Học viên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Ngày tham gia</th>
              <th>Khóa học</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td className="student-info">
                  <div className="student-avatar">
                    {student.avatar ? (
                      <img src={student.avatar} alt={student.fullName} />
                    ) : (
                      student.fullName.charAt(0)
                    )}
                  </div>
                  <div className="student-name">
                    <strong>{student.fullName}</strong>
                    <span>{student.id}</span>
                  </div>
                </td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{new Date(student.joinDate).toLocaleDateString('vi-VN')}</td>
                <td>{student.enrolledCourses.length} khóa học</td>
                <td>
                  <span className={`status-badge ${getStatusColor(student.status)}`}>
                    {getStatusText(student.status)}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {student.status === 'pending' && (
                      <>
                        <button
                          className="btn-icon success"
                          onClick={() => handleStatusChange(student.id, 'active')}
                          title="Duyệt"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleStatusChange(student.id, 'inactive')}
                          title="Từ chối"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    <button className="btn-icon" title="Chỉnh sửa">
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDeleteStudent(student.id)}
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="btn-icon" title="Thêm">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList; 