import React from 'react';

function ParentDigest() {
  return (
    <div>
      <h1>Parent Progress Digest</h1>
      
      <div className="card" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <h2>Daily Update for Alex</h2>
        <p style={{ color: '#166534', marginTop: '10px' }}>
          <strong>Dear Parent,</strong><br/><br/>
          Today was a great day for Alex! He spent 45 minutes on his math missions. 
          He successfully completed 2 modules but found fractions a little tricky. 
          Our AI system noticed this and has adapted his upcoming lessons to include more visual aids to help him grasp the concept better.
          <br/><br/>
          He also earned 3 new stars in his gamified learning environment. Keep encouraging him!
        </p>
        <button className="btn" style={{ marginTop: '20px' }}>Send Words of Encouragement</button>
      </div>
    </div>
  );
}

export default ParentDigest;
