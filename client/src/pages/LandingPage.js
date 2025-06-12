import React from 'react';
import Navbar from '../components/landing page/navbar/Navbar';
import Banner from '../components/landing page/banner/Banner';
import Reason from '../components/landing page/reason/Reason';
import Feedback from '../components/landing page/feedback/Feedback';
import Footer from '../components/landing page/footer/Footer';
import Live from '../components/landing page/live/Live';
import EvenLab from '../components/chatbot/EvenLab';

function LandingPage() {
    return (
        <div className="landing-page">
          <Navbar />
          <Banner />
          <Reason />
          <Live />
          <Feedback />
          <EvenLab />
          <Footer />
          
        </div>
    );
}

export default LandingPage;