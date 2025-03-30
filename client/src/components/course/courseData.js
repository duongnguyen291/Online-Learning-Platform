// coursesData.js
const coursesData = {
    'Engineering': [
      {
        id: 1,
        title: 'Introduction to Engineering and Design',
        rating: 4.7,
        reviews: 10000,
        originalPrice: 100,
        discountedPrice: 80,
        image: '/images/courses/engineering-design.jpg'
      },
      {
        id: 2,
        title: 'Data Structures and Algorithms',
        rating: 4.8,
        reviews: 15000,
        originalPrice: 120,
        discountedPrice: 90,
        image: '/images/courses/data-structures.jpg'
      },
      {
        id: 3,
        title: 'Machine Learning Basics',
        rating: 4.6,
        reviews: 8500,
        originalPrice: 130,
        discountedPrice: 100,
        image: '/images/courses/machine-learning.jpg'
      },
      {
        id: 4,
        title: 'Web Development Bootcamp',
        rating: 4.5,
        reviews: 20000,
        originalPrice: 140,
        discountedPrice: 95,
        image: '/images/courses/web-development.jpg'
      },
      {
        id: 5,
        title: 'UI/UX Design Principles',
        rating: 4.4,
        reviews: 7200,
        originalPrice: 110,
        discountedPrice: 85,
        image: '/images/courses/ui-ux-design.jpg'
      }
    ],
    'Management': [
      {
        id: 6,
        title: 'Strategic Business Management',
        rating: 4.9,
        reviews: 12500,
        originalPrice: 150,
        discountedPrice: 120,
        image: '/images/courses/business-management.jpg'
      },
      {
        id: 7,
        title: 'Leadership and Team Building',
        rating: 4.7,
        reviews: 9800,
        originalPrice: 130,
        discountedPrice: 100,
        image: '/images/courses/leadership.jpg'
      },
      {
        id: 8,
        title: 'Project Management Professional',
        rating: 4.8,
        reviews: 14200,
        originalPrice: 160,
        discountedPrice: 125,
        image: '/images/courses/project-management.jpg'
      },
      {
        id: 9,
        title: 'Financial Management for Businesses',
        rating: 4.6,
        reviews: 8900,
        originalPrice: 140,
        discountedPrice: 110,
        image: '/images/courses/financial-management.jpg'
      },
      {
        id: 10,
        title: 'Human Resources Management',
        rating: 4.5,
        reviews: 7600,
        originalPrice: 120,
        discountedPrice: 95,
        image: '/images/courses/hr-management.jpg'
      }
    ],
    'Medical & Pharmacy': [
      {
        id: 11,
        title: 'Introduction to Clinical Medicine',
        rating: 4.9,
        reviews: 11000,
        originalPrice: 180,
        discountedPrice: 145,
        image: '/images/courses/clinical-medicine.jpg'
      },
      {
        id: 12,
        title: 'Pharmaceutical Sciences and Drug Development',
        rating: 4.8,
        reviews: 9500,
        originalPrice: 170,
        discountedPrice: 135,
        image: '/images/courses/pharmaceutical-sciences.jpg'
      },
      {
        id: 13,
        title: 'Anatomy and Physiology',
        rating: 4.7,
        reviews: 13500,
        originalPrice: 150,
        discountedPrice: 120,
        image: '/images/courses/anatomy.jpg'
      },
      {
        id: 14,
        title: 'Medical Ethics and Patient Care',
        rating: 4.6,
        reviews: 8200,
        originalPrice: 130,
        discountedPrice: 105,
        image: '/images/courses/medical-ethics.jpg'
      },
      {
        id: 15,
        title: 'Public Health and Epidemiology',
        rating: 4.7,
        reviews: 9800,
        originalPrice: 140,
        discountedPrice: 110,
        image: '/images/courses/public-health.jpg'
      }
    ],
    'Science and Technology': [
      {
        id: 16,
        title: 'Artificial Intelligence and Deep Learning',
        rating: 4.9,
        reviews: 16500,
        originalPrice: 170,
        discountedPrice: 135,
        image: '/images/courses/artificial-intelligence.jpg'
      },
      {
        id: 17,
        title: 'Data Science and Analytics',
        rating: 4.8,
        reviews: 18200,
        originalPrice: 160,
        discountedPrice: 130,
        image: '/images/courses/data-science.jpg'
      },
      {
        id: 18,
        title: 'Cybersecurity Fundamentals',
        rating: 4.7,
        reviews: 12400,
        originalPrice: 150,
        discountedPrice: 120,
        image: '/images/courses/cybersecurity.jpg'
      },
      {
        id: 19,
        title: 'Quantum Computing Basics',
        rating: 4.6,
        reviews: 7800,
        originalPrice: 180,
        discountedPrice: 145,
        image: '/images/courses/quantum-computing.jpg'
      },
      {
        id: 20,
        title: 'Cloud Computing and Services',
        rating: 4.7,
        reviews: 14700,
        originalPrice: 155,
        discountedPrice: 125,
        image: '/images/courses/cloud-computing.jpg'
      }
    ],
    'Arts & Humanities': [
      {
        id: 21,
        title: 'Creative Writing and Storytelling',
        rating: 4.8,
        reviews: 11300,
        originalPrice: 120,
        discountedPrice: 95,
        image: '/images/courses/creative-writing.jpg'
      },
      {
        id: 22,
        title: 'Philosophy and Critical Thinking',
        rating: 4.7,
        reviews: 8900,
        originalPrice: 110,
        discountedPrice: 90,
        image: '/images/courses/philosophy.jpg'
      },
      {
        id: 23,
        title: 'History of Modern Art',
        rating: 4.6,
        reviews: 7500,
        originalPrice: 130,
        discountedPrice: 105,
        image: '/images/courses/modern-art.jpg'
      },
      {
        id: 24,
        title: 'Digital Media and Visual Communication',
        rating: 4.7,
        reviews: 10200,
        originalPrice: 140,
        discountedPrice: 110,
        image: '/images/courses/digital-media.jpg'
      },
      {
        id: 25,
        title: 'Music Theory and Composition',
        rating: 4.5,
        reviews: 6800,
        originalPrice: 125,
        discountedPrice: 100,
        image: '/images/courses/music-theory.jpg'
      }
    ],
    'Law': [
      {
        id: 26,
        title: 'Introduction to Legal Studies',
        rating: 4.8,
        reviews: 9600,
        originalPrice: 160,
        discountedPrice: 130,
        image: '/images/courses/legal-studies.jpg'
      },
      {
        id: 27,
        title: 'Constitutional Law Principles',
        rating: 4.7,
        reviews: 8500,
        originalPrice: 150,
        discountedPrice: 120,
        image: '/images/courses/constitutional-law.jpg'
      },
      {
        id: 28,
        title: 'Criminal Justice and Procedure',
        rating: 4.8,
        reviews: 11200,
        originalPrice: 170,
        discountedPrice: 135,
        image: '/images/courses/criminal-justice.jpg'
      },
      {
        id: 29,
        title: 'Business Law and Corporate Governance',
        rating: 4.6,
        reviews: 9300,
        originalPrice: 155,
        discountedPrice: 125,
        image: '/images/courses/business-law.jpg'
      },
      {
        id: 30,
        title: 'Intellectual Property Law',
        rating: 4.7,
        reviews: 8700,
        originalPrice: 165,
        discountedPrice: 130,
        image: '/images/courses/ip-law.jpg'
      }
    ],
    'Commerce': [
      {
        id: 31,
        title: 'Accounting Principles and Practices',
        rating: 4.7,
        reviews: 13500,
        originalPrice: 140,
        discountedPrice: 110,
        image: '/images/courses/accounting.jpg'
      },
      {
        id: 32,
        title: 'Macroeconomics and Global Markets',
        rating: 4.6,
        reviews: 10800,
        originalPrice: 150,
        discountedPrice: 120,
        image: '/images/courses/macroeconomics.jpg'
      },
      {
        id: 33,
        title: 'Digital Marketing Strategies',
        rating: 4.8,
        reviews: 15600,
        originalPrice: 130,
        discountedPrice: 105,
        image: '/images/courses/digital-marketing.jpg'
      },
      {
        id: 34,
        title: 'Entrepreneurship and Business Innovation',
        rating: 4.9,
        reviews: 12700,
        originalPrice: 160,
        discountedPrice: 130,
        image: '/images/courses/entrepreneurship.jpg'
      },
      {
        id: 35,
        title: 'Supply Chain Management',
        rating: 4.6,
        reviews: 8900,
        originalPrice: 145,
        discountedPrice: 115,
        image: '/images/courses/supply-chain.jpg'
      }
    ]
  };
  
  // Helper function to get all courses as a flat array
  const getAllCourses = () => {
    return Object.values(coursesData).flat();
  };
  
  // Categories array
  const courseCategories = [
    'All Recommendation', 
    'Engineering', 
    'Management', 
    'Medical & Pharmacy', 
    'Science and Technology', 
    'Arts & Humanities', 
    'Law', 
    'Commerce'
  ];
  
  export { coursesData, getAllCourses, courseCategories };