import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../src/i18n/LanguageContext';
import Header from '../../../components/Header';
import LanguageSelector from '../../../src/i18n/LanguageSelector';
import LocalizationDemo from '../../../src/i18n/LocalizationDemo';
import { applyRTLConditional } from '../../../src/i18n/rtlUtils';

const LanguageSettings = () => {
  const { t } = useTranslation(['common', 'profile']);
  const { isRTL } = useLanguage();
  console.log('isRTL', isRTL);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        isRTL && styles.contentContainerRTL
      ]}
    >
      <Header
        title={t('common:language')}
        showBackButton={true}
        notificationsCount={0}
      />
      
      <p>{isRTL}</p>

      <View style={applyRTLConditional(styles.section, styles.sectionRTL)}>
        <Text style={applyRTLConditional(styles.description, styles.descriptionRTL)}>
          {t('common:languageDescription')}
        </Text>
        
        <LanguageSelector />
      </View>
      
      <View style={styles.demoContainer}>
        <Text style={applyRTLConditional(styles.sectionTitle, styles.sectionTitleRTL)}>
          {t('common:preview')}
        </Text>
        
        <LocalizationDemo />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  contentContainer: {
    paddingVertical: 20,
  },
  contentContainerRTL: {
    // RTL-specific content container styles if needed
  },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  sectionRTL: {
    alignItems: 'flex-end',
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#676B73',
    textAlign: 'left',
    marginBottom: 20,
  },
  descriptionRTL: {
    textAlign: 'right',
  },
  demoContainer: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
  },
  sectionTitleRTL: {
    textAlign: 'right',
  },
});

export default LanguageSettings;