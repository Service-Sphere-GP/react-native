import { Stack, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '@/components/CustomButton';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

const App = () => {
  const router = useRouter();
  const landingImage = require('@/assets/images/LandingImage.png');
  const { t } = useTranslation(['common']);
  const { isRTL } = useLanguage();

  const { height } = useWindowDimensions();
  const responsiveHeight = height * 0.5;

  // Get text styles with appropriate font family and alignment
  const textStyle = getTextStyle(isRTL);

  return (
    <ScrollView
      className="flex-1 bg-[#fdfdfd] px-4 py-6"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <SafeAreaView className="flex flex-1 items-center justify-between px-5">
        <View className="w-full">
          {/* Logo Text */}
          <Animated.View
            entering={FadeInDown.delay(300)}
            className="w-full mt-2"
          >
            <Text className={`text-[40px] font-semibold ${textStyle.className}`}>
              <Text className="text-[#FFCE4C]" style={textStyle.style}>{t('common:serviceTitle')} </Text>
              <Text className="text-[#147E93]" style={textStyle.style}>{t('common:sphereTitle')}</Text>
            </Text>
          </Animated.View>

          {/* Content Section */}
          <View className="w-full" style={{ marginTop: 15 }}>
            {/* Subtitle */}
            <Animated.View entering={FadeInDown.delay(400)}>
              <Text 
                className={`text-[#030B19] text-[22px] leading-tight font-semibold ${textStyle.className}`}
                style={textStyle.style}
              >
                {t('common:slogan')}
              </Text>
            </Animated.View>

            {/* Description */}
            <Animated.View
              entering={FadeInDown.delay(500)}
              style={{ marginTop: 15 }}
            >
              <Text 
                className={`text-[#030B19] text-[16px] ${textStyle.className}`}
                style={textStyle.style}
              >
                {t('common:welcomeMessage')}
              </Text>
            </Animated.View>

            {/* Landing Image */}
            <Animated.View
              entering={FadeInDown.delay(600)}
              className="w-full mt-4 items-center justify-center"
            >
              <Image
                source={landingImage}
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: responsiveHeight,
                  transform: [{ scaleX: isRTL ? -1 : 1 }], // Flip image horizontally if RTL
                }}
              />
            </Animated.View>
          </View>
        </View>

        {/* Buttons */}
        <Animated.View
          entering={FadeInDown.delay(700)}
          style={{ width: '100%', gap: 12, marginBottom: 20 }}
        >
          <CustomButton
            onPress={() => router.push('/(otp)/customer/register')}
            title={t('common:customerButton')}
            containerStyles="bg-[#147E93] rounded-[10px] shadow-md p-2"
            textStyles="text-[20px] text-white font-semibold"
          />
          <CustomButton
            onPress={() => router.push('/(otp)/provider/register')}
            title={t('common:providerButton')}
            containerStyles="bg-white rounded-[10px] shadow-md p-2"
            textStyles="text-[20px] text-[#147E93] font-semibold"
          />
        </Animated.View>

        <StatusBar style="dark" />
      </SafeAreaView>
      <Stack />
    </ScrollView>
  );
};

export default App;
