import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';
import Header from '@/components/Header';
import Input from '@/components/login/Input';
import CustomButton from '@/components/CustomButton';
import ToastService from '@/constants/ToastService';
import usePasswordReset from '@/hooks/usePasswordReset';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const { width } = useWindowDimensions();
  const { t } = useTranslation(['auth', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);
  const { loading, error, resetPassword } = usePasswordReset();
  const { token } = useLocalSearchParams<{ token: string }>();

  useEffect(() => {
    if (!token) {
      ToastService.error(
        t('auth:passwordResetFailed'),
        t('auth:invalidResetToken'),
      );
      router.replace('/(otp)/customer/login');
    }
  }, [token]);

  const validateForm = () => {
    const errors = {
      newPassword: '',
      confirmPassword: '',
    };

    if (!newPassword) {
      errors.newPassword = t('validation:required', {
        field: t('auth:newPassword'),
      });
    } else if (newPassword.length < 8) {
      errors.newPassword = t('auth:passwordLengthError');
    }

    if (!confirmPassword) {
      errors.confirmPassword = t('validation:required', {
        field: t('auth:confirmPassword'),
      });
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = t('auth:passwordsDoNotMatch');
    }

    setErrorMessages(errors);
    return Object.values(errors).every((error) => error === '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!token) {
      ToastService.error(
        t('auth:passwordResetFailed'),
        t('auth:invalidResetToken'),
      );
      return;
    }

    const success = await resetPassword(token, newPassword, confirmPassword);

    if (success) {
      setIsSuccess(true);
      ToastService.success(
        t('auth:passwordResetSuccess'),
        'You can now login with your new password',
      );
    } else {
      ToastService.error(
        t('auth:passwordResetFailed'),
        error || 'Failed to reset password',
      );
    }
  };

  const handleBackToLogin = () => {
    router.replace('/(otp)/customer/login');
  };

  if (isSuccess) {
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
            {t('auth:passwordResetSuccess')}
          </Text>

          <Text className={`text-gray-600 text-center mb-8 px-4 ${textStyle}`}>
            You can now login with your new password
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
          {t('auth:resetYourPassword')}
        </Text>

        <Text className={`text-gray-600 mt-3 mb-8 ${textStyle}`}>
          {t('auth:enterNewPassword')}
        </Text>

        <View className="flex flex-col items-center mt-5 w-full">
          <Input
            label={t('auth:newPassword')}
            placeholder={t('auth:enterNewPassword')}
            isPassword={true}
            value={newPassword}
            onChangeText={setNewPassword}
            error={errorMessages.newPassword ? true : false}
            errorMessage={errorMessages.newPassword}
            isRTL={isRTL}
          />

          <Input
            label={t('auth:confirmPassword')}
            placeholder={t('auth:confirmNewPassword')}
            isPassword={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errorMessages.confirmPassword ? true : false}
            errorMessage={errorMessages.confirmPassword}
            isRTL={isRTL}
          />

          <CustomButton
            title={t('auth:resetPassword')}
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
