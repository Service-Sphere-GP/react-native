import React, { createContext, useState, useEffect, useContext } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18next, { changeLanguage, LANGUAGES } from './i18n';

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

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with device locale but only the language part (e.g., 'en' from 'en-US')
  const deviceLocale = Localization.locale.split('-')[0];
  const [language, setLanguageState] = useState(deviceLocale);
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);

  // Load saved language preference on mount
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) {
          await handleLanguageChange(savedLanguage);
        } else {
          // If no saved preference, use device locale but check if it's supported
          const fallbackLang = Object.keys(LANGUAGES).includes(deviceLocale) ? deviceLocale : 'en';
          await handleLanguageChange(fallbackLang);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguagePreference();
  }, []);

  // Handle language changing
  const handleLanguageChange = async (lang: string) => {
    try {
      // Update i18next and RTL settings
      await changeLanguage(lang);
      
      // Update state
      setLanguageState(lang);
      setIsRTL(I18nManager.isRTL);

      // Save preference
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
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