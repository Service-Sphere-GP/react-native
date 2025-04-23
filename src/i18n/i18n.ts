import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

// Supported language list
export const LANGUAGES = {
  en: { name: 'English', dir: 'ltr', nativeName: 'English' },
  ar: { name: 'Arabic', dir: 'rtl', nativeName: 'العربية' },
};

// Import translation files directly
import en from './locales/en.json';
import ar from './locales/ar.json';

// Resources object for i18next
const resources = {
  en: en,
  ar: ar,
};

// Default namespace
export const defaultNS = 'common';

// Initialize i18next
i18next.use(initReactI18next).init({
  // Resources with translations
  resources,
  // Initial language fallback
  lng: Localization.locale.split('-')[0],
  // Fallback language if translation is missing
  fallbackLng: 'en',
  // Namespaces
  ns: [
    'common',
    'auth',
    'home',
    'services',
    'bookings',
    'profile',
    'chat',
    'validation',
  ],
  defaultNS,
  // React specific configuration
  react: {
    useSuspense: false,
  },
  // Interpolation configuration
  interpolation: {
    escapeValue: false,
  },
});

// Handle RTL setup when language changes
export const changeLanguage = async (language: string) => {
  // Check if the language is RTL
  const isRTL = LANGUAGES[language as keyof typeof LANGUAGES]?.dir === 'rtl';

  // Update the RTL status in React Native
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    // Note: In a real app, you might want to restart the app
    // to apply RTL changes consistently across all screens
  }

  // Change the i18next language
  await i18next.changeLanguage(language);

  return language;
};

export default i18next;
