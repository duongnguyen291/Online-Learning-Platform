// courseDetailData.js
// Extended course details to supplement the basic course information

const courseDetailData = {
    // Engineering courses
    1: {
      category: 'Engineering',
      sections: 22,
      lectures: 152,
      totalLength: '21h 33m',
      language: 'English',
      description: [
        'This comprehensive introduction to engineering and design principles covers fundamental concepts, methodologies, and practical applications in the field. Learn how engineering solutions are developed from concept to implementation through a structured design process.',
        'The course combines theoretical knowledge with hands-on projects to develop your engineering mindset and problem-solving capabilities. You\'ll explore various engineering disciplines and learn how design thinking applies across multiple contexts.'
      ],
      certification: 'Upon completion, you\'ll receive a verified certificate that demonstrates your understanding of engineering fundamentals and design principles. This certification is recognized by industry professionals and can enhance your credentials in engineering-related fields.',
      whoFor: 'This course is ideal for beginners interested in engineering careers, current students seeking supplementary learning, professionals transitioning to engineering roles, and anyone curious about how engineered products and systems are designed and developed.',
      whatLearn: [
        'Fundamental engineering principles across multiple disciplines',
        'The engineering design process from problem identification to solution implementation',
        'Technical drawing and documentation standards',
        'How to evaluate design alternatives using objective criteria',
        'Practical problem-solving methodologies used by professional engineers',
        'Collaboration techniques for effective teamwork in engineering projects'
      ]
    },
    
    // Add more courses with the same structure
    2: {
      category: 'Engineering',
      sections: 25,
      lectures: 180,
      totalLength: '24h 45m',
      language: 'English',
      description: [
        'Master the essential data structures and algorithms that form the foundation of computer science and efficient programming. This course provides a deep dive into how data is organized, stored, and manipulated in computing systems.',
        'You\'ll learn implementation details, complexity analysis, and practical applications of each concept through programming exercises in multiple languages. This knowledge is crucial for writing optimized code and excelling in technical interviews.'
      ],
      certification: 'Earn a professional certificate in Data Structures and Algorithms that validates your ability to implement efficient solutions to computational problems. This certification is valuable for software engineering roles and demonstrates your technical proficiency.',
      whoFor: 'This course is designed for computer science students, software developers looking to strengthen their fundamental knowledge, coding interview candidates, and anyone interested in improving their problem-solving and algorithm design skills.',
      whatLearn: [
        'Implement and apply common data structures including arrays, linked lists, trees, graphs, and hash tables',
        'Analyze algorithm efficiency using Big O notation',
        'Master searching and sorting algorithms and understand their trade-offs',
        'Apply dynamic programming to solve complex optimization problems',
        'Develop problem-solving strategies for technical interviews',
        'Optimize code for better performance and scalability'
      ]
    },
    
    // Management courses
    6: {
      category: 'Management',
      sections: 18,
      lectures: 142,
      totalLength: '19h 15m',
      language: 'English',
      description: [
        'Develop a comprehensive understanding of strategic business management principles that drive organizational success. This course explores how businesses formulate and implement strategies to achieve competitive advantage in dynamic market environments.',
        'Through case studies of successful companies and practical frameworks, you\'ll learn to analyze business environments, make strategic decisions, and lead implementation efforts that align with organizational goals.'
      ],
      certification: 'Upon successful completion, you\'ll receive a Strategic Business Management certification that demonstrates your ability to think strategically and implement business solutions. This credential is valuable for management roles across industries.',
      whoFor: 'This course is perfect for current and aspiring managers, business owners, entrepreneurs, MBA students, strategy consultants, and professionals looking to advance into leadership positions that require strategic thinking and business acumen.',
      whatLearn: [
        'Analyze internal and external business environments using proven frameworks',
        'Formulate effective business strategies for competitive advantage',
        'Implement strategic initiatives and manage organizational change',
        'Evaluate business performance and make data-driven strategic decisions',
        'Develop strategic thinking as a core leadership competency',
        'Navigate complex business challenges with structured approaches'
      ]
    },
    
    // Medical & Pharmacy courses
    11: {
      category: 'Medical & Pharmacy',
      sections: 30,
      lectures: 210,
      totalLength: '28h 20m',
      language: 'English',
      description: [
        'This foundational course introduces the principles of clinical medicine, covering essential concepts in patient care, diagnostic reasoning, and medical ethics. Learn how medical professionals approach disease diagnosis, treatment planning, and patient management.',
        'Through virtual case studies and expert lectures, you\'ll develop an understanding of the medical decision-making process and the scientific principles that underpin clinical practice in modern healthcare settings.'
      ],
      certification: 'Receive a certification in Clinical Medicine Foundations that validates your understanding of medical principles and clinical reasoning. This is valuable for those pursuing careers in healthcare or adjacent fields.',
      whoFor: 'This course is designed for pre-medical and medical students, healthcare professionals seeking a refresher, allied health practitioners wanting broader medical knowledge, and individuals considering careers in healthcare or medical-adjacent fields.',
      whatLearn: [
        'Understand the fundamentals of human physiology and pathology',
        'Develop clinical reasoning skills for disease diagnosis',
        'Learn the principles of evidence-based medicine and treatment planning',
        'Explore the ethical dimensions of medical decision making',
        'Understand the structure and function of healthcare delivery systems',
        'Apply basic medical concepts to patient case scenarios'
      ]
    }
  };
  
  // Default data template for courses without specific details
  const defaultCourseDetail = {
    sections: 15,
    lectures: 120,
    totalLength: '18h 30m',
    language: 'English',
    description: [
      'This comprehensive course provides in-depth knowledge and practical skills in this subject area. Through expert instruction and hands-on projects, you\'ll develop a strong foundation in core concepts and their real-world applications.',
      'The curriculum is designed to balance theoretical understanding with practical implementation, ensuring you can apply what you learn to solve actual problems in the field.'
    ],
    certification: 'Upon successful completion, you\'ll receive a verified certificate that demonstrates your proficiency in this subject. This certification can enhance your professional credentials and validate your expertise to employers and peers.',
    whoFor: 'This course is ideal for beginners and intermediate learners interested in developing their skills in this field. It\'s suitable for students, working professionals looking to upskill, career changers, and enthusiasts wanting to deepen their knowledge in this subject area.',
    whatLearn: [
      'Master fundamental concepts and principles in this subject area',
      'Develop practical skills through hands-on projects and exercises',
      'Learn best practices and industry-standard methodologies',
      'Apply theoretical knowledge to solve real-world problems',
      'Build a portfolio of work demonstrating your new capabilities',
      'Gain confidence in your ability to work professionally in this field'
    ]
  };
  
  // Function to get course details with fallback to default template
  const getCourseDetail = (courseId) => {
    // Convert to number if it's a string
    const id = typeof courseId === 'string' ? parseInt(courseId) : courseId;
    
    // Return specific course data if available, otherwise use default template
    return courseDetailData[id] || {
      ...defaultCourseDetail,
      // Try to get category from associated course in coursesData if needed
    };
  };
  
  export { getCourseDetail, courseDetailData, defaultCourseDetail };