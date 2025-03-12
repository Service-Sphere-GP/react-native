import React from 'react';
import { Stack } from 'expo-router';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function AdminLayout() {
  // Only render on web platform
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Admin Panel is only available on web</Text>
      </View>
    );
  }

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