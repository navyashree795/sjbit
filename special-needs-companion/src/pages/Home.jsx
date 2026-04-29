import React, { useContext } from 'react';
import { ThemeContext } from '../App';

function Home() {
  const { learningProfile } = useContext(ThemeContext);

  const renderContent = () => {
    switch (learningProfile) {
      case 'Dyslexia':
        return (
          <div className="card">
            <h2>Welcome to Your Learning Space!</h2>
            <p>We've adjusted the fonts and colors to make reading easier for you.</p>
            <p>Today we are learning about the Solar System.</p>
            <button className="btn">Listen to Text</button>
          </div>
        );
      case 'ADHD':
        return (
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>🚀 Level 1: Space Mission! 🚀</h2>
            <p>Your mission today is to discover 3 planets!</p>
            <button className="btn" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>Start Mission!</button>
            <div style={{ marginTop: '20px' }}>
              <span style={{ fontSize: '2rem' }}>⭐ 0/3</span>
            </div>
          </div>
        );
      case 'Autism':
        return (
          <div className="card">
            <h2>Schedule for Today</h2>
            <ol style={{ paddingLeft: '20px', lineHeight: '2' }}>
              <li>1. Read about the sun.</li>
              <li>2. Answer two questions.</li>
              <li>3. Take a 5-minute break.</li>
            </ol>
            <button className="btn">Begin Task 1</button>
          </div>
        );
      default:
        return (
          <div className="card">
            <h2>Welcome Student!</h2>
            <p>Please take the assessment to personalize your learning experience.</p>
          </div>
        );
    }
  };

  return (
    <div>
      <h1>Student Portal</h1>
      <p>Current Profile: <strong>{learningProfile}</strong></p>
      {renderContent()}
    </div>
  );
}

export default Home;
