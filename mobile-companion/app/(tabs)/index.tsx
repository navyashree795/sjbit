import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  StyleSheet, Text, View, TouchableOpacity,
  ScrollView, ActivityIndicator, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── Gemini ─────────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI('AIzaSyBLS15IzfiNW5m_Ua4JadV_8C9mLaOxuHI');

// ── Questions ──────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    question: 'When you read a book or story, what happens?',
    options: [
      '📖  Letters sometimes look jumbled or move around',
      '💭  I lose focus quickly and jump around the page',
      '🔁  I prefer reading the same book over and over',
      '✅  Reading feels mostly fine for me',
    ],
  },
  {
    id: 2,
    question: 'How do you feel in a busy, noisy classroom?',
    options: [
      '👁️  Hard to follow what is written on the board',
      '🏃  I feel very restless and want to move around',
      '😩  Too many sounds bother me and overwhelm me',
      '😊  It does not bother me much',
    ],
  },
  {
    id: 3,
    question: 'How do you usually finish your homework or tasks?',
    options: [
      '✏️  Writing or spelling takes a very long time',
      '🔀  I start many tasks but have trouble finishing',
      '📅  I do best following the exact same routine daily',
      '👍  I finish tasks without many problems',
    ],
  },
  {
    id: 4,
    question: 'How do you feel about making friends or social situations?',
    options: [
      '💬  Social is okay, but reading menus/signs is hard',
      '📢  I talk a lot and sometimes interrupt unintentionally',
      '🙈  Social situations confuse me; I prefer being alone',
      '🤝  I am generally comfortable in social situations',
    ],
  },
  {
    id: 5,
    question: 'What best describes your attention or focus?',
    options: [
      '📝  I can focus but reading/writing takes extra effort',
      '🌀  My mind wanders a lot and I often fidget',
      '🔭  I focus deeply on loved topics but struggle to switch',
      '⚡  My focus is pretty consistent throughout the day',
    ],
  },
];

// ── Profile result cards ────────────────────────────────────────────────────
function ProfileCard({ profile, onRetake }: { profile: string; onRetake: () => void }) {
  const configs: Record<string, { emoji: string; label: string; color: string; bg: string; desc: string; tip: string }> = {
    Dyslexia: {
      emoji: '📖', label: 'Dyslexia', color: '#92400e', bg: '#fef3c7',
      desc: "You may find reading and writing challenging, but you're a creative thinker!",
      tip: 'Try using larger fonts, listening to audio books, and taking extra time for reading tasks.',
    },
    ADHD: {
      emoji: '⚡', label: 'ADHD', color: '#065f46', bg: '#d1fae5',
      desc: "You have a lot of energy and ideas — that's a superpower!",
      tip: 'Break tasks into small steps, use timers, and take short breaks to stay focused.',
    },
    Autism: {
      emoji: '🗓️', label: 'Autism', color: '#4c1d95', bg: '#ede9fe',
      desc: 'You notice details others miss and thrive with clear structure.',
      tip: 'Use visual schedules, prepare for transitions, and find a quiet study space.',
    },
    Standard: {
      emoji: '🌟', label: 'Standard Profile', color: '#166534', bg: '#f0fdf4',
      desc: 'No specific learning challenge detected. Keep up the great work!',
      tip: 'Continue with regular study habits. Explore what learning styles work best for you.',
    },
  };

  const c = configs[profile] || configs.Standard;

  return (
    <View style={styles.profileCard}>
      <View style={[styles.profileBadge, { backgroundColor: c.bg }]}>
        <Text style={styles.profileEmoji}>{c.emoji}</Text>
        <Text style={[styles.profileLabel, { color: c.color }]}>{c.label} Detected</Text>
      </View>

      <Text style={styles.profileDesc}>{c.desc}</Text>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Learning Tip</Text>
        <Text style={styles.tipText}>{c.tip}</Text>
      </View>

      <TouchableOpacity 
        style={styles.actionBtn} 
        onPress={() => {
          if (profile === 'Dyslexia') router.push('/assessments/dyslexia');
          else if (profile === 'ADHD') router.push('/assessments/adhd');
          else if (profile === 'Autism') router.push('/assessments/autism');
          else Alert.alert("Coming Soon!", "We are still building the standard modules.");
        }}
      >
        <Text style={styles.actionBtnText}>🚀 Start Personalized Learning</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.retakeBtn} onPress={onRetake}>
        <Text style={styles.retakeBtnText}>🔄 Retake Assessment</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function StudentScreen() {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [profile, setProfile] = useState<string>('Standard');

  const reset = () => {
    setPhase('intro');
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setProfile('Standard');
  };

  const handleNext = async () => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // All done — call Gemini
      setPhase('analyzing');
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const answersText = QUESTIONS.map((q, i) =>
          `Q${i + 1}: ${q.question}\nAnswer: ${newAnswers[i]}`
        ).join('\n\n');

        const prompt = `You are a specialist in learning disabilities. A student answered this screening questionnaire.
Based ONLY on their answers, determine which ONE condition they are most likely experiencing.
Choose EXACTLY one from: Dyslexia, ADHD, Autism, Standard

Rules:
- Dyslexia: primary struggles with reading, writing, spelling, letter confusion
- ADHD: primary struggles with focus, restlessness, impulsivity, task completion
- Autism: primary struggles with social situations, routines, sensory overload
- Standard: no significant patterns

Student Answers:
${answersText}

Respond with ONLY one word: Dyslexia, ADHD, Autism, or Standard.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().toLowerCase();

        let detected = 'Standard';
        if (text.includes('dyslexia')) detected = 'Dyslexia';
        else if (text.includes('adhd')) detected = 'ADHD';
        else if (text.includes('autism')) detected = 'Autism';

        setProfile(detected);
      } catch (e) {
        console.error(e);
        setProfile('Standard');
      }
      setPhase('result');
    }
  };

  const progress = (currentQ / QUESTIONS.length) * 100;

  // ── INTRO ──────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.introContainer}>
          <Text style={styles.introIcon}>🧠</Text>
          <Text style={styles.introTitle}>Learning Profile{'\n'}Assessment</Text>
          <Text style={styles.introDesc}>
            Hi! I'm your AI companion. I'll ask you{' '}
            <Text style={{ fontWeight: 'bold' }}>5 short questions</Text> to
            understand how you learn best. There are no right or wrong answers!
          </Text>

          <View style={styles.conditionRow}>
            {[
              { label: '📖 Dyslexia', bg: '#fef3c7', color: '#92400e' },
              { label: '⚡ ADHD',     bg: '#d1fae5', color: '#065f46' },
              { label: '🗓️ Autism',   bg: '#ede9fe', color: '#4c1d95' },
            ].map(c => (
              <View key={c.label} style={[styles.conditionTag, { backgroundColor: c.bg }]}>
                <Text style={[styles.conditionTagText, { color: c.color }]}>{c.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={() => setPhase('quiz')}>
            <Text style={styles.startBtnText}>🚀 Start Assessment</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── QUIZ ───────────────────────────────────────────────────────────────
  if (phase === 'quiz') {
    const q = QUESTIONS[currentQ];
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.quizContainer}>
          {/* Header */}
          <View style={styles.quizHeader}>
            <Text style={styles.quizCounter}>
              Question {currentQ + 1} of {QUESTIONS.length}
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          {/* AI bubble */}
          <View style={styles.aiBubble}>
            <Text style={styles.aiAvatar}>🤖</Text>
            <Text style={styles.questionText}>{q.question}</Text>
          </View>

          {/* Options */}
          {q.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.optionBtn, selected === opt && styles.optionSelected]}
              onPress={() => setSelected(opt)}
              activeOpacity={0.7}
            >
              <View style={[styles.optionLetter, selected === opt && styles.optionLetterSelected]}>
                <Text style={[styles.optionLetterText, selected === opt && { color: '#fff' }]}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={[styles.optionText, selected === opt && styles.optionTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Footer buttons */}
          <View style={styles.quizFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={reset}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, !selected && styles.nextBtnDisabled]}
              onPress={handleNext}
              disabled={!selected}
            >
              <Text style={styles.nextBtnText}>
                {currentQ < QUESTIONS.length - 1 ? 'Next →' : '🔍 Analyze'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── ANALYZING ──────────────────────────────────────────────────────────
  if (phase === 'analyzing') {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.analyzingIcon}>🧠</Text>
        <Text style={styles.analyzingTitle}>Analyzing your responses...</Text>
        <Text style={styles.analyzingDesc}>
          Our AI is reviewing your answers to find the best learning profile.
        </Text>
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 24 }} />
      </SafeAreaView>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.resultContainer}>
        <ProfileCard profile={profile} onRetake={reset} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Intro
  introContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  introIcon: { fontSize: 72, marginBottom: 16 },
  introTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  introDesc: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  conditionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 36,
  },
  conditionTag: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    margin: 4,
  },
  conditionTagText: { fontWeight: '700', fontSize: 13 },
  startBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  // Quiz
  quizContainer: { flexGrow: 1, padding: 20, paddingTop: 28 },
  quizHeader: { marginBottom: 20 },
  quizCounter: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 8 },
  progressTrack: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 999,
  },
  aiBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f1f5f9',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  aiAvatar: { fontSize: 28 },
  questionText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 25,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  optionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterSelected: { backgroundColor: '#3b82f6' },
  optionLetterText: { fontWeight: '800', fontSize: 14, color: '#475569' },
  optionText: { flex: 1, fontSize: 15, color: '#334155', lineHeight: 22 },
  optionTextSelected: { color: '#1e40af', fontWeight: '600' },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  cancelBtnText: { color: '#64748b', fontWeight: '600', fontSize: 15 },
  nextBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  nextBtnDisabled: { backgroundColor: '#bfdbfe' },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Analyzing
  analyzingIcon: {
    fontSize: 72,
    marginBottom: 20,
  },
  analyzingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  analyzingDesc: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  // Result
  resultContainer: { flexGrow: 1, padding: 20, paddingTop: 28 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    gap: 10,
  },
  profileEmoji: { fontSize: 30 },
  profileLabel: { fontSize: 20, fontWeight: '800' },
  profileDesc: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 20,
  },
  tipBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  tipTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  tipText: { fontSize: 15, color: '#475569', lineHeight: 22 },
  retakeBtn: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retakeBtnText: { color: '#3b82f6', fontWeight: '700', fontSize: 16 },
  actionBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
