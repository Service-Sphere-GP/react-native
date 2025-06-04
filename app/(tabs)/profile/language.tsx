import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import Header from '@/components/Header';
import LanguageSelector from '@/src/i18n/LanguageSelector';
import { getTextStyle } from '@/src/utils/fontUtils';

const LanguageSettings = () => {
  const { t } = useTranslation(['common', 'profile']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  return (
    <ScrollView className="flex-1 bg-[#F4F4F4]">
      <View className="py-5">
        <Header title={t('common:language')} showBackButton={true} />

        <View
          className={`mx-4 mt-5 bg-white rounded-xl p-4 ${isRTL ? 'items-end' : 'items-start'}`}
        >
          <Text
            className={`text-base text-[#676B73] mb-5 ${textStyle.className}`}
            style={textStyle.style}
          >
            {t('common:languageDescription')}
          </Text>
          
          {/* RTL Notice */}
          <View className={`bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 ${isRTL ? 'items-end' : 'items-start'}`}>
            <Text
              className={`text-sm text-blue-700 ${textStyle.className}`}
              style={textStyle.style}
            >
              {isRTL 
                ? 'ملاحظة: تغيير اللغة من/إلى العربية يتطلب إعادة تشغيل التطبيق لتطبيق اتجاه النص الصحيح.'
                : 'Note: Switching to/from Arabic requires an app restart to properly apply the text direction.'
              }
            </Text>
          </View>

          <LanguageSelector />
        </View>
      </View>
    </ScrollView>
  );
};

export default LanguageSettings;
