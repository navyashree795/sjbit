import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DyslexiaDetection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dyslexia</Text>
      <Text style={styles.description}>
        This specialized assessment uses OpenDyslexic font characteristics and text-to-speech comprehension exercises to detect reading pattern difficulties.
      </Text>
      <View style={styles.card}>
        <Text style={styles.questionText}>Read the following paragraph aloud, then answer the questions below.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Dyslexia Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fdf6e3' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#1a1a1a' },
  description: { fontSize: 16, marginBottom: 30, color: '#4a4a4a', lineHeight: 24 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  questionText: { fontSize: 18, marginBottom: 20, color: '#333' },
  button: { backgroundColor: '#2563eb', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
