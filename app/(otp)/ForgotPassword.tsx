import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';
import Header from '@/components/Header';
import Input from '@/components/login/Input';
import CustomButton from '@/components/CustomButton';
import ToastService from '@/constants/ToastService';
import usePasswordReset from '@/hooks/usePasswordReset';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { width } = useWindowDimensions();
  const { t } = useTranslation(['auth', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);
  const { loading, error, requestPasswordReset } = usePasswordReset();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      ToastService.error(t('auth:validationError'), t('auth:emailRequired'));
      return;
    }

    if (!validateEmail(email)) {
      ToastService.error(
        t('auth:validationError'),
        t('validation:invalidEmail'),
      );
      return;
    }

    const success = await requestPasswordReset(email);

    if (success) {
      setIsSubmitted(true);
      ToastService.success(
        t('auth:resetLinkSent'),
        t('auth:checkEmailForLink'),
      );
    } else {
      ToastService.error(
        t('auth:passwordResetFailed'),
        error || 'Failed to send reset email',
      );
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  if (isSubmitted) {
    return (
      <ScrollView className="bg-white h-full">
        <Header />
        <View className="flex-1 items-center justify-center px-6 py-20">
          <View
            className="relative items-center justify-center mb-8"
            style={{ width: width * 0.3, height: width * 0.3 }}
          >
            <Image
              source={require('../../assets/images/circle.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
            <Image
              source={require('../../assets/images/check.png')}
              style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
              }}
              resizeMode="contain"
            />
          </View>

          <Text className={`text-2xl font-bold text-center mb-4 ${textStyle}`}>
            {t('auth:resetLinkSent')}
          </Text>

          <Text className={`text-gray-600 text-center mb-8 px-4 ${textStyle}`}>
            {t('auth:checkEmailForLink')}
          </Text>

          <CustomButton
            title={t('auth:backToLogin')}
            containerStyles="bg-[#FDBD10] p-4 rounded-lg w-full shadow-md"
            textStyles="font-medium text-[21px]"
            onPress={handleBackToLogin}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="bg-white h-full">
      <Header />
      <View className={`px-6 ${isRTL ? 'items-end' : 'items-start'}`}>
        <Text className={`text-3xl mt-6 font-medium ${textStyle}`}>
          {t('auth:requestPasswordReset')}
        </Text>

        <Text className={`text-gray-600 mt-3 mb-8 ${textStyle}`}>
          {t('auth:enterEmailForReset')}
        </Text>

        <View className="flex flex-col items-center mt-5 w-full">
          <Input
            label={t('auth:email')}
            placeholder={t('auth:enterEmail')}
            isPassword={false}
            value={email}
            onChangeText={setEmail}
            error={false}
            errorMessage=""
            isRTL={isRTL}
          />

          <CustomButton
            title={t('auth:sendResetLink')}
            containerStyles="mt-8 bg-[#FDBD10] p-4 rounded-lg w-full shadow-md"
            textStyles="font-medium text-[21px]"
            onPress={handleSubmit}
            disabled={loading}
          />

          <CustomButton
            title={t('auth:backToLogin')}
            containerStyles="mt-4 bg-transparent border border-gray-300 p-4 rounded-lg w-full"
            textStyles="font-medium text-[18px] text-gray-700"
            onPress={handleBackToLogin}
          />
        </View>
      </View>
    </ScrollView>
  );
}
