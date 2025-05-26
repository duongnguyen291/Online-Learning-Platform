// StudentData.js - Quản lý dữ liệu học viên
class StudentData {
  constructor() {
    this.students = [
      {
        id: 'STU001',
        fullName: 'Trần Thị Minh',
        email: 'minh.tran@email.com',
        phone: '0912345678',
        avatar: null,
        joinDate: '2024-01-15',
        status: 'active', // active, inactive, pending
        enrolledCourses: ['course001', 'course002'],
        progress: {
          'course001': {
            completed: 75,
            lastAccess: '2024-05-25',
            grades: [
              { lessonId: 'lesson001', score: 85, submittedDate: '2024-05-20' },
              { lessonId: 'lesson002', score: 90, submittedDate: '2024-05-22' }
            ]
          },
          'course002': {
            completed: 30,
            lastAccess: '2024-05-26',
            grades: [
              { lessonId: 'lesson003', score: 88, submittedDate: '2024-05-24' }
            ]
          }
        }
      },
      {
        id: 'STU002',
        fullName: 'Nguyễn Văn Bình',
        email: 'binh.nguyen@email.com',
        phone: '0923456789',
        avatar: null,
        joinDate: '2024-02-01',
        status: 'active',
        enrolledCourses: ['course001'],
        progress: {
          'course001': {
            completed: 60,
            lastAccess: '2024-05-24',
            grades: [
              { lessonId: 'lesson001', score: 92, submittedDate: '2024-05-19' },
              { lessonId: 'lesson002', score: 85, submittedDate: '2024-05-21' }
            ]
          }
        }
      },
      {
        id: 'STU003',
        fullName: 'Lê Thị Hương',
        email: 'huong.le@email.com',
        phone: '0934567890',
        avatar: null,
        joinDate: '2024-02-15',
        status: 'pending',
        enrolledCourses: ['course002'],
        progress: {
          'course002': {
            completed: 15,
            lastAccess: '2024-05-23',
            grades: []
          }
        }
      },
      {
        id: 'STU004',
        fullName: 'Phạm Văn Đức',
        email: 'duc.pham@email.com',
        phone: '0945678901',
        avatar: null,
        joinDate: '2024-03-01',
        status: 'inactive',
        enrolledCourses: ['course001'],
        progress: {
          'course001': {
            completed: 40,
            lastAccess: '2024-05-20',
            grades: [
              { lessonId: 'lesson001', score: 78, submittedDate: '2024-05-18' }
            ]
          }
        }
      },
      {
        id: 'STU005',
        fullName: 'Hoàng Thị Mai',
        email: 'mai.hoang@email.com',
        phone: '0956789012',
        avatar: null,
        joinDate: '2024-03-15',
        status: 'active',
        enrolledCourses: ['course001', 'course002'],
        progress: {
          'course001': {
            completed: 90,
            lastAccess: '2024-05-25',
            grades: [
              { lessonId: 'lesson001', score: 95, submittedDate: '2024-05-15' },
              { lessonId: 'lesson002', score: 88, submittedDate: '2024-05-20' }
            ]
          },
          'course002': {
            completed: 45,
            lastAccess: '2024-05-26',
            grades: [
              { lessonId: 'lesson003', score: 92, submittedDate: '2024-05-24' }
            ]
          }
        }
      }
    ];
  }

  // Lấy danh sách học viên
  getStudents() {
    return [...this.students];
  }

  // Lấy thông tin chi tiết học viên
  getStudent(studentId) {
    return this.students.find(student => student.id === studentId);
  }

  // Thêm học viên mới
  addStudent(studentData) {
    const newStudent = {
      id: `STU${String(this.students.length + 1).padStart(3, '0')}`,
      ...studentData,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      enrolledCourses: [],
      progress: {}
    };
    this.students.push(newStudent);
    return newStudent;
  }

  // Cập nhật thông tin học viên
  updateStudent(studentId, updatedData) {
    const studentIndex = this.students.findIndex(student => student.id === studentId);
    if (studentIndex !== -1) {
      this.students[studentIndex] = {
        ...this.students[studentIndex],
        ...updatedData
      };
      return this.students[studentIndex];
    }
    return null;
  }

  // Xóa học viên
  deleteStudent(studentId) {
    const studentIndex = this.students.findIndex(student => student.id === studentId);
    if (studentIndex !== -1) {
      return this.students.splice(studentIndex, 1)[0];
    }
    return null;
  }

  // Cập nhật trạng thái học viên
  updateStudentStatus(studentId, status) {
    const student = this.students.find(student => student.id === studentId);
    if (student) {
      student.status = status;
      return true;
    }
    return false;
  }

  // Ghi danh khóa học cho học viên
  enrollCourse(studentId, courseId) {
    const student = this.students.find(student => student.id === studentId);
    if (student && !student.enrolledCourses.includes(courseId)) {
      student.enrolledCourses.push(courseId);
      student.progress[courseId] = {
        completed: 0,
        lastAccess: new Date().toISOString().split('T')[0],
        grades: []
      };
      return true;
    }
    return false;
  }

  // Hủy ghi danh khóa học
  unenrollCourse(studentId, courseId) {
    const student = this.students.find(student => student.id === studentId);
    if (student) {
      student.enrolledCourses = student.enrolledCourses.filter(id => id !== courseId);
      delete student.progress[courseId];
      return true;
    }
    return false;
  }

  // Cập nhật điểm bài học
  updateLessonGrade(studentId, courseId, lessonId, score) {
    const student = this.students.find(student => student.id === studentId);
    if (student && student.progress[courseId]) {
      const gradeIndex = student.progress[courseId].grades.findIndex(
        grade => grade.lessonId === lessonId
      );
      
      const gradeData = {
        lessonId,
        score,
        submittedDate: new Date().toISOString().split('T')[0]
      };

      if (gradeIndex !== -1) {
        student.progress[courseId].grades[gradeIndex] = gradeData;
      } else {
        student.progress[courseId].grades.push(gradeData);
      }
      return true;
    }
    return false;
  }

  // Cập nhật tiến độ khóa học
  updateCourseProgress(studentId, courseId, completedPercentage) {
    const student = this.students.find(student => student.id === studentId);
    if (student && student.progress[courseId]) {
      student.progress[courseId].completed = completedPercentage;
      student.progress[courseId].lastAccess = new Date().toISOString().split('T')[0];
      return true;
    }
    return false;
  }

  // Lấy thống kê tổng quan
  getStatistics() {
    const totalStudents = this.students.length;
    const activeStudents = this.students.filter(s => s.status === 'active').length;
    const pendingStudents = this.students.filter(s => s.status === 'pending').length;
    const inactiveStudents = this.students.filter(s => s.status === 'inactive').length;

    const averageProgress = this.students.reduce((sum, student) => {
      const courseProgresses = Object.values(student.progress).map(p => p.completed);
      const avgStudentProgress = courseProgresses.length 
        ? courseProgresses.reduce((a, b) => a + b, 0) / courseProgresses.length 
        : 0;
      return sum + avgStudentProgress;
    }, 0) / totalStudents;

    return {
      totalStudents,
      activeStudents,
      pendingStudents,
      inactiveStudents,
      averageProgress
    };
  }

  // Tìm kiếm học viên
  searchStudents(query) {
    const searchTerm = query.toLowerCase();
    return this.students.filter(student =>
      student.fullName.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.phone.includes(searchTerm)
    );
  }
}

export default new StudentData(); 