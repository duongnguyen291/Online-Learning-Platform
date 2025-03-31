import React from 'react';
import Navbar from '../components/landing page/navbar/Navbar';
import Footer from '../components/landing page/footer/Footer';
import CourseDetail from '../components/course/CourseDetail';

function CourseDetailPage() {
  return (
    <>
      <Navbar />
      <CourseDetail/>
      <Footer />
    </>
  );
}

export default CourseDetailPage;