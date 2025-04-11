import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { paddingBottom: 70 },
        }}
      />
      <BottomNavigation />
    </View>
  );
}
