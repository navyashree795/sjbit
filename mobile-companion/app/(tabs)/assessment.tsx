import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { startAdaptiveChat } from '../../ai';
import { router } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AssessmentScreen() {
  const [chatSession, setChatSession] = useState<any>(null);
  const [messages, setMessages] = useState<{text: string, isBot: boolean}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initChat();
  }, []);

  const initChat = async () => {
    setLoading(true);
    try {
      const age = await AsyncStorage.getItem('userAge') || '8';
      const gender = await AsyncStorage.getItem('userGender') || 'child';
      
      const { chatSession: session, firstMessage } = await startAdaptiveChat(age, gender);
      setChatSession(session);
      setMessages([{ text: firstMessage, isBot: true }]);
    } catch (e) {
      console.error(e);
      setMessages([{ text: "Sorry, I couldn't connect to the AI. Please try again later.", isBot: true }]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession || diagnosis) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setLoading(true);

    try {
      const result = await chatSession.sendMessage(userMessage);
      const responseText = result.response.text();
      
      // Check if the AI reached a diagnosis
      if (responseText.includes("DIAGNOSIS:")) {
        const diagText = responseText.split("DIAGNOSIS:")[1].trim();
        setDiagnosis(diagText);
        setMessages(prev => [...prev, { text: `Assessment Complete! Based on our chat, it appears the learning profile leans towards: **${diagText}**.`, isBot: true }]);
      } else {
        setMessages(prev => [...prev, { text: responseText, isBot: true }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { text: "Error getting response. Try again.", isBot: true }]);
    }
    
    setLoading(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
    >
      <Text style={styles.title}>Learning Style Assessment</Text>
      
      {/* Specific Tests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Take a Specialized Test:</Text>
        <TouchableOpacity style={[styles.navButton, {backgroundColor: '#2563eb'}]} onPress={() => router.push('/assessments/dyslexia')}>
          <Text style={styles.navButtonText}>🔍 Dyslexia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, {backgroundColor: '#10b981'}]} onPress={() => router.push('/assessments/adhd')}>
          <Text style={styles.navButtonText}>🎮 ADHD Detection Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, {backgroundColor: '#6366f1'}]} onPress={() => router.push('/assessments/autism')}>
          <Text style={styles.navButtonText}>🧩 Autism Detection Test</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Adaptive Chat Assessment Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Truly Adaptive AI Assessment:</Text>
        <Text style={styles.description}>
          Answer my questions one by one. I will adapt my next question based on your previous answer until I can determine your learning profile!
        </Text>
        
        <View style={styles.chatBox}>
          {messages.map((msg, idx) => (
            <View key={idx} style={[styles.messageBubble, msg.isBot ? styles.botBubble : styles.userBubble]}>
              <Text style={msg.isBot ? styles.botText : styles.userText}>{msg.text}</Text>
            </View>
          ))}
          {loading && <ActivityIndicator color="#0ea5e9" style={{ alignSelf: 'flex-start', margin: 10 }} />}
        </View>

        {!diagnosis ? (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.chatInput}
              value={input}
              onChangeText={setInput}
              placeholder="Type your answer..."
              placeholderTextColor="#9ca3af"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading || !input.trim()}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Assessment Finished!</Text>
            <Text style={styles.resultText}>Detected Profile: <Text style={{fontWeight: 'bold'}}>{diagnosis}</Text></Text>
            <TouchableOpacity style={styles.restartButton} onPress={() => { setDiagnosis(null); setMessages([]); initChat(); }}>
              <Text style={styles.restartButtonText}>Restart Assessment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 25, marginTop: 20, color: '#0f172a' },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#334155' },
  navButton: { padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'flex-start', elevation: 2 },
  navButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#cbd5e1', marginVertical: 25 },
  description: { fontSize: 15, color: '#475569', marginBottom: 15, lineHeight: 22 },
  
  chatBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    minHeight: 200,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 15,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  botBubble: {
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#0ea5e9',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botText: { color: '#334155', fontSize: 15, lineHeight: 22 },
  userText: { color: '#ffffff', fontSize: 15, lineHeight: 22 },
  
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  resultBox: { marginTop: 10, padding: 20, backgroundColor: '#ecfdf5', borderRadius: 12, borderWidth: 1, borderColor: '#a7f3d0', alignItems: 'center' },
  resultTitle: { fontSize: 20, fontWeight: 'bold', color: '#065f46', marginBottom: 10 },
  resultText: { fontSize: 18, color: '#047857', marginBottom: 20 },
  restartButton: { backgroundColor: '#10b981', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  restartButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
