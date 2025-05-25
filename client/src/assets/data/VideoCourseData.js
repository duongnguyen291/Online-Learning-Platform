// videoCourse.js - Data structure for courses
export const courseData = {
  courseId: "course-001",
  title: "Complete Website Responsive Design: From Figma to Webflow to Website Design",
  instructor: {
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    rating: 4.8,
    students: 15420
  },
  lastUpdated: "Oct 06, 2020",
  totalLectures: 202,
  totalDuration: "29h 37m",
  completionRate: 16,
  chapters: [
    {
      chapterId: "chapter-001",
      title: "Getting Started",
      lectures: 4,
      duration: "1h 5m",
      completed: 25,
      lessons: [
        {
          lessonId: "lesson-001",
          title: "What is Webflow?",
          duration: "07:31",
          completed: true,
          videoUrl: "https://www.youtube.com/embed/9k_D6ytl1v0"
        },
        {
          lessonId: "lesson-002", 
          title: "Sign up in Webflow",
          duration: "07:31",
          completed: false,
          isActive: true,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          lessonId: "lesson-003",
          title: "Taste of Webflow", 
          duration: "02:31",
          completed: false,
          videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4"
        },
        {
          lessonId: "lesson-004",
          title: "Figma Introduction",
          duration: "07:31", 
          completed: false,
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
        }
      ]
    },
    {
      chapterId: "chapter-002",
      title: "Secret of Good Design",
      lectures: 52,
      duration: "5h 40m",
      completed: 0,
      lessons: [
        {
          lessonId: "lesson-005",
          title: "Design Principles",
          duration: "12:45",
          completed: false,
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        },
        {
          lessonId: "lesson-006",
          title: "Color Theory",
          duration: "08:30",
          completed: false,
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
        }
      ]
    },
    {
      chapterId: "chapter-003", 
      title: "Practice Design Like an Artist",
      lectures: 43,
      duration: "6h 51m",
      completed: 0,
      lessons: [
        {
          lessonId: "lesson-007",
          title: "Typography Basics",
          duration: "15:20",
          completed: false,
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        },
        {
          lessonId: "lesson-008",
          title: "Layout Composition",
          duration: "18:45", 
          completed: false,
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
        }
      ]
    }
  ],
  currentLesson: {
    chapterId: "chapter-001",
    lessonId: "lesson-002",
    title: "Sign up in Webflow",
    description: "We cover everything you need to build your first website. From creating your first page through to launching your website to the internet. We'll visit the world's most popular (and free) web design tool called Visual Studio Code. There are exercises files you can download and then work along with me. At the end of each video I have a downloadable version of where we are in the process so that you can compare your project with mine. This will enable you to see early where you might have a problem. We will show you at the specific point in the process where you need to know the project to be working correctly.\n\nIf that all sounds a little too fancy - don't worry, this course is aimed at people new to web design and who have never coded before. We'll start right at the beginning and work our way through step by step.",
    videoUrl: "https://www.youtube.com/embed/9k_D6ytl1v0",
    duration: "07:31"
  }
};