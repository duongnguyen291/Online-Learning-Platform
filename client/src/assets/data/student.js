// Dữ liệu học viên mẫu
const students = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    avatar: "/src/assets/images/avatar.jpg", // Đường dẫn đến avatar cố định
    phone: "0123456789",
    dateOfBirth: "1995-05-15",
    gender: "Nam",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    studentId: "SV001",
    enrollmentDate: "2024-01-15",
    major: "Công nghệ thông tin",
    currentSemester: 5,
    gpa: 3.75,
    totalCredits: 120,
    completedCredits: 95,
    status: "Đang học",
    bio: "Sinh viên năm 3 chuyên ngành CNTT, đam mê lập trình web và mobile.",
    enrolledCourses: [
      {
        courseId: "CS101",
        courseName: "Lập trình cơ bản",
        progress: 100,
        grade: "A",
        status: "Hoàn thành"
      },
      {
        courseId: "CS201",
        courseName: "Cấu trúc dữ liệu và giải thuật",
        progress: 85,
        grade: null,
        status: "Đang học"
      },
      {
        courseId: "WEB301",
        courseName: "Phát triển ứng dụng Web",
        progress: 60,
        grade: null,
        status: "Đang học"
      }
    ],
    certificates: [
      {
        id: 1,
        name: "Chứng chỉ JavaScript cơ bản",
        issueDate: "2024-03-20",
        score: 95
      },
      {
        id: 2,
        name: "Chứng chỉ HTML/CSS",
        issueDate: "2024-02-15",
        score: 88
      }
    ],
    achievements: [
      "Học bổng xuất sắc học kỳ 1/2024",
      "Top 10 sinh viên có điểm GPA cao nhất khoa",
      "Hoàn thành 3 dự án thực tế"
    ],
    socialLinks: {
      facebook: "https://facebook.com/nguyenvanan",
      linkedin: "https://linkedin.com/in/nguyenvanan",
      github: "https://github.com/nguyenvanan"
    },
    preferences: {
      language: "vi",
      theme: "light",
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    },
    lastLogin: "2024-05-25T10:30:00Z",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-05-25T10:30:00Z"
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "tranthibinh@gmail.com",
    avatar: "/src/assets/images/avatar.jpg", // Cùng avatar cho tất cả user
    phone: "0987654321",
    dateOfBirth: "1998-08-22",
    gender: "Nữ",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    studentId: "SV002",
    enrollmentDate: "2024-02-01",
    major: "Thiết kế đồ họa",
    currentSemester: 3,
    gpa: 3.95,
    totalCredits: 120,
    completedCredits: 65,
    status: "Đang học",
    bio: "Sinh viên thiết kế đồ họa, yêu thích sáng tạo và nghệ thuật số.",
    enrolledCourses: [
      {
        courseId: "DES101",
        courseName: "Cơ bản về thiết kế",
        progress: 100,
        grade: "A+",
        status: "Hoàn thành"
      },
      {
        courseId: "DES201",
        courseName: "Adobe Photoshop nâng cao",
        progress: 90,
        grade: null,
        status: "Đang học"
      },
      {
        courseId: "DES301",
        courseName: "UI/UX Design",
        progress: 45,
        grade: null,
        status: "Đang học"
      }
    ],
    certificates: [
      {
        id: 1,
        name: "Chứng chỉ Adobe Photoshop",
        issueDate: "2024-04-10",
        score: 92
      }
    ],
    achievements: [
      "Giải nhất cuộc thi thiết kế poster",
      "Học bổng khuyến khích học tập",
      "Thực tập tại công ty thiết kế ABC"
    ],
    socialLinks: {
      facebook: "https://facebook.com/tranthibinh",
      instagram: "https://instagram.com/tranthibinh_design",
      behance: "https://behance.net/tranthibinh"
    },
    preferences: {
      language: "vi",
      theme: "dark",
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    },
    lastLogin: "2024-05-24T15:45:00Z",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-05-24T15:45:00Z"
  },
  {
    id: 3,
    name: "Lê Hoàng Minh",
    email: "lehoangminh@gmail.com",
    avatar: "/src/assets/images/avatar.jpg", // Cùng avatar cho tất cả user
    phone: "0369852147",
    dateOfBirth: "1997-12-10",
    gender: "Nam",
    address: "789 Đường DEF, Quận 7, TP.HCM",
    studentId: "SV003",
    enrollmentDate: "2023-09-01",
    major: "Marketing số",
    currentSemester: 7,
    gpa: 3.45,
    totalCredits: 120,
    completedCredits: 105,
    status: "Đang học",
    bio: "Sinh viên Marketing số với kinh nghiệm thực tế về quảng cáo online.",
    enrolledCourses: [
      {
        courseId: "MKT101",
        courseName: "Nguyên lý Marketing",
        progress: 100,
        grade: "B+",
        status: "Hoàn thành"
      },
      {
        courseId: "MKT301",
        courseName: "Digital Marketing nâng cao",
        progress: 75,
        grade: null,
        status: "Đang học"
      },
      {
        courseId: "MKT401",
        courseName: "Social Media Marketing",
        progress: 80,
        grade: null,
        status: "Đang học"
      }
    ],
    certificates: [
      {
        id: 1,
        name: "Google Ads certified",
        issueDate: "2024-01-20",
        score: 87
      },
      {
        id: 2,
        name: "Facebook Blueprint Certificate",
        issueDate: "2024-03-15",
        score: 91
      }
    ],
    achievements: [
      "Thực tập tại công ty Marketing XYZ",
      "Tối ưu hóa chi phí quảng cáo 30% cho dự án thực tế",
      "Hoàn thành khóa học Google Analytics"
    ],
    socialLinks: {
      facebook: "https://facebook.com/lehoangminh",
      linkedin: "https://linkedin.com/in/lehoangminh",
      twitter: "https://twitter.com/lehoangminh"
    },
    preferences: {
      language: "vi",
      theme: "light",
      notifications: {
        email: true,
        sms: false,
        push: false
      }
    },
    lastLogin: "2024-05-23T14:20:00Z",
    createdAt: "2023-09-01T08:30:00Z",
    updatedAt: "2024-05-23T14:20:00Z"
  }
];

// Hàm utility để lấy thông tin học viên
export const getStudentById = (id) => {
  return students.find(student => student.id === id);
};

export const getStudentByEmail = (email) => {
  return students.find(student => student.email === email);
};

export const getAllStudents = () => {
  return students;
};

// Hàm để lấy học viên hiện tại (có thể dựa trên token hoặc session)
export const getCurrentStudent = () => {
  // Trong thực tế, bạn sẽ lấy từ localStorage, sessionStorage hoặc từ API
  // Ở đây tôi return student đầu tiên làm demo
  return students[0];
};

// Hàm cập nhật thông tin học viên
export const updateStudent = (id, updatedData) => {
  const studentIndex = students.findIndex(student => student.id === id);
  if (studentIndex !== -1) {
    students[studentIndex] = {
      ...students[studentIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    return students[studentIndex];
  }
  return null;
};

// Hàm lấy tiến độ học tập tổng quan
export const getStudentProgress = (id) => {
  const student = getStudentById(id);
  if (!student) return null;

  const totalCourses = student.enrolledCourses.length;
  const completedCourses = student.enrolledCourses.filter(course => course.status === "Hoàn thành").length;
  const averageProgress = student.enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / totalCourses;

  return {
    totalCourses,
    completedCourses,
    inProgressCourses: totalCourses - completedCourses,
    averageProgress: Math.round(averageProgress),
    completionRate: Math.round((completedCourses / totalCourses) * 100),
    gpa: student.gpa,
    totalCredits: student.totalCredits,
    completedCredits: student.completedCredits,
    remainingCredits: student.totalCredits - student.completedCredits
  };
};

// Export default
export default students;