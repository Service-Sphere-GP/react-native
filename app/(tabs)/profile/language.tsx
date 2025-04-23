import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../src/i18n/LanguageContext';
import { getTextStyle } from '../../../src/utils/fontUtils';
import Header from '../../../components/Header';
import LanguageSelector from '../../../src/i18n/LanguageSelector';

const LanguageSettings = () => {
  const { t } = useTranslation(['common', 'profile']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  return (
    <ScrollView 
      className="flex-1 bg-[#F4F4F4]"
      contentContainerStyle={{
        paddingVertical: 20
      }}
    >
      <Header
        title={t('common:language')}
        showBackButton={true}
        notificationsCount={0}
      />

      <View className={`mx-4 mt-5 bg-white rounded-xl p-4 ${isRTL ? 'items-end' : 'items-start'}`}>
        <Text 
          className={`text-base text-[#676B73] mb-5 ${textStyle.className}`}
          style={textStyle.style}
        >
          {t('common:languageDescription')}
        </Text>
        
        <LanguageSelector />
      </View>
    </ScrollView>
  );
};

export default LanguageSettings;