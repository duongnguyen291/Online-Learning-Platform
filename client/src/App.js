import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Banner from './components/banner/Banner';
import Feedback from './components/feedback/Feedback';
import Footer from './components/footer/Footer';
import Interactive from './components/interactive/Interactive';
import Live from './components/live/Live';
import Navbar from './components/navbar/Navbar';
import Reason from './components/reason/Reason';
import Login from "./components/login/Login";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
