import React from 'react';
import Footer from '../components/landing page/footer/Footer';
import Navbar2 from '../components/landing page/navbar/Navbar2';
import StudentProfile from '../components/profile/studentProfile';

function StudentProfilePage() {
  return (
    <>
      <Navbar2 />
      <StudentProfile />
      <Footer />
    </>
  );
}

export default StudentProfilePage; 