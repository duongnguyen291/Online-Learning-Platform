import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenuPage from './pages/MainMenuPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenuPage />} />
      </Routes>
    </Router>
  );
}

export default App;