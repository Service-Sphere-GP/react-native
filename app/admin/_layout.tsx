import React from 'react';
import { Stack } from 'expo-router';
import { Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function AdminLayout() {
  const router = useRouter();

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  text: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
});