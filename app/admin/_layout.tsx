import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function AdminLayout() {
  // Removed the platform restriction
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.light.background },
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Admin Login' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Admin Dashboard' }} />
    </Stack>
  );
}
