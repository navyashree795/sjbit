import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import { useLocalSearchParams } from 'expo-router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
// @ts-ignore
import { router } from 'expo-router';

export default function AuthScreen() {
  const params = useLocalSearchParams();
  // mode='login' → show login, anything else → show sign up by default
  const [isLogin, setIsLogin] = useState(params.mode === 'login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)');
      } else {
        setCheckingAuth(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.replace('/(tabs)');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Navigate to welcome screen to collect age and gender on first sign up
        router.replace('/welcome');
      }
    } catch (error: any) {
      Alert.alert('Authentication Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoDot} />
            <Text style={styles.logoText}>Anywhere app.</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.superTitle}>{isLogin ? 'WELCOME BACK' : 'START FOR FREE'}</Text>
          <Text style={styles.title}>
            {isLogin ? 'Log into account' : 'Create new account'}
            <Text style={styles.dot}>.</Text>
          </Text>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? " : "Already A Member? "}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchAction}>{isLogin ? 'Sign up' : 'Log in'}</Text>
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <View style={styles.rowInputs}>
              <View style={styles.halfInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  placeholderTextColor="#64748b"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={styles.halfInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  placeholderTextColor="#64748b"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.changeMethodButton}>
              <Text style={styles.changeMethodText}>Change method</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleAuth} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>{isLogin ? 'Log in' : 'Create account'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1f26',
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0ea5e9',
    marginRight: 8,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  superTitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dot: {
    color: '#0ea5e9',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  switchText: {
    color: '#64748b',
    fontSize: 14,
  },
  switchAction: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInputContainer: {
    flex: 0.48,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#262a34',
    color: '#ffffff',
    padding: 16,
    borderRadius: 12,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  changeMethodButton: {
    backgroundColor: '#333845',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 24,
    flex: 0.48,
    alignItems: 'center',
  },
  changeMethodText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 24,
    flex: 0.48,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
