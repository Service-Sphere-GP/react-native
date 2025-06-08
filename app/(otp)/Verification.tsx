import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
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
  const [showErrorMessage, setShowErrorMessage] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');

  // OTP attempt tracking
  const [attemptCount, setAttemptCount] = useState(0);
  const [maxAttempts] = useState(5);
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isOtpLocked, setIsOtpLocked] = useState(false);

  // Add translation and language context
  const { t } = useTranslation(['auth', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  // Timer ref for cooldown
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setEmail(parsedUser.email);
          setId(parsedUser._id);
          console.log('📧 User loaded for verification:', {
            email: parsedUser.email,
            userId: parsedUser._id,
          });
        } else {
          console.log('❌ No user data found, redirecting to login');
          setTimeout(() => {
            router.push('/(otp)/customer/login');
          }, 100);
        }
      } catch (error) {
        console.error('❌ Failed to fetch user data:', error);
        setTimeout(() => {
          router.push('/(otp)/customer/login');
        }, 100);
      }
    };

    checkUser();
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimer.current) {
        clearInterval(cooldownTimer.current);
      }
    };
  }, []);

  const startResendCooldown = () => {
    console.log('⏰ Starting 60-second resend cooldown');
    setCanResend(false);
    setResendCooldown(60);

    cooldownTimer.current = setInterval(() => {
      setResendCooldown((prev) => {
        const newCooldown = prev - 1;
        console.log(`⏰ Resend cooldown: ${newCooldown} seconds remaining`);

        if (newCooldown <= 0) {
          console.log('✅ Resend cooldown completed');
          setCanResend(true);
          if (cooldownTimer.current) {
            clearInterval(cooldownTimer.current);
          }
          return 0;
        }
        return newCooldown;
      });
    }, 1000);
  };

  const handleOtpComplete = (code: string) => {
    console.log('🔢 OTP entered:', code);
    setOtp(code);
    setShowError(false);
    setShowErrorMessage('');
  };

  const handleConfirmCode = () => {
    if (isOtpLocked) {
      console.log('🔒 OTP verification locked due to max attempts');
      setShowError(true);
      setShowErrorMessage(
        'Too many failed attempts. Please request a new OTP.',
      );
      return;
    }

    console.log('🔍 Verifying OTP:', {
      otp,
      attempt: attemptCount + 1,
      remainingAttempts: maxAttempts - attemptCount - 1,
      userId: id,
    });

    ApiService.post(API_ENDPOINTS.VERIFY_EMAIL.replace(':id', id as string), {
      otp,
    })
      .then((response: any) => {
        console.log('✅ OTP verification response:', response.data);

        if (response.data.status === 'success') {
          console.log(
            '🎉 OTP verification successful, redirecting to success page',
          );
          router.replace('/RegistrationSuccess');
        } else {
          console.log('❌ OTP verification failed');
          handleFailedAttempt('Invalid OTP code');
        }
      })
      .catch((error) => {
        console.error(
          '❌ OTP verification error:',
          error.response?.data || error.message,
        );

        const errorMessage =
          error.response?.data?.message || 'Verification failed';

        if (
          error.response?.data?.message?.includes('Too many failed attempts')
        ) {
          console.log('🔒 Backend reported max attempts reached');
          setIsOtpLocked(true);
          setShowErrorMessage(
            'Too many failed attempts. Please request a new OTP.',
          );
        } else {
          handleFailedAttempt(errorMessage);
        }

        setShowError(true);
      });
  };

  const handleFailedAttempt = (errorMessage: string) => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    const remainingAttempts = maxAttempts - newAttemptCount;

    console.log('❌ Failed OTP attempt:', {
      attemptNumber: newAttemptCount,
      remainingAttempts,
      errorMessage,
    });

    if (remainingAttempts <= 0) {
      console.log('🔒 Maximum attempts reached, locking OTP verification');
      setIsOtpLocked(true);
      setShowErrorMessage(
        'Maximum attempts reached. Please request a new OTP.',
      );
    } else {
      setShowErrorMessage(
        `${errorMessage}. ${remainingAttempts} attempts remaining.`,
      );
    }
  };

  const handleResend = () => {
    if (!canResend) {
      console.log(
        '⏰ Resend blocked due to cooldown:',
        resendCooldown,
        'seconds remaining',
      );
      return;
    }

    console.log('📤 Resending OTP to:', email);

    setShowError(false);
    setShowErrorMessage('');
    setOtp('');

    // Reset attempt tracking for new OTP
    setAttemptCount(0);
    setIsOtpLocked(false);

    console.log('🔄 Reset attempt counter and OTP lock status');

    ApiService.post(API_ENDPOINTS.RESEND_OTP, { email })
      .then((response: any) => {
        console.log('✅ OTP resend response:', response.data);

        if (response.data.status === 'success') {
          console.log('📧 OTP resent successfully');
          startResendCooldown();
        }
      })
      .catch((error) => {
        console.error(
          '❌ OTP resend error:',
          error.response?.data || error.message,
        );

        const errorMessage =
          error.response?.data?.message || 'Failed to resend OTP';

        if (errorMessage.includes('wait') && errorMessage.includes('minutes')) {
          console.log('⏰ Backend cooldown detected:', errorMessage);
          setShowErrorMessage(errorMessage);
          setShowError(true);
        } else {
          console.log('❌ General resend error:', errorMessage);
          setShowErrorMessage(errorMessage);
          setShowError(true);
        }
      });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 bg-white">
        {/* Removed back button - user must complete verification */}

        <View className="items-center mt-16">
          <Image
            source={require('@/assets/images/OTP.png')}
            style={{ width: width * 0.6, height: height * 0.25 }}
            resizeMode="contain"
          />
        </View>

        <Text
          className={`text-center mt-8 text-2xl text-[#030B19] font-semibold`}
        >
          {t('auth:verification')}
        </Text>

        <View className="mt-6 px-6">
          <Text className={`text-center text-base text-[#363E4C] `}>
            {t('auth:enterCodeSentTo')} {'\n'}
            <Text className={`text-base text-[#3A3A3A] font-bold`}>
              {email}
            </Text>
          </Text>
        </View>

        {/* Attempt counter display */}
        {attemptCount > 0 && !isOtpLocked && (
          <View className="mt-3 px-6">
            <Text className="text-center text-sm text-orange-600">
              Attempts: {attemptCount}/{maxAttempts}
            </Text>
          </View>
        )}

        <View className="mt-5">
          <OtpInput onComplete={handleOtpComplete} />
        </View>

        {showError && (
          <View
            className={`items-center px-6 mt-4 justify-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <Image
              source={require('@/assets/images/xicon.png')}
              style={{ width: width * 0.04, height: width * 0.04 }}
              resizeMode="contain"
              className={isRTL ? 'ml-2' : 'mr-2'}
            />
            <Text className={`text-red-500 text-sm text-center`}>
              {showErrorMessage ||
                `${t('auth:incorrectCode')}\n${t('auth:tryAgainOrResend')}`}
            </Text>
          </View>
        )}

        <View className="mt-4">
          <Text className={`text-center text-sm `}>
            <Text className={`text-[#3A3A3A]`}>
              {t('auth:didntReceiveCode')}{' '}
            </Text>
            {canResend ? (
              <Text
                className={`text-[#147E93] underline`}
                onPress={handleResend}
              >
                {t('auth:resendCode')}
              </Text>
            ) : (
              <Text className={`text-gray-400`}>
                Resend in {formatTime(resendCooldown)}
              </Text>
            )}
          </Text>
        </View>

        <CustomButton
          onPress={handleConfirmCode}
          title={t('auth:confirmCode')}
          containerStyles={`mx-auto mt-6 !w-[85%] py-3 rounded-lg ${
            isOtpLocked ? 'bg-gray-400' : 'bg-[#FDBC10]'
          } justify-center items-center`}
          textStyles={`text-xl text-[#030B19] font-semibold`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 6,
          }}
        />

        {isOtpLocked && (
          <View className="mt-3 px-6">
            <Text className="text-center text-sm text-red-600">
              Verification locked. Please request a new OTP to continue.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Verification;
