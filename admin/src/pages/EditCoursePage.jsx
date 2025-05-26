import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditCourseForm from '../components/courses/EditCourseForm';
import './EditCoursePage.css';

const EditCoursePage = ({ courses = [], onEditCourse }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="edit-course-page">
        <div className="error-message">
          <h2>Không tìm thấy khóa học</h2>
          <p>Khóa học bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/admin/courses')}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (courseData) => {
    onEditCourse(courseData);
    navigate('/admin/courses');
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  return (
    <div className="edit-course-page">
      <EditCourseForm
        course={course}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditCoursePage; 