import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';
import { NotificationProvider } from '@/constants/NotificationContext';

export default function TabsLayout() {
  return (
    <NotificationProvider>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { paddingBottom: 70 },
          }}
          />
        <BottomNavigation />
      </View>
    </NotificationProvider>
  );
}
