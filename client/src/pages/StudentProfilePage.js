import React from 'react';
import Navbar from '../components/landing page/navbar/Navbar';
import StudentProfile from '../components/profile/studentProfile';
import Footer from '../components/landing page/footer/Footer';

const StudentProfilePage = () => {
  return (
    <div>
      <Navbar />
      <StudentProfile />
      <Footer />
    </div>
  );
};

export default StudentProfilePage; 