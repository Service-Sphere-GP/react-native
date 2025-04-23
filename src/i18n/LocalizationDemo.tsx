import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { applyRTLConditional } from '@/src/i18n/rtlUtils';

const LocalizationDemo = () => {
  const { t } = useTranslation(['common', 'services', 'auth']);
  const { isRTL } = useLanguage();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={applyRTLConditional(styles.card, styles.cardRTL)}>
        <Text style={applyRTLConditional(styles.heading, styles.headingRTL)}>
          {t('common:welcome')}
        </Text>
        
        <View style={applyRTLConditional(styles.section, styles.sectionRTL)}>
          <Text style={applyRTLConditional(styles.label, styles.labelRTL)}>
            {t('auth:email')}:
          </Text>
          <Text style={applyRTLConditional(styles.value, styles.valueRTL)}>
            user@example.com
          </Text>
        </View>
        
        <View style={applyRTLConditional(styles.section, styles.sectionRTL)}>
          <Text style={applyRTLConditional(styles.label, styles.labelRTL)}>
            {t('services:category')}:
          </Text>
          <Text style={applyRTLConditional(styles.value, styles.valueRTL)}>
            {t('services:addService')}
          </Text>
        </View>
        
        <View style={applyRTLConditional(styles.infoBox, styles.infoBoxRTL)}>
          <Text style={applyRTLConditional(styles.infoText, styles.infoTextRTL)}>
            {t('common:languageNote')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRTL: {
    // RTL-specific card styles (if needed)
  },
  heading: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: '#147E93',
    marginBottom: 20,
    textAlign: 'left',
  },
  headingRTL: {
    textAlign: 'right',
  },
  section: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  sectionRTL: {
    flexDirection: 'row-reverse',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#444',
    marginRight: 8,
  },
  labelRTL: {
    marginRight: 0,
    marginLeft: 8,
  },
  value: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#666',
  },
  valueRTL: {
    // RTL-specific value styles (if needed)
  },
  infoBox: {
    backgroundColor: '#F2F7FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#147E93',
  },
  infoBoxRTL: {
    borderLeftWidth: 0,
    borderRightWidth: 4,
    borderRightColor: '#147E93',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    textAlign: 'left',
  },
  infoTextRTL: {
    textAlign: 'right',
  },
});

export default LocalizationDemo;