import React from 'react';
import Footer from '../components/landing page/footer/Footer';
import Navbar2 from '../components/landing page/navbar/Navbar2';
import InnerCourse from '../components/course/courseInner';

function InnerCoursePage() {
  return (
    <>
      <Navbar2 />
      <InnerCourse/>
      <Footer />
    </>
  );
}

export default InnerCoursePage;