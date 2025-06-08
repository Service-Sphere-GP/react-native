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
import Header from '@/components/login/Header';
import Input from '@/components/login/Input';
import CustomButton from '@/components/CustomButton';
import ToastService from '@/constants/ToastService';
import usePasswordReset from '@/hooks/usePasswordReset';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const { token } = useLocalSearchParams<{ token: string }>();
  const { width } = useWindowDimensions();
  const { t } = useTranslation(['auth', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);
  const { loading, error, resetPassword } = usePasswordReset();

  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Validate token presence
    if (!token) {
      setIsTokenValid(false);
      ToastService.error(
        t('auth:invalidResetToken'),
        'No reset token provided',
      );
    }
  }, [token, t]);

  const validatePasswords = () => {
    const newErrors = {
      newPassword: '',
      confirmPassword: '',
    };

    if (!newPassword) {
      newErrors.newPassword = t('auth:passwordRequired');
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t('auth:passwordLengthError');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('validation:required', {
        field: t('auth:confirmPassword'),
      });
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('auth:passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error.length > 0);
  };

  const handleSubmit = async () => {
    if (!validatePasswords()) {
      const firstError = Object.values(errors).find(
        (error) => error.length > 0,
      );
      ToastService.error(
        t('auth:validationError'),
        firstError || 'Please check your input',
      );
      return;
    }

    if (!token) {
      ToastService.error(t('auth:invalidResetToken'), 'Invalid reset token');
      return;
    }

    const success = await resetPassword(token, newPassword, confirmPassword);

    if (success) {
      setIsCompleted(true);
      ToastService.success(
        t('auth:passwordResetSuccess'),
        'You can now login with your new password',
      );
    } else {
      if (
        error?.includes('Invalid token') ||
        error?.includes('Expired token')
      ) {
        setIsTokenValid(false);
      }
      ToastService.error(
        t('auth:passwordResetFailed'),
        error || 'Failed to reset password',
      );
    }
  };

  const handleBackToLogin = () => {
    router.replace('/(otp)/customer/login');
  };

  if (!isTokenValid) {
    return (
      <ScrollView className="bg-white h-full">
        <Header />
        <View className="flex-1 items-center justify-center px-6 py-20">
          <View
            className="relative items-center justify-center mb-8"
            style={{ width: width * 0.3, height: width * 0.3 }}
          >
            <Image
              source={require('../../../assets/images/xicon.png')}
              style={{ width: '60%', height: '60%' }}
              resizeMode="contain"
            />
          </View>

          <Text
            className={`text-2xl font-bold text-center mb-4 text-red-600 ${textStyle.className}`}
          >
            {t('auth:invalidResetToken')}
          </Text>

          <Text
            className={`text-gray-600 text-center mb-8 px-4 ${textStyle.className}`}
          >
            This reset link is invalid or has expired. Please request a new
            password reset link.
          </Text>

          <CustomButton
            title={t('auth:requestPasswordReset')}
            containerStyles="bg-[#FDBD10] p-4 rounded-lg w-full shadow-md mb-4"
            textStyles="font-medium text-[21px]"
            onPress={() => router.replace('/(otp)/forgot-password')}
          />

          <CustomButton
            title={t('auth:backToLogin')}
            containerStyles="bg-transparent border border-gray-300 p-4 rounded-lg w-full"
            textStyles="font-medium text-[18px] text-gray-700"
            onPress={handleBackToLogin}
          />
        </View>
      </ScrollView>
    );
  }

  if (isCompleted) {
    return (
      <ScrollView className="bg-white h-full">
        <Header />
        <View className="flex-1 items-center justify-center px-6 py-20">
          <View
            className="relative items-center justify-center mb-8"
            style={{ width: width * 0.3, height: width * 0.3 }}
          >
            <Image
              source={require('../../../assets/images/circle.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
            <Image
              source={require('../../../assets/images/check.png')}
              style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
              }}
              resizeMode="contain"
            />
          </View>

          <Text
            className={`text-2xl font-bold text-center mb-4 ${textStyle.className}`}
          >
            {t('auth:passwordResetSuccess')}
          </Text>

          <Text
            className={`text-gray-600 text-center mb-8 px-4 ${textStyle.className}`}
          >
            Your password has been successfully reset. You can now login with
            your new password.
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
        <Text className={`text-3xl mt-6 font-medium ${textStyle.className}`}>
          {t('auth:resetYourPassword')}
        </Text>

        <Text className={`text-gray-600 mt-3 mb-8 ${textStyle.className}`}>
          {t('auth:enterNewPassword')}
        </Text>

        <View className="flex flex-col items-center mt-5 w-full">
          <Input
            label={t('auth:newPassword')}
            placeholder={t('auth:enterPassword')}
            isPassword={true}
            value={newPassword}
            onChangeText={setNewPassword}
            error={!!errors.newPassword}
            errorMessage={errors.newPassword}
            isRTL={isRTL}
          />

          <Input
            label={t('auth:confirmNewPassword')}
            placeholder={t('auth:reEnterPassword')}
            isPassword={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
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
