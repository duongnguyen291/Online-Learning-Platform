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
        lessons: 24,
        progress: 75
      },
      {
        id: 'course002',
        title: 'Backend với Node.js',
        description: 'Xây dựng API và database với Node.js và MongoDB',
        status: 'planning',
        students: 0,
        lessons: 18,
        progress: 30
      },
      {
        id: 'course003',
        title: 'Cơ bản lập trình',
        description: 'Nhập môn lập trình với Python cho người mới bắt đầu',
        status: 'completed',
        students: 89,
        lessons: 20,
        progress: 100
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
      },
      {
        id: 'notif003',
        message: 'Lịch dạy tuần tới đã được cập nhật',
        type: 'schedule',
        timestamp: new Date('2024-05-25T16:45:00'),
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
    this.adminInfo = { ...this.adminInfo, ...updatedInfo };
    this.updateStats();
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
      status: 'planning',
      students: 0,
      progress: 0
    };
    this.courses.push(newCourse);
    this.updateStats();
    return newCourse;
  }

  // Cập nhật khóa học
  updateCourse(courseId, updatedData) {
    const courseIndex = this.courses.findIndex(course => course.id === courseId);
    if (courseIndex !== -1) {
      this.courses[courseIndex] = { ...this.courses[courseIndex], ...updatedData };
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

  // Lấy thông báo
  getNotifications() {
    return [...this.notifications];
  }

  // Đánh dấu thông báo đã đọc
  markNotificationAsRead(notificationId) {
    const notification = this.notifications.find(notif => notif.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    return notification;
  }

  // Đánh dấu tất cả thông báo đã đọc
  markAllNotificationsAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    return this.notifications;
  }

  // Thêm thông báo mới
  addNotification(message, type = 'info') {
    const newNotification = {
      id: `notif${String(this.notifications.length + 1).padStart(3, '0')}`,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    this.notifications.unshift(newNotification);
    return newNotification;
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
      course.description.toLowerCase().includes(searchTerm)
    );
  }

  // Lấy số thông báo chưa đọc
  getUnreadNotificationCount() {
    return this.notifications.filter(notif => !notif.read).length;
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

// Singleton instance
const adminData = new AdminData();

export default adminData;