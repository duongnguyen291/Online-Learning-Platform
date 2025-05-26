import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCourseForm from '../components/courses/CreateCourseForm';
import './CreateCoursePage.css';

const CreateCoursePage = ({ onCreateCourse }) => {
  const navigate = useNavigate();

  const handleSave = (courseData) => {
    onCreateCourse(courseData);
    navigate('/admin/courses');
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  return (
    <div className="create-course-page">
      <CreateCourseForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreateCoursePage; 