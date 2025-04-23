import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from './LanguageContext';
import { useTranslation } from 'react-i18next';
import { useFontFamily, FontWeight } from '@/src/utils/fontUtils';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languages, isRTL } = useLanguage();
  const { t } = useTranslation();
  const fonts = useFontFamily();

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      <Text 
        style={[
          styles.title, 
          isRTL && styles.titleRTL,
          { fontFamily: fonts.medium }
        ]}
      >
        {t('common:language')}
      </Text>
      
      <View style={styles.buttonsContainer}>
        {Object.entries(languages).map(([code, langInfo]) => (
          <TouchableOpacity
            key={code}
            style={[
              styles.button,
              language === code && styles.activeButton,
              isRTL && styles.buttonRTL
            ]}
            onPress={() => setLanguage(code)}
          >
            <Text 
              style={[
                styles.buttonText,
                language === code && styles.activeButtonText,
                isRTL && styles.buttonTextRTL,
                { 
                  fontFamily: language === code 
                    ? fonts.medium 
                    : fonts.regular 
                }
              ]}
            >
              {langInfo.nativeName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'flex-start',
  },
  containerRTL: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    // fontFamily is now applied dynamically
  },
  titleRTL: {
    textAlign: 'right',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E8EB',
    backgroundColor: '#F9FAFB',
  },
  buttonRTL: {
    marginRight: 0,
    marginLeft: 8,
  },
  activeButton: {
    backgroundColor: '#147E93',
    borderColor: '#147E93',
  },
  buttonText: {
    fontSize: 14,
    color: '#676B73',
    // fontFamily is now applied dynamically
  },
  buttonTextRTL: {
    textAlign: 'right',
  },
  activeButtonText: {
    color: '#FFFFFF',
    // fontFamily is now applied dynamically
  },
});

export default LanguageSelector;