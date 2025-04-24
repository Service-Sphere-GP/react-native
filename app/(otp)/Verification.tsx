import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import CustomButton from '@/components/CustomButton';
import OtpInput from '@/components/OtpInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
// Import translation hook
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

const Verification = () => {
  const { width, height } = useWindowDimensions();
  const [otp, setOtp] = useState('');
  const [showError, setShowError] = useState(false);
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  // Add translation and language context
  const { t } = useTranslation(['auth', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setEmail(parsedUser.email);
          setId(parsedUser._id);
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

  const handleOtpComplete = (code: string) => {
    setOtp(code);
    setShowError(false);
  };

  const handleConfirmCode = () => {
    ApiService.post(API_ENDPOINTS.VERIFY_EMAIL.replace(':id', id as string), {
      otp,
    })
      .then((response: any) => {
        if (response.data.status === 'success') {
          router.replace('/RegistrationSuccess');
        } else {
          setShowError(true);
        }
      })
      .catch(() => {
        setShowError(true);
      });
  };

  const handleResend = () => {
    setShowError(false);
    setOtp('');
    ApiService.post(API_ENDPOINTS.RESEND_OTP, { email })
      .then((response: any) => {
        if (response.data.status === 'success') {
          console.log('OTP sent successfully');
        }
      })
      .catch(() => {
        console.error('Failed to resend OTP');
      });
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 bg-white">
        <TouchableOpacity
          className={`mt-12 ${isRTL ? 'mr-6' : 'ml-6'}`}
          onPress={() => router.replace('/(otp)/customer/register')}
        >
          <Image
            source={require('@/assets/images/back-Icon.png')}
            style={{ 
              width: width * 0.035, 
              height: height * 0.03,
              transform: [{ scaleX: isRTL ? -1 : 1 }] 
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View className="items-center mt-3">
          <Image
            source={require('@/assets/images/OTP.png')}
            style={{ width: width * 0.6, height: height * 0.25 }}
            resizeMode="contain"
          />
        </View>

        <Text 
          className={`text-center mt-8 text-2xl text-[#030B19] font-semibold`}
          style={textStyle.style}
        >
          {t('auth:verification')}
        </Text>

        <View className="mt-6 px-6">
          <Text 
            className={`text-center text-base text-[#363E4C] `}
            style={textStyle.style}
          >
            {t('auth:enterCodeSentTo')} {'\n'}
            <Text 
              className={`text-base text-[#3A3A3A] font-bold`}
              style={textStyle.style}
            >
              {email}
            </Text>
          </Text>
        </View>
        <View className="mt-5">
          <OtpInput onComplete={handleOtpComplete} />
        </View>

        {showError && (
          <View className={`items-center px-6 mt-4 justify-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Image
              source={require('@/assets/images/xicon.png')}
              style={{ width: width * 0.04, height: width * 0.04 }}
              resizeMode="contain"
              className={isRTL ? 'ml-2' : 'mr-2'}
            />
            <Text 
              className={`text-red-500 text-sm`}
              style={textStyle.style}
            >
              {t('auth:incorrectCode')}{'\n'}{t('auth:tryAgainOrResend')}
            </Text>
          </View>
        )}

        <View className="mt-4">
          <Text 
            className={`text-center text-sm `}
            style={textStyle.style}
          >
            <Text className={`text-[#3A3A3A]`} style={textStyle.style}>
              {t('auth:didntReceiveCode')}{' '}
            </Text>
            <Text 
              className={`text-[#147E93] underline`}
              onPress={handleResend}
              style={textStyle.style}
            >
              {t('auth:resendCode')}
            </Text>
          </Text>
        </View>

        <CustomButton
          onPress={handleConfirmCode}
          title={t('auth:confirmCode')}
          containerStyles={`mx-auto mt-6 !w-[85%] py-3 rounded-lg bg-[#FDBC10] justify-center items-center`}
          textStyles={`text-xl text-[#030B19] font-semibold`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 6,
          }}
        />
      </View>
    </ScrollView>
  );
};

export default Verification;
