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
  
  // Load web fonts using Google Fonts CDN
  const [loaded] = useFonts({
    // Using web fonts instead of local files
    'Roboto-Regular': 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
    'Roboto-Medium': 'https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap',
    'Roboto-Bold': 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap',
    'Roboto-Light': 'https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap',
    'Roboto-Thin': 'https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap',
    'Roboto-SemiBold': 'https://fonts.googleapis.com/css2?family=Roboto:wght@600&display=swap',
    'Roboto-ExtraBold': 'https://fonts.googleapis.com/css2?family=Roboto:wght@800&display=swap', 
    'Roboto-ExtraLight': 'https://fonts.googleapis.com/css2?family=Roboto:wght@200&display=swap',
    'Pacifico-Regular': 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
    
    // Arabic fonts - using Montserrat from CDN
    'Montserrat-Arabic': 'https://fonts.googleapis.com/css2?family=Montserrat&display=swap',
    'Montserrat-Arabic-Bold-700': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap',
    'Montserrat-Arabic-Medium-500': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap',
    'Montserrat-Arabic-Regular-400': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap',
    'Montserrat-Arabic-Light-300': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap',
    'Montserrat-Arabic-Thin-250': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap',
    'Montserrat-Arabic-SemiBold-600': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap', 
    'Montserrat-Arabic-ExtraBold-800': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap',
    'Montserrat-Arabic-ExtraLight-275': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap',
    'Montserrat-Arabic-Black-900': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap',
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
