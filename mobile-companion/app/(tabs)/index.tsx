import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function StudentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Portal</Text>
      <View style={styles.separator} />
      
      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome to Your Learning Space!</Text>
        <Text style={styles.subtitle}>Please go to the Assessment tab to personalize your experience.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#e2e8f0',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
