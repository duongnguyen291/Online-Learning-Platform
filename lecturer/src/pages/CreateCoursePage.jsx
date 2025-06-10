import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';
import { createCourse } from '../services/CourseService';
import './CourseForm.css';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generateAutoCourseCode, setGenerateAutoCourseCode] = useState(true);
  
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    category: '',
    CourseCode: '',
    originalPrice: 0,
    discountedPrice: 0,
    language: 'Vietnamese',
    Status: 'Draft',
    whatLearn: [''],
  });

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

  const toggleCourseCodeGeneration = () => {
    setGenerateAutoCourseCode(!generateAutoCourseCode);
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

      const { userId, name } = JSON.parse(lecturerInfo);

      // Validate manual course code if provided
      if (!generateAutoCourseCode) {
        if (!formData.CourseCode || formData.CourseCode.trim() === '') {
          throw new Error('Course code is required when auto-generation is disabled');
        }
        
        // Check if the code follows a valid format (alphanumeric, no spaces)
        if (!/^[A-Za-z0-9]+$/.test(formData.CourseCode)) {
          throw new Error('Course code must contain only letters and numbers (no spaces or special characters)');
        }
      }

      // Prepare course data
      const courseData = {
        ...formData,
        Lecturer: name,
        LecturerCode: userId,
        image: imagePreview,
        whatLearn: formData.whatLearn.filter(item => item.trim() !== ''),
        useManualCourseCode: !generateAutoCourseCode
      };

      // Call the API to create the course
      await createCourse(courseData);
      
      // Navigate back to courses page
      navigate('/courses');
    } catch (err) {
      console.error('Error creating course:', err);
      setError(err.message || 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  return (
    <div className="course-form-container">
      <div className="form-header">
        <button className="back-button" onClick={handleCancel}>
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1>Tạo khóa học mới</h1>
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

            <div className="course-code-section">
              <div className="toggle-container">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={generateAutoCourseCode}
                    onChange={toggleCourseCodeGeneration}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Tự động tạo mã khóa học</span>
                </label>
              </div>
              
              {!generateAutoCourseCode && (
                <div className="form-group">
                  <label htmlFor="CourseCode">Mã khóa học *</label>
                  <input
                    type="text"
                    id="CourseCode"
                    name="CourseCode"
                    value={formData.CourseCode}
                    onChange={handleInputChange}
                    required={!generateAutoCourseCode}
                    placeholder="Nhập mã khóa học (chỉ chữ và số, không dấu cách)"
                  />
                  <small className="helper-text">
                    Mã khóa học phải là duy nhất và chỉ chứa chữ cái và số (không dấu cách, không ký tự đặc biệt)
                  </small>
                </div>
              )}
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
              <span className="loading-text">Đang tạo...</span>
            ) : (
              <>
                <Save size={16} />
                <span>Tạo khóa học</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage; 