import React, { useContext, useState } from 'react';
import { ThemeContext } from '../App';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── Gemini setup ─────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY');

// ── Questionnaire ─────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    question: 'When you read a book or a story, what happens?',
    options: [
      'The letters sometimes look jumbled or move around',
      'I lose focus quickly and jump around the page',
      'I prefer reading the same book over and over',
      'Reading feels mostly fine for me',
    ],
  },
  {
    id: 2,
    question: 'How do you feel in a busy, noisy classroom?',
    options: [
      'It is hard to follow what is written on the board',
      'I feel very restless and want to move around a lot',
      'Too many sounds bother me and I feel overwhelmed',
      'It does not bother me much',
    ],
  },
  {
    id: 3,
    question: 'How do you usually finish your homework or tasks?',
    options: [
      'I struggle because writing or spelling takes a long time',
      'I start many tasks but have trouble finishing them',
      'I do best when I follow the exact same routine every day',
      'I finish tasks without many problems',
    ],
  },
  {
    id: 4,
    question: 'How do you feel about making new friends or social situations?',
    options: [
      'Social things are okay, but reading menus or signs is hard',
      'I talk a lot and sometimes interrupt without meaning to',
      'I find social situations confusing and prefer to be alone or with very few people',
      'I am generally comfortable in social situations',
    ],
  },
  {
    id: 5,
    question: 'What best describes your attention or focus?',
    options: [
      'I can focus, but reading or writing takes extra effort',
      'My mind wanders a lot and I often daydream or fidget',
      'I can focus very deeply on topics I love, but struggle to switch tasks',
      'My focus is pretty consistent throughout the day',
    ],
  },
];

// ── Learning profile content ──────────────────────────────────────────────────
function ProfileContent({ profile }) {
  switch (profile) {
    case 'Dyslexia':
      return (
        <div className="card profile-result">
          <div className="profile-badge dyslexia-badge">📖 Dyslexia Profile Detected</div>
          <h2>Welcome to Your Learning Space!</h2>
          <p>We've adjusted the fonts and colors to make reading easier for you.</p>
          <p>Today we are learning about the Solar System.</p>
          <button className="btn">🔊 Listen to Text</button>
        </div>
      );
    case 'ADHD':
      return (
        <div className="card profile-result" style={{ textAlign: 'center' }}>
          <div className="profile-badge adhd-badge">⚡ ADHD Profile Detected</div>
          <h2>🚀 Level 1: Space Mission! 🚀</h2>
          <p>Your mission today is to discover 3 planets!</p>
          <button className="btn" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>🎯 Start Mission!</button>
          <div style={{ marginTop: '20px' }}>
            <span style={{ fontSize: '2rem' }}>⭐ 0/3</span>
          </div>
        </div>
      );
    case 'Autism':
      return (
        <div className="card profile-result">
          <div className="profile-badge autism-badge">🗓️ Autism Profile Detected</div>
          <h2>Schedule for Today</h2>
          <ol style={{ paddingLeft: '20px', lineHeight: '2' }}>
            <li>1. Read about the sun.</li>
            <li>2. Answer two questions.</li>
            <li>3. Take a 5-minute break.</li>
          </ol>
          <button className="btn">✅ Begin Task 1</button>
        </div>
      );
    default:
      return (
        <div className="card profile-result">
          <div className="profile-badge standard-badge">🌟 Standard Profile</div>
          <h2>Welcome Student!</h2>
          <p>No specific learning challenge detected. Enjoy your standard learning experience!</p>
          <button className="btn">📚 Start Learning</button>
        </div>
      );
  }
}

// ── Main Component ────────────────────────────────────────────────────────────
function Home() {
  const { learningProfile, setLearningProfile } = useContext(ThemeContext);

  const [phase, setPhase] = useState('intro');       // intro | quiz | analyzing | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState('');

  const startQuiz = () => {
    setAnswers([]);
    setCurrentQ(0);
    setSelectedOption(null);
    setPhase('quiz');
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, { question: QUESTIONS[currentQ].question, answer: selectedOption }];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // All questions answered — call Gemini
      setPhase('analyzing');
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const answersText = newAnswers
          .map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}`)
          .join('\n\n');

        const prompt = `You are a specialist in learning disabilities and special educational needs.
A student answered the following screening questionnaire. Based ONLY on their answers, determine which ONE condition they are most likely experiencing.

Choose EXACTLY one from: Dyslexia, ADHD, Autism, Standard

Rules:
- Dyslexia: primary struggles with reading, writing, spelling, letter confusion
- ADHD: primary struggles with focus, restlessness, impulsivity, task completion
- Autism: primary struggles with social situations, routines, sensory overload, repetitive behaviors
- Standard: no significant patterns detected

Student Answers:
${answersText}

Respond with ONLY the one word: Dyslexia, ADHD, Autism, or Standard.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        let detected = 'Standard';
        if (text.toLowerCase().includes('dyslexia')) detected = 'Dyslexia';
        else if (text.toLowerCase().includes('adhd')) detected = 'ADHD';
        else if (text.toLowerCase().includes('autism')) detected = 'Autism';

        setLearningProfile(detected);
        setPhase('result');
      } catch (err) {
        console.error('AI Error:', err);
        setError('Could not connect to AI. Please check your API key.');
        setPhase('result');
        setLearningProfile('Standard');
      }
    }
  };

  const resetQuiz = () => {
    setPhase('intro');
    setAnswers([]);
    setCurrentQ(0);
    setSelectedOption(null);
    setError('');
    setLearningProfile('Standard');
  };

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div className="home-container">
        <div className="card intro-card">
          <div className="intro-icon">🧠</div>
          <h1>Learning Profile Assessment</h1>
          <p className="intro-desc">
            Hi! I'm your AI companion. I'll ask you <strong>5 short questions</strong> to understand
            how you learn best. There are no right or wrong answers — just be honest!
          </p>
          <div className="condition-previews">
            <span className="condition-tag dyslexia-tag">📖 Dyslexia</span>
            <span className="condition-tag adhd-tag">⚡ ADHD</span>
            <span className="condition-tag autism-tag">🗓️ Autism</span>
          </div>
          {learningProfile !== 'Standard' && (
            <p className="existing-profile">
              Your current profile: <strong>{learningProfile}</strong>. Retake to update it.
            </p>
          )}
          <button className="btn btn-large" onClick={startQuiz}>
            🚀 Start Assessment
          </button>
          {learningProfile !== 'Standard' && (
            <button className="btn btn-secondary" onClick={() => setPhase('result')} style={{ marginTop: '10px' }}>
              View My Profile
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── QUIZ ──
  if (phase === 'quiz') {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ) / QUESTIONS.length) * 100;

    return (
      <div className="home-container">
        <div className="card quiz-card">
          <div className="quiz-header">
            <span className="quiz-counter">Question {currentQ + 1} of {QUESTIONS.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="ai-bubble">
            <span className="ai-avatar">🤖</span>
            <p className="question-text">{q.question}</p>
          </div>

          <div className="options-list">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`option-btn ${selectedOption === opt ? 'option-selected' : ''}`}
                onClick={() => handleOptionSelect(opt)}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>

          <div className="quiz-footer">
            <button className="btn btn-ghost" onClick={resetQuiz}>Cancel</button>
            <button
              className="btn"
              onClick={handleNext}
              disabled={selectedOption === null}
            >
              {currentQ < QUESTIONS.length - 1 ? 'Next →' : '🔍 Analyze My Profile'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ANALYZING ──
  if (phase === 'analyzing') {
    return (
      <div className="home-container">
        <div className="card analyzing-card">
          <div className="analyzing-spinner">🧠</div>
          <h2>Analyzing your responses...</h2>
          <p>Our AI is reviewing your answers to find the best learning profile for you.</p>
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  return (
    <div className="home-container">
      {error && <div className="error-banner">⚠️ {error}</div>}
      <ProfileContent profile={learningProfile} />
      <button className="btn btn-secondary retake-btn" onClick={resetQuiz}>
        🔄 Retake Assessment
      </button>
    </div>
  );
}

export default Home;
