import React, { useState, useContext } from 'react';
import { ThemeContext } from '../App';
import { generateAssessment } from '../ai';

function Assessment() {
  const { setLearningProfile } = useContext(ThemeContext);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAssess = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const profile = await generateAssessment(input);
      setResult(profile);
      setLearningProfile(profile);
    } catch (error) {
      console.error(error);
      setResult('Error determining profile');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Learning Style Assessment</h2>
      <p>Hello! Write a few sentences about how you like to learn. Do you like pictures, short games, or clear step-by-step instructions? Do you find reading long texts hard?</p>
      
      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows="5"
        style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        placeholder="Type your answer here..."
      />
      
      <div style={{ marginTop: '15px' }}>
        <button className="btn" onClick={handleAssess} disabled={loading}>
          {loading ? 'Analyzing with AI...' : 'Submit Assessment'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e2e8f0', borderRadius: '8px' }}>
          <h3>AI Assessment Result:</h3>
          <p>Your tailored learning profile is: <strong>{result}</strong></p>
          <p>The app interface has now been automatically adapted to suit your needs!</p>
        </div>
      )}
    </div>
  );
}

export default Assessment;
