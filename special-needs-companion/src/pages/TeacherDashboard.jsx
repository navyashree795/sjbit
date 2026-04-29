import React, { useState, useEffect } from 'react';
import { generateInsights } from '../ai';

function TeacherDashboard() {
  const [insight, setInsight] = useState('Loading AI insights...');

  // Mock data for student progress
  const mockProgressData = {
    student: "Alex",
    profile: "ADHD",
    completedModules: ["Addition", "Subtraction"],
    strugglingWith: ["Fractions"],
    timeSpentOnFractions: "45 mins",
    attempts: 12
  };

  useEffect(() => {
    const fetchInsight = async () => {
      const result = await generateInsights(mockProgressData);
      setInsight(result);
    };
    fetchInsight();
  }, []);

  return (
    <div>
      <h1>Teacher Analytics Dashboard</h1>
      
      <div className="card">
        <h3>Class Overview</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th>Student Name</th>
              <th>Learning Profile</th>
              <th>Current Topic</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px 0' }}>Alex</td>
              <td>ADHD</td>
              <td>Fractions</td>
              <td style={{ color: '#eab308' }}>Needs Attention</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 0' }}>Sarah</td>
              <td>Dyslexia</td>
              <td>Reading Comp.</td>
              <td style={{ color: '#10b981' }}>On Track</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 0' }}>David</td>
              <td>Autism</td>
              <td>Geometry</td>
              <td style={{ color: '#10b981' }}>On Track</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
        <h3>✨ AI Insight: Alex</h3>
        <p style={{ fontStyle: 'italic', marginTop: '10px' }}>"{insight}"</p>
      </div>
    </div>
  );
}

export default TeacherDashboard;
