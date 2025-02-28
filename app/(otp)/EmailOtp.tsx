import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import CustomButton from "@/components/CustomButton";

const EmailOtp = () => {
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0) {
      if (!validateEmail(text)) {
        setError('Please enter a valid email address');
        setIsValidEmail(false);
      } else {
        setError('');
        setIsValidEmail(true);
      }
    } else {
      setError('');
      setIsValidEmail(false);
    }
  };

  const handleGetCode = () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    router.replace({
      pathname: "/(otp)/EmailOtp-2",
      params: { email: email }
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 bg-white">

          <TouchableOpacity 
            className="mt-12 ml-6" 
            onPress={() => router.replace("/(otp)/VerificationOptions")}
          >
            <Image 
              source={require('../../assets/images/back-Icon.png')}
              style={{ width: width * 0.035, height: height * 0.03 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View className="items-center mt-3">
            <Image 
              source={require('../../assets/images/OTP.png')}
              style={{ width: width * 0.6, height: height * 0.25 }}
              resizeMode="contain"
            />
          </View>

          <Text className="text-center mt-8 text-2xl font-Roboto-SemiBold text-[#030B19]"> 
            Email
          </Text>

          <View className="mt-6 px-6">
            <Text className="text-center text-base font-Roboto text-[#363E4C]">
              Please enter your email to receive 4-digit{'\n'}verification code for authentication
            </Text>
          </View>

          <Text className="text-center mt-6 text-base font-Roboto text-[#676B73]">
            Enter Email
          </Text>
          <View className="items-center mt-1">
            <TextInput
              value={email}
              onChangeText={handleEmailChange}
              className="text-lg font-Roboto-SemiBold text-center text-[#363E4C]"
              style={{ width: width * 0.5 }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View 
              className={`h-[1px] ${isValidEmail ? 'bg-[#147E93]' : 'bg-[#363E4C]'}`}
              style={{ width: width * 0.5 }}
            />
            {error ? (
              <Text className="text-red-500 text-sm font-Roboto mt-1">
                {error}
              </Text>
            ) : null}
          </View>

          <CustomButton
            onPress={handleGetCode}
            title="Get code"
            containerStyles={`mx-auto mt-6 w-[90%] py-3 rounded-lg bg-[#FDBC10] justify-center items-center mb-6`}
            textStyles={`text-[${width * 0.055}px] text-[#030B19] font-Roboto-SemiBold`}
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
    </KeyboardAvoidingView>
  );
};

export default EmailOtp;
