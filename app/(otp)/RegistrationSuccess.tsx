import { View, Image, useWindowDimensions, Text } from 'react-native';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

const RegistrationSuccess = () => {
  const { width } = useWindowDimensions();
  const [role, setRole] = useState('');
  const { t } = useTranslation(['auth', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setRole(parsedUser.role);
        } else {
          setTimeout(() => {
            router.push('/(otp)/customer/login');
          }, 100);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setTimeout(() => {
          router.push('/(otp)/customer/login');
        }, 100);
      }
    };

    checkUser();
  }, []);

  const handleGetStarted = () => {
    if (role === 'PROVIDER') {
      router.replace('/(tabs)/profile/me');
    } else {
      router.replace('/(tabs)/services');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <View
          className="relative items-center justify-center"
          style={{ width: width * 0.35, height: width * 0.35 }}
        >
          <Image
            source={require('../../assets/images/circle.png')}
            style={{ width: width * 0.35, height: width * 0.35 }}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/images/check.png')}
            style={{
              width: width * 0.2,
              height: width * 0.15,
              position: 'absolute',
            }}
            resizeMode="contain"
          />
        </View>

        <Text
          className="mt-8 text-[#030B19] text-center font-bold"
          style={{ fontSize: width * 0.06, ...textStyle.style }}
        >
          {t('auth:registrationCompleted')}
        </Text>

        <Text
          className={`mt-6 text-[#363E4C] px-8  ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ fontSize: width * 0.04, ...textStyle.style }}
        >
          {t('auth:congratsRegistration')}
          {'\n'}
          {t('auth:allSetToExplore')}
          {'\n'}
          {t('auth:clickBelowForHomepage')}
          {'\n'}
        </Text>

        <View className="w-full px-6 mt-12">
          <CustomButton
            onPress={handleGetStarted}
            title={t('auth:getStarted')}
            containerStyles="mx-auto w-full py-3 rounded-lg bg-[#FDBC10] justify-center items-center"
            textStyles="text-xl text-[#030B19] font-semibold"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 6,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default RegistrationSuccess;
