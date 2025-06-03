import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseEditor from '../components/courses/CourseEditor';
import './CourseEditorPage.css';

const CourseEditorPage = ({ courses = [], onEditCourse, onCreateCourse }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const selectedCourse = courseId ? courses.find(c => c.id === courseId) : null;

  const handleSave = (courseData) => {
    if (selectedCourse) {
      onEditCourse(courseData);
    } else {
      onCreateCourse(courseData);
    }
    navigate('/admin/courses');
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  return (
    <div className="course-editor-page">
      <CourseEditor
        course={selectedCourse}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CourseEditorPage; 