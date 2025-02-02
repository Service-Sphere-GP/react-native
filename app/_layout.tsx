import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../assets/styles/global.css';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "Roboto-Bold": require('../assets/fonts/Roboto-Bold.ttf'),
    "Roboto-Medium": require('../assets/fonts/Roboto-Medium.ttf'),
    "Roboto-Regular": require('../assets/fonts/Roboto-Regular.ttf'),
    "Roboto-Light": require('../assets/fonts/Roboto-Light.ttf'),
    "Roboto-Thin": require('../assets/fonts/Roboto-Thin.ttf'),
    "Roboto-SemiBold": require('../assets/fonts/Roboto-SemiBold.ttf'),
    "Roboto-ExtraBold": require('../assets/fonts/Roboto-ExtraBold.ttf'),
    "Roboto-ExtraLight": require('../assets/fonts/Roboto-ExtraLight.ttf'),
    "Pacifico-Regular": require('../assets/fonts/Pacifico-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
