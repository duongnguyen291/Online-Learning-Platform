import React from 'react';
import Footer from '../components/landing page/footer/Footer';
import Navbar from '../components/landing page/navbar/Navbar';
import VideoPlayer from '../components/course/videoCourse';

const VideoCourse = () => {
  return (
    <div>
      <Navbar />
      <VideoPlayer />
      <Footer />
    </div>
  );
};

export default VideoCourse;