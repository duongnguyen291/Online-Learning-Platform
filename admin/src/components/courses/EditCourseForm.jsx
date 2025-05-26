import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash, Image } from 'lucide-react';
import './CourseForm.css';

const EditCourseForm = ({ course, onSave, onCancel }) => {
  const [courseData, setCourseData] = useState({
    ...course,
    chapters: course.chapters || []
  });
  
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [newObjective, setNewObjective] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCourseData(prev => ({
          ...prev,
          thumbnail: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addLearningObjective = () => {
    if (newObjective.trim()) {
      setCourseData(prev => ({
        ...prev,
        learningObjectives: [...(prev.learningObjectives || []), newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeLearningObjective = (index) => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const updateChapter = (chapterId, field, value) => {
    setCourseData(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter =>
        chapter.id === chapterId
          ? { ...chapter, [field]: value }
          : chapter
      )
    }));
  };

  const deleteChapter = (chapterId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chương này?')) {
      setCourseData(prev => ({
        ...prev,
        chapters: prev.chapters.filter(chapter => chapter.id !== chapterId)
      }));
    }
  };

  const updateLesson = (chapterId, lessonId, field, value) => {
    setCourseData(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter =>
        chapter.id === chapterId
          ? {
              ...chapter,
              lessons: chapter.lessons.map(lesson =>
                lesson.id === lessonId
                  ? { ...lesson, [field]: value }
                  : lesson
              )
            }
          : chapter
      )
    }));
  };

  const deleteLesson = (chapterId, lessonId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
      setCourseData(prev => ({
        ...prev,
        chapters: prev.chapters.map(chapter =>
          chapter.id === chapterId
            ? {
                ...chapter,
                lessons: chapter.lessons.filter(lesson => lesson.id !== lessonId)
              }
            : chapter
        )
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(courseData);
  };

  return (
    <div className="course-form">
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="header-content">
            <h2>Chỉnh sửa khóa học</h2>
            <p className="course-id">ID: {course.id}</p>
          </div>
          <div className="header-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              Lưu thay đổi
            </button>
          </div>
        </div>

        <div className="form-content">
          <div className="course-main-info">
            <div className="thumbnail-section">
              <div 
                className="thumbnail-upload"
                onClick={() => fileInputRef.current.click()}
              >
                {courseData.thumbnail ? (
                  <img src={courseData.thumbnail} alt="Course thumbnail" />
                ) : (
                  <div className="thumbnail-placeholder">
                    <Image size={32} />
                    <span>Tải lên ảnh khóa học</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleThumbnailChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            <div className="form-group">
              <label>Tên khóa học</label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Mô tả khóa học</label>
              <textarea
                value={courseData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={courseData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="planning">Chuẩn bị</option>
                  <option value="active">Đang diễn ra</option>
                  <option value="completed">Hoàn thành</option>
                </select>
              </div>

              <div className="form-group">
                <label>Thời lượng khóa học</label>
                <input
                  type="text"
                  value={courseData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Ví dụ: 8 tuần"
                />
              </div>

              <div className="form-group">
                <label>Học phí</label>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="VND"
                />
              </div>

              <div className="form-group">
                <label>Số lượng học viên tối đa</label>
                <input
                  type="number"
                  value={courseData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Đối tượng học viên</label>
              <textarea
                value={courseData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                rows={3}
                placeholder="Mô tả đối tượng học viên phù hợp với khóa học"
              />
            </div>

            <div className="form-group">
              <label>Yêu cầu tiên quyết</label>
              <textarea
                value={courseData.prerequisites}
                onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                rows={3}
                placeholder="Các kiến thức, kỹ năng cần có trước khi tham gia khóa học"
              />
            </div>

            <div className="form-group">
              <label>Chứng nhận</label>
              <textarea
                value={courseData.certification}
                onChange={(e) => handleInputChange('certification', e.target.value)}
                rows={3}
                placeholder="Mô tả về chứng chỉ hoặc chứng nhận sau khi hoàn thành khóa học"
              />
            </div>

            <div className="form-group">
              <label>Mục tiêu khóa học</label>
              <div className="objectives-list">
                {courseData.learningObjectives?.map((objective, index) => (
                  <div key={index} className="objective-item">
                    <span>{objective}</span>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => removeLearningObjective(index)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
                <div className="objective-input">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Thêm mục tiêu mới"
                    onKeyPress={(e) => e.key === 'Enter' && addLearningObjective()}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="chapters-section">
            <div className="section-header">
              <h3>Nội dung khóa học</h3>
            </div>

            <div className="chapters-list">
              {courseData.chapters.map((chapter, index) => (
                <div key={chapter.id} className="chapter-item">
                  <div className="chapter-header">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                    >
                      {expandedChapter === chapter.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div className="chapter-title">
                      <span className="chapter-number">Chương {index + 1}</span>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                        placeholder="Tên chương"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => deleteChapter(chapter.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>

                  {expandedChapter === chapter.id && (
                    <div className="chapter-content">
                      <div className="form-group">
                        <label>Mô tả chương</label>
                        <textarea
                          value={chapter.description}
                          onChange={(e) => updateChapter(chapter.id, 'description', e.target.value)}
                          rows={2}
                        />
                      </div>

                      <div className="lessons-list">
                        {chapter.lessons?.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="lesson-item">
                            <div className="lesson-header">
                              <span className="lesson-number">{lessonIndex + 1}</span>
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => updateLesson(chapter.id, lesson.id, 'title', e.target.value)}
                                placeholder="Tên bài học"
                              />
                              <button
                                type="button"
                                className="btn-icon"
                                onClick={() => deleteLesson(chapter.id, lesson.id)}
                              >
                                <Trash size={16} />
                              </button>
                            </div>

                            <div className="lesson-content">
                              <div className="form-group">
                                <label>Mô tả bài học</label>
                                <textarea
                                  value={lesson.description}
                                  onChange={(e) => updateLesson(chapter.id, lesson.id, 'description', e.target.value)}
                                  rows={2}
                                />
                              </div>
                              <div className="form-group">
                                <label>URL Video (YouTube)</label>
                                <input
                                  type="url"
                                  value={lesson.videoUrl}
                                  onChange={(e) => updateLesson(chapter.id, lesson.id, 'videoUrl', e.target.value)}
                                  placeholder="https://youtube.com/watch?v=..."
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCourseForm; 