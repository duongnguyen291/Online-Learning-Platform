// AdminData.js - Quản lý dữ liệu admin
class AdminData {
  constructor() {
    this.adminInfo = {
      id: 'admin001',
      fullName: 'Nguyễn Văn A',
      email: 'gvien@email.com',
      phone: '0123456789',
      specialization: 'Lập trình Web, Mobile',
      bio: 'Giảng viên với 8 năm kinh nghiệm trong lĩnh vực phát triển phần mềm và đào tạo lập trình.',
      avatar: null,
      joinDate: '2020-01-15',
      totalCourses: 12,
      totalStudents: 1245,
      completionRate: 89,
      weeklyClasses: 24
    };

    this.courses = [
      {
        id: 'course001',
        title: 'Lập trình Web Frontend',
        description: 'Khóa học về HTML, CSS, JavaScript và React',
        status: 'active',
        students: 156,
        progress: 75,
        chapters: [
          {
            id: 'chapter001',
            title: 'Giới thiệu về Web Frontend',
            description: 'Tổng quan về phát triển web và các công nghệ frontend',
            lessons: [
              {
                id: 'lesson001',
                title: 'Web hoạt động như thế nào?',
                description: 'Giới thiệu về cách web browser và web server tương tác',
                videoUrl: 'https://youtube.com/watch?v=example1'
              },
              {
                id: 'lesson002',
                title: 'HTML cơ bản',
                description: 'Cấu trúc HTML và các thẻ thông dụng',
                videoUrl: 'https://youtube.com/watch?v=example2'
              }
            ]
          },
          {
            id: 'chapter002',
            title: 'CSS và Styling',
            description: 'Học cách tạo giao diện đẹp với CSS',
            lessons: [
              {
                id: 'lesson003',
                title: 'CSS Selectors',
                description: 'Các cách chọn phần tử trong CSS',
                videoUrl: 'https://youtube.com/watch?v=example3'
              }
            ]
          }
        ]
      },
      {
        id: 'course002',
        title: 'Backend với Node.js',
        description: 'Xây dựng API và database với Node.js và MongoDB',
        status: 'planning',
        students: 0,
        progress: 30,
        chapters: [
          {
            id: 'chapter003',
            title: 'Giới thiệu Node.js',
            description: 'Tổng quan về Node.js và môi trường phát triển',
            lessons: []
          }
        ]
      }
    ];

    this.notifications = [
      {
        id: 'notif001',
        message: 'Có 5 bài tập mới cần chấm điểm',
        type: 'assignment',
        timestamp: new Date('2024-05-26T10:30:00'),
        read: false
      },
      {
        id: 'notif002',
        message: 'Học viên Nguyễn Thị B đã hoàn thành khóa học Frontend',
        type: 'completion',
        timestamp: new Date('2024-05-26T09:15:00'),
        read: false
      }
    ];
  }

  // Lấy thông tin admin
  getAdminInfo() {
    return { ...this.adminInfo };
  }

  // Cập nhật thông tin admin
  updateAdminInfo(updatedInfo) {
    this.adminInfo = {
      ...this.adminInfo,
      ...updatedInfo
    };
    return this.adminInfo;
  }

  // Cập nhật avatar
  updateAvatar(avatarData) {
    this.adminInfo.avatar = avatarData;
    return this.adminInfo;
  }

  // Lấy danh sách khóa học
  getCourses() {
    return [...this.courses];
  }

  // Thêm khóa học mới
  addCourse(courseData) {
    const newCourse = {
      id: `course${String(this.courses.length + 1).padStart(3, '0')}`,
      ...courseData,
      status: courseData.status || 'planning',
      students: 0,
      progress: 0,
      chapters: courseData.chapters || []
    };
    this.courses.push(newCourse);
    this.updateStats();
    return newCourse;
  }

  // Cập nhật khóa học
  updateCourse(courseId, updatedData) {
    const courseIndex = this.courses.findIndex(course => course.id === courseId);
    if (courseIndex !== -1) {
      this.courses[courseIndex] = {
        ...this.courses[courseIndex],
        ...updatedData,
        chapters: updatedData.chapters || this.courses[courseIndex].chapters
      };
      this.updateStats();
      return this.courses[courseIndex];
    }
    return null;
  }

  // Xóa khóa học
  deleteCourse(courseId) {
    const courseIndex = this.courses.findIndex(course => course.id === courseId);
    if (courseIndex !== -1) {
      const deletedCourse = this.courses.splice(courseIndex, 1)[0];
      this.updateStats();
      return deletedCourse;
    }
    return null;
  }

  // Thêm học viên vào khóa học
  addStudentToCourse(courseId, studentData) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      course.students += 1;
      this.updateStats();
      return true;
    }
    return false;
  }

  // Xóa học viên khỏi khóa học
  removeStudentFromCourse(courseId, studentId) {
    const course = this.courses.find(c => c.id === courseId);
    if (course && course.students > 0) {
      course.students -= 1;
      this.updateStats();
      return true;
    }
    return false;
  }

  // Lấy thông báo
  getNotifications() {
    return [...this.notifications];
  }

  // Thêm thông báo mới
  addNotification(message, type = 'info') {
    const notification = {
      id: `notif${String(this.notifications.length + 1).padStart(3, '0')}`,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    this.notifications.unshift(notification);
    return notification;
  }

  // Đánh dấu thông báo đã đọc
  markNotificationAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  // Đánh dấu tất cả thông báo đã đọc
  markAllNotificationsAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }

  // Lấy số thông báo chưa đọc
  getUnreadNotificationCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  // Cập nhật thống kê tự động
  updateStats() {
    const totalStudents = this.courses.reduce((sum, course) => sum + course.students, 0);
    const completedCourses = this.courses.filter(course => course.status === 'completed');
    const completionRate = this.courses.length > 0 
      ? Math.round((completedCourses.length / this.courses.length) * 100) 
      : 0;

    this.adminInfo = {
      ...this.adminInfo,
      totalCourses: this.courses.length,
      totalStudents: totalStudents,
      completionRate: completionRate
    };
  }

  // Tìm kiếm khóa học
  searchCourses(query) {
    const searchTerm = query.toLowerCase();
    return this.courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.chapters?.some(chapter =>
        chapter.title.toLowerCase().includes(searchTerm) ||
        chapter.description?.toLowerCase().includes(searchTerm) ||
        chapter.lessons?.some(lesson =>
          lesson.title.toLowerCase().includes(searchTerm) ||
          lesson.description?.toLowerCase().includes(searchTerm)
        )
      )
    );
  }

  // Reset dữ liệu về mặc định
  resetData() {
    this.__constructor();
  }

  // Export dữ liệu
  exportData() {
    return {
      adminInfo: this.adminInfo,
      courses: this.courses,
      notifications: this.notifications,
      exportDate: new Date().toISOString()
    };
  }

  // Import dữ liệu
  importData(data) {
    if (data.adminInfo) this.adminInfo = data.adminInfo;
    if (data.courses) this.courses = data.courses;
    if (data.notifications) this.notifications = data.notifications;
  }
}

export default new AdminData();