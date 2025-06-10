import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload, Users } from 'lucide-react';
import { getCourseById, updateCourse } from '../services/CourseService';
import './CourseForm.css';

const EditCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    category: '',
    originalPrice: 0,
    discountedPrice: 0,
    language: 'Vietnamese',
    Status: 'Draft',
    whatLearn: [''],
  });

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setIsFetching(true);
    setError(null);

    try {
      // Use CourseService to fetch course details
      const courseData = await getCourseById(courseId);
      
      if (!courseData) {
        throw new Error('Course not found');
      }

      setFormData({
        ...courseData,
        whatLearn: courseData.whatLearn && Array.isArray(courseData.whatLearn) 
          ? courseData.whatLearn 
          : ['']
      });
      
      if (courseData.image) {
        setImagePreview(courseData.image);
      }
    } catch (err) {
      console.error('Error fetching course details:', err);
      setError(err.message || 'Failed to load course details');
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleWhatLearnChange = (index, value) => {
    const updatedWhatLearn = [...formData.whatLearn];
    updatedWhatLearn[index] = value;
    setFormData({
      ...formData,
      whatLearn: updatedWhatLearn
    });
  };

  const addWhatLearnItem = () => {
    setFormData({
      ...formData,
      whatLearn: [...formData.whatLearn, '']
    });
  };

  const removeWhatLearnItem = (index) => {
    const updatedWhatLearn = formData.whatLearn.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      whatLearn: updatedWhatLearn
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Get lecturer info from localStorage
      const lecturerInfo = localStorage.getItem('lecturerInfo');
      if (!lecturerInfo) {
        throw new Error('No lecturer information found');
      }

      const { userId } = JSON.parse(lecturerInfo);

      // Prepare course data
      const courseData = {
        ...formData,
        image: imagePreview,
        whatLearn: formData.whatLearn.filter(item => item.trim() !== '')
      };

      // Use CourseService to update the course
      await updateCourse(courseId, courseData);
      
      // Navigate back to courses page
      navigate('/courses');
    } catch (err) {
      console.error('Error updating course:', err);
      setError(err.message || 'Failed to update course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  if (isFetching) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin khóa học...</p>
      </div>
    );
  }

  return (
    <div className="course-form-container">
      <div className="form-header">
        <button className="back-button" onClick={handleCancel}>
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1>Chỉnh sửa khóa học</h1>
        <button 
          className="view-students-button"
          onClick={() => navigate(`/courses/${courseId}/students`)}
        >
          <Users size={16} />
          <span>Xem học viên</span>
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-grid">
          <div className="form-section">
            <h2>Thông tin cơ bản</h2>
            
            <div className="form-group">
              <label htmlFor="Name">Tên khóa học *</label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                required
                placeholder="Nhập tên khóa học"
              />
            </div>

            <div className="form-group">
              <label htmlFor="Description">Mô tả *</label>
              <textarea
                id="Description"
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                required
                placeholder="Mô tả chi tiết về khóa học"
                rows={5}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Danh mục *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn danh mục</option>
                <option value="Computer Science">Khoa học máy tính</option>
                <option value="Mathematics">Toán học</option>
                <option value="Physics">Vật lý</option>
                <option value="Chemistry">Hóa học</option>
                <option value="Biology">Sinh học</option>
                <option value="Language">Ngôn ngữ</option>
                <option value="History">Lịch sử</option>
                <option value="Art">Nghệ thuật</option>
                <option value="Business">Kinh doanh</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="originalPrice">Giá gốc ($) *</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="discountedPrice">Giá khuyến mãi ($) *</label>
                <input
                  type="number"
                  id="discountedPrice"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="language">Ngôn ngữ</label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                >
                  <option value="Vietnamese">Tiếng Việt</option>
                  <option value="English">Tiếng Anh</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="Status">Trạng thái</label>
                <select
                  id="Status"
                  name="Status"
                  value={formData.Status}
                  onChange={handleInputChange}
                >
                  <option value="Draft">Bản nháp</option>
                  <option value="Active">Đang hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Hình ảnh và Nội dung</h2>
            
            <div className="form-group">
              <label>Hình ảnh khóa học</label>
              <div className="image-upload">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Course preview" />
                    <button 
                      type="button" 
                      className="remove-image" 
                      onClick={() => setImagePreview(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={24} />
                    <span>Tải lên hình ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Học viên sẽ học được gì?</label>
              <div className="what-learn-list">
                {formData.whatLearn.map((item, index) => (
                  <div key={index} className="what-learn-item">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleWhatLearnChange(index, e.target.value)}
                      placeholder="Ví dụ: Hiểu về cấu trúc dữ liệu"
                    />
                    {formData.whatLearn.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-item"
                        onClick={() => removeWhatLearnItem(index)}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button"
                  className="add-item"
                  onClick={addWhatLearnItem}
                >
                  + Thêm mục tiêu học tập
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={handleCancel}
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-text">Đang cập nhật...</span>
            ) : (
              <>
                <Save size={16} />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCoursePage; 