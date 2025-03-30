import React from 'react';
import Navbar from '../components/landing page/navbar/Navbar';
import Banner from '../components/landing page/banner/Banner';
import Reason from '../components/landing page/reason/Reason';
import Interactive from '../components/landing page/interactive/Interactive';
import Feedback from '../components/landing page/feedback/Feedback';
import Footer from '../components/landing page/footer/Footer';
import Live from '../components/landing page/live/Live';

function LandingPage() {
    return (
        <>
          <Navbar />
          <Banner />
          <Reason />
          <Interactive />
          <Live />
          <Feedback />
          <Footer />
        </>
      );
}

export default LandingPage;