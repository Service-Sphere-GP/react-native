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

// Handle language change without RTL logic (moved to LanguageContext)
export const changeLanguage = async (language: string) => {
  // Change the i18next language
  await i18next.changeLanguage(language);
  return language;
};

// Helper function to determine if a language is RTL
export const isRTLLanguage = (language: string): boolean => {
  return LANGUAGES[language as keyof typeof LANGUAGES]?.dir === 'rtl';
};

export default i18next;
