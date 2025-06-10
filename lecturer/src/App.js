import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LecturerPanel from './components/menu/LecturerPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to lecturer panel */}
        <Route path="/" element={<Navigate to="/courses" replace />} />
        
        {/* Lecturer routes */}
        <Route path="/*" element={<LecturerPanel />} />
      </Routes>
    </Router>
  );
}

export default App;