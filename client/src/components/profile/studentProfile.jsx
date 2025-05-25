import React, { useState, useEffect } from 'react';
import { getCurrentStudent } from '../../assets/data/student';
import { FaFacebook, FaLinkedin, FaGithub, FaInstagram, FaBehance, FaTwitter } from 'react-icons/fa';
import './studentProfile.css';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Lấy thông tin học viên hiện tại
    const currentStudent = getCurrentStudent();
    setStudent(currentStudent);
  }, []);

  if (!student) {
    return <div className="loading">Đang tải thông tin học viên...</div>;
  }

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'facebook':
        return <FaFacebook />;
      case 'linkedin':
        return <FaLinkedin />;
      case 'github':
        return <FaGithub />;
      case 'instagram':
        return <FaInstagram />;
      case 'behance':
        return <FaBehance />;
      case 'twitter':
        return <FaTwitter />;
      default:
        return null;
    }
  };

  return (
    <div className="student-profile">

      <div className="profile-container">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              <img src="/api/placeholder/120/120" alt={student.name} />
            </div>
            <h2 className="profile-name">{student.name}</h2>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Total Course</span>
                <span className="stat-value">{student.enrolledCourses.length}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Ratings</span>
                <div className="rating">
                  <span className="rating-star">★</span>
                  <span className="rating-value">{student.gpa}</span>
                  <span className="rating-count">({student.completedCredits})</span>
                </div>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Experiences</span>
                <span className="stat-value">{student.currentSemester} Semesters</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Graduated</span>
                <span className="stat-value">{student.status === 'Đang học' ? 'No' : 'Yes'}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Language</span>
                <span className="stat-value">Vietnamese</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Social</span>
                <div className="social-links">
                  {Object.entries(student.socialLinks).map(([platform, url]) => (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className={`social-icon ${platform}`}>
                      {getSocialIcon(platform)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {/* About Section */}
          <div className="content-section">
            <h3>About {student.name.split(' ')[0]}</h3>
            <p>{student.bio}</p>
            <p>
              Sinh viên chuyên ngành {student.major}, hiện đang học kỳ {student.currentSemester}. 
              Có GPA {student.gpa} và đã hoàn thành {student.completedCredits}/{student.totalCredits} tín chỉ.
            </p>
            <p>
              Địa chỉ: {student.address}<br/>
              Email: {student.email}<br/>
              Điện thoại: {student.phone}
            </p>
          </div>

          {/* Certification Section */}
          <div className="content-section">
            <h3>Certification</h3>
            <div className="certificates">
              {student.certificates.map((cert) => (
                <div key={cert.id} className="certificate-item">
                  <h4>{cert.name}</h4>
                  <p>Issued: {new Date(cert.issueDate).toLocaleDateString('vi-VN')}</p>
                  <p>Score: {cert.score}/100</p>
                </div>
              ))}
            </div>
          </div>

          {/* Courses Section */}
          <div className="content-section">
            <h3>Courses ({student.enrolledCourses.length})</h3>
            <div className="courses-list">
              {student.enrolledCourses.map((course, index) => (
                <div key={course.courseId} className="course-item">
                  <div className="course-image">
                    <img src="/api/placeholder/80/80" alt={course.courseName} />
                  </div>
                  <div className="course-info">
                    <h4>{course.courseName}</h4>
                    <p className="course-category">{student.major} - Course</p>
                    <p className="course-description">
                      Khóa học {course.courseName} với tiến độ hoàn thành {course.progress}%. 
                      {course.grade && ` Điểm đạt được: ${course.grade}`}
                    </p>
                    <div className="course-price">
                      <span className="current-price">$ 380</span>
                      <span className="old-price">$ 500</span>
                    </div>
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{course.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="content-section">
            <h3>Achievements</h3>
            <div className="achievements">
              {student.achievements.map((achievement, index) => (
                <div key={index} className="achievement-item">
                  <span className="achievement-icon">🏆</span>
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;