import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from './components/menu/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to admin panel */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;