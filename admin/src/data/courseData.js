const courses = [
  {
    id: 'course_1',
    title: 'Lập trình Web với React.js',
    description: 'Khóa học toàn diện về React.js, từ cơ bản đến nâng cao. Học cách xây dựng các ứng dụng web hiện đại với React hooks, routing và state management.',
    thumbnail: 'https://example.com/images/react-course.jpg',
    status: 'active',
    duration: '12 tuần',
    price: 2500000,
    maxStudents: 30,
    students: [],
    progress: 0,
    targetAudience: 'Lập trình viên front-end muốn học React.js, sinh viên CNTT, người chuyển ngành',
    prerequisites: 'Kiến thức cơ bản về HTML, CSS, JavaScript. Hiểu biết về ES6+',
    certification: 'Chứng chỉ hoàn thành khóa học được cấp bởi EduSmart',
    learningObjectives: [
      'Hiểu và áp dụng được các khái niệm cơ bản của React',
      'Thành thạo React Hooks và Function Components',
      'Xây dựng được các ứng dụng web hoàn chỉnh với React',
      'Tối ưu hiệu năng ứng dụng React'
    ],
    chapters: [
      {
        id: 'chapter_1',
        title: 'Giới thiệu về React',
        description: 'Tổng quan về React và cách cài đặt môi trường phát triển',
        lessons: [
          {
            id: 'lesson_1',
            title: 'React là gì?',
            description: 'Tìm hiểu về React và lý do nên học React',
            videoUrl: 'https://youtube.com/watch?v=123'
          },
          {
            id: 'lesson_2',
            title: 'Cài đặt môi trường',
            description: 'Hướng dẫn cài đặt Node.js, npm và create-react-app',
            videoUrl: 'https://youtube.com/watch?v=456'
          }
        ]
      },
      {
        id: 'chapter_2',
        title: 'React Components',
        description: 'Học về components và cách sử dụng props, state',
        lessons: [
          {
            id: 'lesson_3',
            title: 'Components là gì?',
            description: 'Giới thiệu về React Components và cách tạo components',
            videoUrl: 'https://youtube.com/watch?v=789'
          },
          {
            id: 'lesson_4',
            title: 'Props và State',
            description: 'Hiểu về props và state trong React',
            videoUrl: 'https://youtube.com/watch?v=012'
          }
        ]
      }
    ]
  },
  {
    id: 'course_2',
    title: 'Node.js Backend Development',
    description: 'Khóa học về phát triển backend với Node.js và Express. Học cách xây dựng REST APIs, xử lý database, và triển khai ứng dụng.',
    thumbnail: 'https://example.com/images/nodejs-course.jpg',
    status: 'planning',
    duration: '10 tuần',
    price: 2000000,
    maxStudents: 25,
    students: [],
    progress: 0,
    targetAudience: 'Lập trình viên muốn học backend development, người đã có kiến thức JavaScript',
    prerequisites: 'JavaScript cơ bản, hiểu biết về HTTP và REST APIs',
    certification: 'Chứng chỉ hoàn thành khóa học được cấp bởi EduSmart',
    learningObjectives: [
      'Xây dựng được REST APIs với Node.js và Express',
      'Làm việc với MongoDB và Mongoose',
      'Xử lý authentication và authorization',
      'Triển khai ứng dụng Node.js lên cloud'
    ],
    chapters: [
      {
        id: 'chapter_1',
        title: 'Giới thiệu Node.js',
        description: 'Tổng quan về Node.js và môi trường phát triển',
        lessons: [
          {
            id: 'lesson_1',
            title: 'Node.js là gì?',
            description: 'Tìm hiểu về Node.js và event-driven programming',
            videoUrl: 'https://youtube.com/watch?v=345'
          },
          {
            id: 'lesson_2',
            title: 'NPM và Package Management',
            description: 'Học về npm và cách quản lý dependencies',
            videoUrl: 'https://youtube.com/watch?v=678'
          }
        ]
      }
    ]
  }
];

const getCourses = () => {
  return courses;
};

const getCourseById = (id) => {
  return courses.find(course => course.id === id);
};

const addCourse = (courseData) => {
  courses.push(courseData);
};

const updateCourse = (id, courseData) => {
  const index = courses.findIndex(course => course.id === id);
  if (index !== -1) {
    courses[index] = { ...courses[index], ...courseData };
  }
};

const deleteCourse = (id) => {
  const index = courses.findIndex(course => course.id === id);
  if (index !== -1) {
    courses.splice(index, 1);
  }
};

export {
  getCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse
}; 