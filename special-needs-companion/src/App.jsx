import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDigest from './pages/ParentDigest';
import './index.css';

export const ThemeContext = createContext();

function App() {
  const [learningProfile, setLearningProfile] = useState('Standard'); // Dyslexia, ADHD, Autism, Standard

  useEffect(() => {
    // Apply theme to document body
    document.documentElement.setAttribute('data-theme', learningProfile);
  }, [learningProfile]);

  return (
    <ThemeContext.Provider value={{ learningProfile, setLearningProfile }}>
      <Router>
        <nav className="nav">
          <Link to="/">Home (Student)</Link>
          <Link to="/assessment">Assessment</Link>
          <Link to="/teacher">Teacher Dashboard</Link>
          <Link to="/parent">Parent Digest</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/parent" element={<ParentDigest />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
