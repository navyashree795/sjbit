import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  Animated, Dimensions, Switch, Platform, Alert, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

// ── Types & Data ──────────────────────────────────────────────────────────

type AppMode = 'reader' | 'quiz';
type Overlay = 'none' | 'cream' | 'skyblue' | 'rose' | 'mint';

const STORY_TEXT = "The little blue bird flew high above the green forest. It saw a tiny butterfly landing on a bright red flower. The sun was shining and the day was beautiful.";

const QUIZ_QUESTIONS = [
  {
    question: "What color was the bird?",
    options: [
      { text: "Blue", image: "🐦" },
      { text: "Red", image: "🦜" },
      { text: "Green", image: "🦖" }
    ],
    correct: "Blue"
  },
  {
    question: "Where did the bird fly?",
    options: [
      { text: "Forest", image: "🌲" },
      { text: "Ocean", image: "🌊" },
      { text: "Moon", image: "🌙" }
    ],
    correct: "Forest"
  }
];

// ── Helpers ────────────────────────────────────────────────────────────────

const addSyllableDots = (word: string) => {
  const map: Record<string, string> = {
    "little": "lit·tle",
    "forest": "for·est",
    "butterfly": "but·ter·fly",
    "beautiful": "beau·ti·ful",
    "shining": "shin·ing",
    "above": "a·bove"
  };
  return map[word.toLowerCase()] || word;
};

// ── Components ─────────────────────────────────────────────────────────────

export default function DyslexiaScreen() {
  const [mode, setMode] = useState<AppMode>('reader');
  const [showSettings, setShowSettings] = useState(false);

  // Settings
  const [fontSize, setFontSize] = useState(24);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [overlay, setOverlay] = useState<Overlay>('none');
  const [showSyllables, setShowSyllables] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  // Reader State
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isReading, setIsReading] = useState(false);
  const words = STORY_TEXT.split(" ");
  const readingRef = useRef(false);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const speak = (text: string, rate: number = 1.0) => {
    Speech.speak(text, { rate, pitch: 1.0 });
  };

  const stopSpeech = () => {
    Speech.stop();
    readingRef.current = false;
    setIsReading(false);
    setCurrentWordIndex(-1);
  };

  const handleReadAloud = async (slow: boolean = false) => {
    if (readingRef.current) {
      stopSpeech();
      return;
    }
    readingRef.current = true;
    setIsReading(true);
    
    for (let i = 0; i < words.length; i++) {
      if (!readingRef.current) break;
      setCurrentWordIndex(i);
      await new Promise((resolve) => {
        Speech.speak(words[i], {
          rate: slow ? 0.5 : 0.8,
          onDone: () => resolve(true),
          onError: () => resolve(false)
        });
        setTimeout(() => resolve(true), slow ? 1200 : 800);
      });
    }
    readingRef.current = false;
    setIsReading(false);
    setCurrentWordIndex(-1);
  };

  const getOverlayColor = () => {
    switch (overlay) {
      case 'cream': return 'rgba(255, 253, 208, 0.3)';
      case 'skyblue': return 'rgba(135, 206, 235, 0.3)';
      case 'rose': return 'rgba(255, 182, 193, 0.3)';
      case 'mint': return 'rgba(152, 251, 152, 0.3)';
      default: return 'transparent';
    }
  };

  const renderReader = () => (
    <View style={styles.content}>
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={() => handleReadAloud(false)}>
          <Ionicons name={isReading ? "stop-circle" : "play-circle"} size={32} color="#3b82f6" />
          <Text style={styles.ctrlText}>{isReading ? "Stop" : "Read Aloud"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn} onPress={() => handleReadAloud(true)}>
          <Ionicons name="walk-outline" size={32} color="#f59e0b" />
          <Text style={styles.ctrlText}>Slow Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.textContainer}>
        {/* Story Illustration */}
        <View style={styles.imageWrapper}>
          <Text style={styles.imageFallback}>🐦</Text>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1444464666168-49d633b86747?w=400' }} 
            style={[StyleSheet.absoluteFill, styles.storyImage]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.wordFlow}>
          {words.map((word, idx) => (
            <TouchableOpacity key={idx} onPress={() => speak(word)} style={[styles.wordBtn, currentWordIndex === idx && styles.wordHighlight]}>
              <Text style={[styles.storyText, { fontSize, letterSpacing, lineHeight: fontSize * lineHeight, color: highContrast ? '#000' : '#334155', fontWeight: highContrast ? 'bold' : 'normal' }]}>
                {showSyllables ? addSyllableDots(word) : word}{" "}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderQuiz = () => {
    if (quizFinished) {
      return (
        <View style={styles.resultView}>
          <Text style={styles.praiseEmoji}>🌟</Text>
          <Text style={styles.praiseTitle}>Brilliant!</Text>
          <Text style={styles.praiseSub}>You finished the quiz!</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={() => {setQuizIndex(0); setQuizFinished(false);}}>
            <Text style={styles.actionBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    const q = QUIZ_QUESTIONS[quizIndex];
    return (
      <View style={styles.quizView}>
        <TouchableOpacity onPress={() => speak(q.question)} style={styles.quizHeader}>
          <Ionicons name="volume-high" size={24} color="#3b82f6" />
          <Text style={styles.quizQuestion}>{q.question}</Text>
        </TouchableOpacity>
        <View style={styles.optionsGrid}>
          {q.options.map((opt, i) => (
            <TouchableOpacity key={i} style={styles.optionCard} onPress={() => {
              if (opt.text === q.correct) {
                if (quizIndex < QUIZ_QUESTIONS.length - 1) setQuizIndex(quizIndex + 1);
                else setQuizFinished(true);
              } else {
                Alert.alert("💛 Try again!", "You can do it!");
              }
            }}>
              <Text style={styles.optionEmoji}>{opt.image}</Text>
              <Text style={styles.optionText}>{opt.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderSettings = () => (
    <View style={styles.settingsPanel}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>⚙️ Reading Settings</Text>
        <TouchableOpacity onPress={() => setShowSettings(false)}>
          <Ionicons name="close-circle" size={32} color="#64748b" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Text style={styles.settingLabel}>Font Size: {fontSize}px</Text>
        <View style={styles.sliderRow}>
          <TouchableOpacity onPress={() => setFontSize(Math.max(16, fontSize - 2))}><Ionicons name="remove-circle" size={30} color="#3b82f6" /></TouchableOpacity>
          <View style={styles.sliderMock}><View style={{width: (fontSize - 16) * 5, height: 4, backgroundColor: '#3b82f6'}} /></View>
          <TouchableOpacity onPress={() => setFontSize(Math.min(36, fontSize + 2))}><Ionicons name="add-circle" size={30} color="#3b82f6" /></TouchableOpacity>
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.settingLabel}>Syllable Dots</Text>
          <Switch value={showSyllables} onValueChange={setShowSyllables} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.settingLabel}>High Contrast</Text>
          <Switch value={highContrast} onValueChange={setHighContrast} />
        </View>
        <Text style={styles.settingLabel}>Color Overlay</Text>
        <View style={styles.overlayRow}>
          {(['none', 'cream', 'skyblue', 'rose', 'mint'] as Overlay[]).map(o => (
            <TouchableOpacity key={o} style={[styles.overlayOpt, { backgroundColor: o === 'none' ? '#eee' : o === 'cream' ? '#fffdd0' : o === 'skyblue' ? '#87ceeb' : o === 'rose' ? '#ffb6c1' : '#98fb98' }, overlay === o && styles.overlayActive]} onPress={() => setOverlay(o)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, highContrast && styles.highContrastBg]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {stopSpeech(); setMode('reader');}}>
          <Text style={[styles.navItem, mode === 'reader' && styles.navActive]}>📖 Reader</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode('quiz')}>
          <Text style={[styles.navItem, mode === 'quiz' && styles.navActive]}>🎯 Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons name="settings-outline" size={24} color="#334155" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        {mode === 'reader' && renderReader()}
        {mode === 'quiz' && renderQuiz()}
      </View>
      <View pointerEvents="none" style={[styles.overlayLayer, { backgroundColor: getOverlayColor() }]} />
      {showSettings && renderSettings()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  highContrastBg: { backgroundColor: '#f0f0f0' },
  header: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff' },
  navItem: { fontSize: 16, fontWeight: '600', color: '#64748b' },
  navActive: { color: '#3b82f6', borderBottomWidth: 2, borderBottomColor: '#3b82f6' },
  content: { flex: 1, padding: 20 },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  ctrlBtn: { alignItems: 'center' },
  ctrlText: { fontSize: 12, color: '#64748b', marginTop: 4 },
  textContainer: { paddingBottom: 100 },
  imageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFallback: {
    fontSize: 80,
    position: 'absolute',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  wordFlow: { flexDirection: 'row', flexWrap: 'wrap' },
  wordBtn: { padding: 2, borderRadius: 4 },
  wordHighlight: { backgroundColor: '#fef3c7', borderBottomWidth: 2, borderBottomColor: '#f59e0b' },
  storyText: { fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto' },
  overlayLayer: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  quizView: { flex: 1, padding: 20 },
  quizHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  quizQuestion: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', marginLeft: 10 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  optionCard: { width: width * 0.4, backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#e2e8f0', margin: 7 },
  optionEmoji: { fontSize: 50, marginBottom: 10 },
  optionText: { fontSize: 18, fontWeight: '600' },
  resultView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  praiseEmoji: { fontSize: 80, marginBottom: 10 },
  praiseTitle: { fontSize: 32, fontWeight: '800', color: '#059669' },
  praiseSub: { fontSize: 18, color: '#64748b', marginBottom: 30 },
  settingsPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: height * 0.7, zIndex: 100, elevation: 20 },
  settingsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  settingsTitle: { fontSize: 20, fontWeight: 'bold' },
  settingLabel: { fontSize: 16, color: '#475569', marginBottom: 10, marginTop: 15 },
  sliderRow: { flexDirection: 'row', alignItems: 'center' },
  sliderMock: { flex: 1, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, marginHorizontal: 15 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  overlayRow: { flexDirection: 'row', marginTop: 10 },
  overlayOpt: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#e2e8f0', marginRight: 12 },
  overlayActive: { borderColor: '#3b82f6', borderWidth: 3 },
  actionBtn: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 10 },
  actionBtnText: { color: '#fff', fontWeight: 'bold' }
});
