import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import CustomButton from "@/components/CustomButton";
const EmailOtp = () => {
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
            className="mt-16 ml-[22px]" 
            onPress={() => router.replace("/(otp)/VerificationOptions")}
          >
            <Image 
              source={require('../../assets/images/back-Icon.png')}
              className="w-[13px] h-[26px]"
            />
          </TouchableOpacity>

          <View className="items-center mt-[10px]">
            <Image 
              source={require('../../assets/images/OTP.png')}
              className="w-[232.87px] h-[243.31px]"
            />
          </View>

          <Text className="text-center mt-[41px] text-[28px] font-Roboto-SemiBold text-[#030B19]"> 
            Email
          </Text>

          <View className="mt-[29px] px-6">
            <Text className="text-center text-[18px] font-Roboto text-[#363E4C]">
              Please enter your email to receive 4-digit{'\n'}verification code for authentication
            </Text>
          </View>

          <Text className="text-center mt-[30px] text-[18px] font-Roboto text-[#676B73] " >
            Enter Email
          </Text>
          <View className="items-center mt-[3px]">
            <TextInput
              value={email}
              onChangeText={handleEmailChange}
              className="text-[22px] font-Roboto-SemiBold text-center w-[185px] text-[#363E4C]"
              keyboardType="email-address"
              autoCapitalize="none"

            />
<View className={`h-[1px] w-[185px] ${isValidEmail ? 'bg-[#147E93]' : 'bg-[#363E4C]'}`} />
            {error ? (
              <Text className="text-red-500 text-[14px] font-Roboto mt-1">
                {error}
              </Text>
            ) : null}
          </View>

          <CustomButton
            onPress={handleGetCode}
            title="Get code"
            containerStyles="mx-auto mt-[18px] w-[345px] h-[56px] rounded-[10px] bg-[#FDBC10] justify-center items-center mb-6"
            textStyles="text-[21px] text-[#030B19] font-Roboto-SemiBold"
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
