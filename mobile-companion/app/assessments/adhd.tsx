import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ADHDDetection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ADHD Detection</Text>
      <Text style={styles.description}>
        This assessment uses gamified micro-interactions to track attention span, impulse control, and engagement levels.
      </Text>
      <View style={styles.card}>
        <Text style={styles.questionText}>Tap the targets as they appear on screen. Avoid tapping the red distractors!</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start ADHD Mini-Game Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#eff6ff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#0f172a' },
  description: { fontSize: 16, marginBottom: 30, color: '#334155', lineHeight: 24 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  questionText: { fontSize: 18, marginBottom: 20, color: '#333' },
  button: { backgroundColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
