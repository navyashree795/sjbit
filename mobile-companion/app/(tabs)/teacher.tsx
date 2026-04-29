import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBLS15IzfiNW5m_Ua4JadV_8C9mLaOxuHI');

const mockStudents = [
  { name: 'Alex',  profile: 'ADHD',     topic: 'Fractions',      status: 'needs', time: '45 mins', attempts: 12, completed: ['Addition','Subtraction'], struggling: ['Fractions'] },
  { name: 'Sarah', profile: 'Dyslexia', topic: 'Reading Comp.',  status: 'good',  time: '30 mins', attempts: 5,  completed: ['Letters','Words'],          struggling: [] },
  { name: 'David', profile: 'Autism',   topic: 'Geometry',       status: 'good',  time: '60 mins', attempts: 8,  completed: ['Shapes','Lines'],            struggling: [] },
];

export default function TeacherScreen() {
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [loadingInsight, setLoadingInsight] = useState<string | null>(null);

  const fetchInsight = async (student: typeof mockStudents[0]) => {
    setLoadingInsight(student.name);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Based on this student's progress data: ${JSON.stringify(student)}, write a short, 2-sentence insight for the teacher explaining what the student is struggling with and a brief recommendation.`;
      const result = await model.generateContent(prompt);
      setInsights(prev => ({ ...prev, [student.name]: result.response.text().trim() }));
    } catch (e) {
      setInsights(prev => ({ ...prev, [student.name]: 'Student is progressing but requires more focus on recent topics.' }));
    }
    setLoadingInsight(null);
  };

  useEffect(() => {
    fetchInsight(mockStudents[0]);
  }, []);

  const profileColor: Record<string, string> = {
    ADHD: '#10b981', Dyslexia: '#2563eb', Autism: '#6366f1',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Teacher Dashboard</Text>

        {/* Class Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Class Overview</Text>
          {mockStudents.map(s => (
            <View key={s.name} style={styles.studentRow}>
              <View style={styles.studentLeft}>
                <View style={[styles.avatarDot, { backgroundColor: profileColor[s.profile] }]} />
                <View>
                  <Text style={styles.studentName}>{s.name}</Text>
                  <Text style={styles.studentTopic}>{s.topic}</Text>
                </View>
              </View>
              <View style={styles.studentRight}>
                <View style={[styles.profileBadge, { backgroundColor: profileColor[s.profile] + '22' }]}>
                  <Text style={[styles.profileBadgeText, { color: profileColor[s.profile] }]}>{s.profile}</Text>
                </View>
                <Text style={[styles.statusText, { color: s.status === 'good' ? '#10b981' : '#f59e0b' }]}>
                  {s.status === 'good' ? '✅ On Track' : '⚠️ Needs Attention'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* AI Insights */}
        <Text style={styles.sectionLabel}>✨ AI Insights</Text>
        {mockStudents.map(s => (
          <View key={s.name} style={[styles.card, styles.insightCard]}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightName}>{s.name}</Text>
              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={() => fetchInsight(s)}
                disabled={loadingInsight === s.name}
              >
                <Text style={styles.refreshBtnText}>
                  {loadingInsight === s.name ? '...' : '🔄 Refresh'}
                </Text>
              </TouchableOpacity>
            </View>
            {loadingInsight === s.name && !insights[s.name] ? (
              <ActivityIndicator color="#6366f1" style={{ marginTop: 10 }} />
            ) : (
              <Text style={styles.insightText}>
                {insights[s.name] || 'Tap Refresh to generate an AI insight.'}
              </Text>
            )}
          </View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 20, paddingTop: 24 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  sectionLabel: { fontSize: 18, fontWeight: '700', color: '#334155', marginBottom: 12, marginTop: 8 },

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
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 14 },

  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  studentLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  studentName: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  studentTopic: { fontSize: 13, color: '#64748b', marginTop: 2 },
  studentRight: { alignItems: 'flex-end' },
  profileBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, marginBottom: 4 },
  profileBadgeText: { fontSize: 12, fontWeight: '700' },
  statusText: { fontSize: 12, fontWeight: '600' },

  insightCard: { borderLeftWidth: 4, borderLeftColor: '#6366f1' },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightName: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  refreshBtn: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  refreshBtnText: { color: '#6366f1', fontWeight: '600', fontSize: 13 },
  insightText: { fontSize: 14, color: '#475569', lineHeight: 22, fontStyle: 'italic' },
});
