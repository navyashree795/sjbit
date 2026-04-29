import React from 'react';
// @ts-ignore
import { Tabs, router } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

export default function TabLayout() {
  const handleSignOut = async () => {
    await signOut(auth);
    router.replace({ pathname: '/', params: { mode: 'login' } });
  };

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#3b82f6' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerRight: () => (
            <TouchableOpacity onPress={handleSignOut} style={{ marginRight: 15 }}>
              <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Sign Out</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="assessment"
        options={{
          title: 'Assessment',
        }}
      />
    </Tabs>
  );
}
