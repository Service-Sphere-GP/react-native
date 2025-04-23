import { View, Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { useFontFamily, getTextStyle } from '@/src/utils/fontUtils';

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common']);
  const { isRTL } = useLanguage();
  const fonts = useFontFamily();

  // Get the text styling with semiBold weight
  const titleStyle = getTextStyle(isRTL, 'semiBold');

  useEffect(() => {
    setTimeout(() => {
      router.push('/(tabs)');
    }, 2000);
  }, [router]);

  return (
    <View className="flex-1 bg-[#f8f7f8] justify-center items-center">
      <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Image
          source={require('../../assets/images/icon-dark.png')}
          className="w-64 h-64"
        />
        <View className={`${isRTL ? 'mr-1' : 'ml-1'} mt-10`}>
          <Text 
            className={`text-5xl text-[#147e93] ${titleStyle.className}`}
            style={titleStyle.style}
          >
            {t('common:appName').split(' ')[0]}
          </Text>
          <Text 
            className={`text-5xl text-[#147e93] ${titleStyle.className}`}
            style={titleStyle.style}
          >
            {t('common:appName').split(' ')[1]}
          </Text>
        </View>
      </View>
    </View>
  );
}
