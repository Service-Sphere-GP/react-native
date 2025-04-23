import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import CustomButton from '@/components/CustomButton';
import Header from '@/components/login/Header';
import Input from '@/components/login/Input';
import { Link } from 'expo-router';
import useLogin from '@/hooks/useLogin';
import { useRouter } from 'expo-router';
import ToastService from '../../../constants/ToastService';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';

const Login = () => {
  const { t } = useTranslation(['auth', 'common']);
  const { isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
  });

  const { login, loading } = useLogin();

  const validateForm = (user: { email: string; password: string }) => {
    const errors = {
      email: '',
      password: '',
    };

    if (!user.email) {
      errors.email = t('auth:emailRequired');
    }

    if (!user.password) {
      errors.password = t('auth:passwordRequired');
    }

    return errors;
  };

  const handleLogin = async () => {
    const errors = validateForm({ email, password });
    setErrorMessages(errors);

    const hasErrors = Object.values(errors).some((error) => error.length > 0);
    if (hasErrors) {
      const errorMessage =
        Object.values(errors).find((error) => error.length > 0) ||
        'Please check your input';
      ToastService.error('Validation Error', errorMessage);
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        ToastService.success(t('auth:loginSuccess'), t('auth:welcomeBack'));
        router.push('/services');
      }
    } catch (err) {
      console.error('Login error:', err);
      ToastService.error(
        'Login Failed',
        'Please check your credentials and try again',
      );
    }
  };

  const containerStyle = [
    styles.container,
    isRTL && styles.containerRTL
  ];

  return (
    <ScrollView className="bg-white h-full" style={containerStyle}>
      <Header />
      <View className="px-3">
        <Text className={`text-3xl font-Roboto-Medium mt-3 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('auth:login')}
        </Text>
        <Text
          className={`font-Roboto-Light text-black/70 text-base my-5 ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ lineHeight: 20 }}
        >
          {t('auth:welcomeBack')}
        </Text>
        <Input
          label={t('auth:email')}
          placeholder={t('auth:enterEmail')}
          isPassword={false}
          value={email}
          onChangeText={setEmail}
          error={errorMessages.email ? true : false}
          errorMessage={errorMessages.email ? errorMessages.email : ''}
          isRTL={isRTL}
        />
        <Input
          label={t('auth:password')}
          placeholder={t('auth:enterPassword')}
          isPassword={true}
          value={password}
          onChangeText={setPassword}
          error={errorMessages.password ? true : false}
          errorMessage={errorMessages.password ? errorMessages.password : ''}
          isRTL={isRTL}
        />
        <Text className={`font-Roboto-Light text-black/70 text-base mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('auth:forgotPassword')}{' '}
          <Text className="text-[#147E93] underline font-Roboto-Medium">
            {t('auth:resetPassword')}
          </Text>
        </Text>

        <CustomButton
          title={t('auth:login')}
          containerStyles="mt-5 bg-[#FDBD10] p-4 rounded-lg w-full shadow-md"
          textStyles="font-medium text-[21px]"
          onPress={handleLogin}
          disabled={loading}
        />

        <View className="flex-row items-center justify-center my-5">
          <Text className="font-Roboto-Light text-black/70 text-base">
            {t('auth:noAccount')}{' '}
            <Link
              href="/(otp)/customer/register"
              className="text-[#147E93] underline font-Roboto-Medium"
            >
              {t('auth:register')}
            </Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    textAlign: 'left',
    direction: 'ltr',
  },
  containerRTL: {
    textAlign: 'right',
    direction: 'rtl',
  }
});

export default Login;
