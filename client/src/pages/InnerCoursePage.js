import React from 'react';
import Footer from '../components/landing page/footer/Footer';
import Navbar from '../components/landing page/navbar/Navbar';
import InnerCourse from '../components/course/courseInner';

const InnerCoursePage = () => {
  return (
    <div>
      <Navbar />
      <InnerCourse/>
      <Footer />
    </div>
  );
};

export default InnerCoursePage;