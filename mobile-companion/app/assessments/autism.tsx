import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AutismDetection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autism Detection</Text>
      <Text style={styles.description}>
        This assessment evaluates response to structured, predictable formatting, clear literal instructions, and sensory overload triggers.
      </Text>
      <View style={styles.card}>
        <Text style={styles.questionText}>Step 1. Look at the three shapes below.</Text>
        <Text style={styles.questionText}>Step 2. Tap the button that matches the exact order of the shapes.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Begin Task 1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333333' },
  description: { fontSize: 16, marginBottom: 30, color: '#555555', lineHeight: 24 },
  card: { backgroundColor: '#f9fafb', padding: 20, borderRadius: 4, borderWidth: 1, borderColor: '#e5e7eb' },
  questionText: { fontSize: 18, marginBottom: 15, color: '#111827' },
  button: { backgroundColor: '#6366f1', padding: 15, borderRadius: 4, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
