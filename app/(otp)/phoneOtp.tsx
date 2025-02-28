import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import CustomButton from "@/components/CustomButton";

const PhoneOtp = () => {
  const { width, height } = useWindowDimensions();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(false);

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(number);
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    if (text.length > 0) {
      if (!validatePhoneNumber(text)) {
        setError('Please enter a valid phone number');
        setIsValidPhone(false);
      } else {
        setError('');
        setIsValidPhone(true);
      }
    } else {
      setError('');
      setIsValidPhone(false);
    }
  };

  const handleGetCode = () => {
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }
    router.replace({
      pathname: "/(otp)/phoneOtp-2",
      params: { phoneNumber: phoneNumber }
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
          Phone Number
        </Text>

        <View className="mt-6 px-6">
          <Text className="text-center text-base font-Roboto text-[#363E4C]">
            Please enter your phone number to{'\n'}
            receive 4-digit verification code for{'\n'}
            authentication
          </Text>
        </View>
        <Text className="text-center mt-8 text-base font-Roboto text-[#676B73]">
          Enter Mobile number
        </Text>

        <View className="items-center mt-1">
          <TextInput
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            className="text-xl font-Roboto-SemiBold text-center w-1/2 text-[#363E4C]"
            keyboardType="phone-pad"
          />
          <View className={`h-px w-1/2 ${isValidPhone ? 'bg-[#147E93]' : 'bg-[#363E4C]'}`} />
          {error ? (
            <Text className="text-red-500 text-sm font-Roboto mt-1">
              {error}
            </Text>
          ) : null}
        </View>

        <CustomButton
          onPress={handleGetCode}
          title="Get code"
          containerStyles="mx-auto mt-5 w-[90%] py-3 rounded-lg bg-[#FDBC10] justify-center items-center mb-6"
          textStyles="text-xl text-[#030B19] font-Roboto-SemiBold"
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

export default PhoneOtp;
