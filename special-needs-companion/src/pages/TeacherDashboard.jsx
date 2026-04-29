import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { generateInsights } from '../ai';

function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [insight, setInsight] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch students from Firestore
  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentData);
      
      // Select first student by default if none selected
      if (studentData.length > 0 && !selectedStudent) {
        setSelectedStudent(studentData[0]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching students:", error);
      // Fallback to mock data if collection doesn't exist yet
      const mockData = [
        { id: '1', name: 'Alex', profile: 'ADHD', topic: 'Fractions', status: 'Needs Attention', progress: 45 },
        { id: '2', name: 'Sarah', profile: 'Dyslexia', topic: 'Reading Comp.', status: 'On Track', progress: 82 },
        { id: '3', name: 'David', profile: 'Autism', topic: 'Geometry', status: 'On Track', progress: 75 }
      ];
      setStudents(mockData);
      if (!selectedStudent) setSelectedStudent(mockData[0]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedStudent]);

  // Generate AI insights when selected student changes
  useEffect(() => {
    if (selectedStudent) {
      const fetchInsight = async () => {
        setIsGenerating(true);
        setInsight('Analyzing performance patterns...');
        const result = await generateInsights(selectedStudent);
        setInsight(result);
        setIsGenerating(false);
      };
      fetchInsight();
    }
  }, [selectedStudent?.id]);

  const getStatusClass = (status) => {
    if (status === 'Needs Attention') return 'status-needs-attention';
    if (status === 'Excelling') return 'status-excelling';
    return 'status-on-track';
  };

  const handleParentSync = (studentName) => {
    alert(`Syncing ${studentName}'s progress report to Parent Digest...`);
  };

  if (loading) return <div className="analyzing-card"><span className="analyzing-spinner">📚</span><p>Loading Dashboard...</p></div>;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(90deg, #3b82f6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Educator Analytics
        </h1>
        <p style={{ color: '#64748b' }}>Real-time monitoring and AI diagnostics for your classroom.</p>
      </header>

      <div className="dashboard-grid">
        {/* Left Column: Student List */}
        <section className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontWeight: '700' }}>Class Overview ({students.length} Students)</h3>
          </div>
          
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Profile</th>
                  <th>Current Topic</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr 
                    key={student.id} 
                    className={`student-row ${selectedStudent?.id === student.id ? 'active' : ''}`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td style={{ fontWeight: '600' }}>{student.name}</td>
                    <td><span className={`condition-tag ${student.profile.toLowerCase()}-tag`}>{student.profile}</span></td>
                    <td>{student.topic || 'General'}</td>
                    <td>
                      <span className={`status-chip ${getStatusClass(student.status)}`}>
                        {student.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: AI Insights & Details */}
        <aside>
          {selectedStudent && (
            <div className="card insight-card" style={{ animation: 'slideInRight 0.4s ease-out' }}>
              <div className="insight-header">
                <span style={{ fontSize: '1.5rem' }}>✨</span>
                <h3 style={{ fontWeight: '700' }}>AI Insight: {selectedStudent.name}</h3>
              </div>
              
              <div className="insight-content">
                {isGenerating ? (
                  <div className="loading-dots"><span></span><span></span><span></span></div>
                ) : (
                  <p>"{insight}"</p>
                )}
              </div>

              <div className="stat-group">
                <div className="stat-item">
                  <span className="stat-value">{selectedStudent.progress || 0}%</span>
                  <span className="stat-label">Progress</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{selectedStudent.timeSpent || '12m'}</span>
                  <span className="stat-label">Time Today</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <button 
                  className="btn" 
                  onClick={() => handleParentSync(selectedStudent.name)}
                >
                  🚀 Sync with Parent Digest
                </button>
                <button className="btn btn-ghost" onClick={() => alert('Opening full analytics...')}>
                  View History
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default TeacherDashboard;
