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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 4 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
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
          tabBarLabel: 'Assess',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🧪</Text>,
        }}
      />
      <Tabs.Screen
        name="teacher"
        options={{
          title: 'Teacher',
          tabBarLabel: 'Teacher',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="parent"
        options={{
          title: 'Parent Digest',
          tabBarLabel: 'Parent',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👨‍👩‍👧</Text>,
        }}
      />
    </Tabs>
  );
}
