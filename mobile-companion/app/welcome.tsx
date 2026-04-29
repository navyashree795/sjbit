import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleContinue = async () => {
    if (!age || !gender) return;
    
    // Save to async storage so the assessment tab can use it
    await AsyncStorage.setItem('userAge', age);
    await AsyncStorage.setItem('userGender', gender);
    
    // Proceed to the main app tabs
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Before we begin, tell us a little bit about the student to personalize the assessment AI.</Text>
      
      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 8"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Gender:</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.genderButton, gender === 'Boy' && styles.selected]} 
          onPress={() => setGender('Boy')}
        >
          <Text style={[styles.genderText, gender === 'Boy' && styles.selectedText]}>Boy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.genderButton, gender === 'Girl' && styles.selected]} 
          onPress={() => setGender('Girl')}
        >
          <Text style={[styles.genderText, gender === 'Girl' && styles.selectedText]}>Girl</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.genderButton, gender === 'Other' && styles.selected]} 
          onPress={() => setGender('Other')}
        >
          <Text style={[styles.genderText, gender === 'Other' && styles.selectedText]}>Other</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Start App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0ea5e9',
  },
  genderText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '600',
  },
  selectedText: {
    color: '#0284c7',
  },
  continueButton: {
    backgroundColor: '#0ea5e9',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
