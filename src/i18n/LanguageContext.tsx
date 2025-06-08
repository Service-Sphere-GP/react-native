import React, { createContext, useState, useEffect, useContext } from 'react';
import { I18nManager, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18next, {
  changeLanguage as i18nextChangeLanguage,
  LANGUAGES,
} from './i18n';

// Define the types for our context
type LanguageContextType = {
  language: string;
  isRTL: boolean;
  setLanguage: (lang: string) => Promise<void>;
  languages: typeof LANGUAGES;
};

// Create the language context
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  isRTL: false,
  setLanguage: async () => {},
  languages: LANGUAGES,
});

// Key for storing language preference
const LANGUAGE_STORAGE_KEY = '@language_preference';

// Helper function to determine if a language is RTL
const isLanguageRTL = (lang: string): boolean => {
  return LANGUAGES[lang as keyof typeof LANGUAGES]?.dir === 'rtl';
};

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize with device locale but only the language part (e.g., 'en' from 'en-US')
  const deviceLocale = Localization.locale.split('-')[0];
  const [language, setLanguageState] = useState(deviceLocale);
  const [isRTL, setIsRTL] = useState(() => {
    // Initialize RTL state based on I18nManager's current state
    return I18nManager.isRTL;
  });

  // Load saved language preference on mount
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) {
          // Check if the saved language RTL state matches current I18nManager state
          const savedIsRTL = isLanguageRTL(savedLanguage);
          if (I18nManager.isRTL !== savedIsRTL) {
            // If there's a mismatch, we need to restart the app
            console.log('RTL state mismatch detected, app restart required');
            return;
          }
          await handleLanguageChange(savedLanguage, false);
        } else {
          // If no saved preference, use device locale but check if it's supported
          const fallbackLang = Object.keys(LANGUAGES).includes(deviceLocale)
            ? deviceLocale
            : 'en';
          await handleLanguageChange(fallbackLang, false);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguagePreference();
  }, []);

  // Handle language changing
  const handleLanguageChange = async (
    lang: string,
    showRestartPrompt: boolean = true,
  ) => {
    try {
      // Determine if the language is RTL
      const rtl = isLanguageRTL(lang);
      const currentRTL = I18nManager.isRTL;

      // Update i18next first
      await i18nextChangeLanguage(lang);

      // Update language state
      setLanguageState(lang);

      // Save preference
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);

      // Check if RTL state needs to change
      if (currentRTL !== rtl) {
        // Force RTL layout change
        I18nManager.forceRTL(rtl);

        if (showRestartPrompt) {
          // Show restart prompt for RTL changes
          Alert.alert(
            'Language Changed',
            'The app needs to restart to apply the new layout direction. Please close and reopen the app to see the changes.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Update local state for immediate feedback
                  setIsRTL(rtl);
                },
              },
            ],
          );
        } else {
          // Just update the state if no prompt needed (initial load)
          setIsRTL(rtl);
        }
      } else {
        // No RTL change needed, just update the state
        setIsRTL(rtl);
      }

      console.log(`Language changed to ${lang}, RTL: ${rtl}`);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // Context value
  const contextValue: LanguageContextType = {
    language,
    isRTL,
    setLanguage: handleLanguageChange,
    languages: LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for accessing the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
