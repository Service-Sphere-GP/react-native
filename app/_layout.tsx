import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../assets/styles/global.css';
import Toast from 'react-native-toast-message';
// Import our language provider
import { LanguageProvider, useLanguage } from '../src/i18n/LanguageContext';
// Import i18n instance to initialize it
import '../src/i18n/i18n';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Root layout without language context - needed because we need to wrap the app with LanguageProvider
function RootLayoutWithoutContext() {
  const { language, isRTL } = useLanguage();
  
  // Load appropriate font set based on language
  const [loaded] = useFonts({
    // English/Default fonts
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
    'Roboto-SemiBold': require('../assets/fonts/Roboto-SemiBold.ttf'),
    'Roboto-ExtraBold': require('../assets/fonts/Roboto-ExtraBold.ttf'),
    'Roboto-ExtraLight': require('../assets/fonts/Roboto-ExtraLight.ttf'),
    'Pacifico-Regular': require('../assets/fonts/Pacifico-Regular.ttf'),
    
    // Arabic fonts
    'Montserrat-Arabic-Bold-700': require('../assets/fonts/Montserrat-Arabic Bold 700.otf'),
    'Montserrat-Arabic-Medium-500': require('../assets/fonts/Montserrat-Arabic Medium 500.otf'),
    'Montserrat-Arabic-Regular-400': require('../assets/fonts/Montserrat-Arabic.otf'),
    'Montserrat-Arabic-Light-300': require('../assets/fonts/Montserrat-Arabic Light 300.otf'),
    'Montserrat-Arabic-Thin-250': require('../assets/fonts/Montserrat-Arabic Thin 250.otf'),
    'Montserrat-Arabic-SemiBold-600': require('../assets/fonts/Montserrat-Arabic SemiBold 600.otf'),
    'Montserrat-Arabic-ExtraBold-800': require('../assets/fonts/Montserrat-Arabic ExtraBold 800.otf'),
    'Montserrat-Arabic-ExtraLight-275': require('../assets/fonts/Montserrat-Arabic ExtraLight 275.otf'),
    'Montserrat-Arabic-Black-900': require('../assets/fonts/Montserrat-Arabic Black 900.otf'),
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
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <Toast />
      </ThemeProvider>
  );
}

// Main root layout component with language provider
export default function RootLayout() {
  return (
    <LanguageProvider>
      <RootLayoutWithoutContext />
    </LanguageProvider>
  );
}
