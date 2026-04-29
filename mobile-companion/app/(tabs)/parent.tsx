import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const updates = [
  {
    date: 'Today',
    emoji: '🌟',
    title: 'Great Progress on Math!',
    body: "Dear Parent, today was a great day for Alex! He spent 45 minutes on his math missions. He successfully completed 2 modules but found fractions a little tricky. Our AI has adapted his upcoming lessons to include more visual aids.\n\nHe earned 3 new stars in his gamified learning environment. Keep encouraging him!",
    stars: 3,
    color: '#10b981',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    date: 'Yesterday',
    emoji: '📖',
    title: 'Reading Session Summary',
    body: "Yesterday Alex worked on reading comprehension for 30 minutes. He showed great improvement in identifying main ideas. His AI tutor noticed he reads better when text is broken into shorter paragraphs.",
    stars: 2,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
];

export default function ParentScreen() {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const sendEncouragement = () => {
    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please write an encouraging message first!');
      return;
    }
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Parent Digest</Text>
        <Text style={styles.subtitle}>Stay updated on Alex's learning journey 🎓</Text>

        {/* Progress stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Modules Done', value: '2', icon: '✅' },
            { label: 'Stars Earned', value: '3 ⭐',  icon: '🏆' },
            { label: 'Time Today',   value: '45 min', icon: '⏱️' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Daily updates */}
        <Text style={styles.sectionLabel}>📋 Daily Updates</Text>
        {updates.map((u, i) => (
          <View key={i} style={[styles.card, { backgroundColor: u.bg, borderColor: u.border, borderWidth: 1 }]}>
            <View style={styles.updateHeader}>
              <Text style={styles.updateEmoji}>{u.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.updateTitle, { color: u.color }]}>{u.title}</Text>
                <Text style={styles.updateDate}>{u.date}</Text>
              </View>
              <View style={styles.starsRow}>
                {Array.from({ length: u.stars }).map((_, j) => (
                  <Text key={j} style={styles.star}>⭐</Text>
                ))}
              </View>
            </View>
            <Text style={styles.updateBody}>{u.body}</Text>
          </View>
        ))}

        {/* Encouragement */}
        <Text style={styles.sectionLabel}>💌 Send Encouragement</Text>
        <View style={styles.card}>
          <Text style={styles.encourageHint}>Write a motivational message for Alex. It will appear in his app!</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Great job today, Alex! Keep it up! 🚀"
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
            value={message}
            onChangeText={setMessage}
          />
          {sent ? (
            <View style={styles.sentBadge}>
              <Text style={styles.sentText}>✅ Message sent to Alex!</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.sendBtn} onPress={sendEncouragement}>
              <Text style={styles.sendBtnText}>Send Message 💬</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 20, paddingTop: 24 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 20 },
  sectionLabel: { fontSize: 18, fontWeight: '700', color: '#334155', marginBottom: 12, marginTop: 8 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statIcon:  { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  statLabel: { fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 2 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  updateHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  updateEmoji: { fontSize: 28 },
  updateTitle: { fontSize: 16, fontWeight: '700' },
  updateDate:  { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  starsRow:    { flexDirection: 'row' },
  star:        { fontSize: 14 },
  updateBody:  { fontSize: 14, color: '#475569', lineHeight: 22 },

  encourageHint: { fontSize: 14, color: '#64748b', marginBottom: 12 },
  messageInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#0f172a',
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  sendBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  sentBadge: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  sentText: { color: '#166534', fontWeight: '700', fontSize: 15 },
});
