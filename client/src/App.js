import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Banner from './components/landing page/banner/Banner';
import Feedback from './components/landing page/feedback/Feedback';
import Footer from './components/landing page/footer/Footer';
import Interactive from './components/landing page/interactive/Interactive';
import Live from './components/landing page/live/Live';
import Navbar from './components/landing page/navbar/Navbar';
import Reason from './components/landing page/reason/Reason';
import Login from "./components/login/Login";
import Register from './components/register/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ với các component như Banner, Feedback, ... */}
        <Route path="/" element={
          <>
            <Navbar />
            <Banner />
            <Reason />
            <Interactive />
            <Live />
            <Feedback />
            <Footer />
          </>
        } />
        
        {/* Trang login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
