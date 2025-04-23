import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLanguage } from './LanguageContext';
import { useTranslation } from 'react-i18next';
import { getTextStyle } from '@/src/utils/fontUtils';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languages, isRTL } = useLanguage();
  const { t } = useTranslation();
  const textStyle = getTextStyle(isRTL);

  return (
    <View className={`p-4 ${isRTL ? 'items-end' : 'items-start'}`}>
      <Text 
        className={`text-lg mb-3 font-medium ${textStyle.className}`}
        style={textStyle.style}
      >
        {t('common:language')}
      </Text>
      
      <View className="flex-row">
        {Object.entries(languages).map(([code, langInfo]) => (
          <TouchableOpacity
            key={code}
            className={`py-2 px-4 ${isRTL ? 'ml-2' : 'mr-2'} rounded-lg border border-[#E6E8EB] ${language === code ? 'bg-[#147E93] border-[#147E93]' : 'bg-[#F9FAFB]'}`}
            onPress={() => setLanguage(code)}
          >
            <Text 
              className={`text-sm ${language === code ? 'text-white font-medium' : 'text-[#676B73] font-normal'} ${isRTL ? 'text-right' : 'text-left'}`}
              style={textStyle.style}
            >
              {langInfo.nativeName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LanguageSelector;