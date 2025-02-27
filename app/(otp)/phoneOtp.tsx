import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import CustomButton from "@/components/CustomButton";

const PhoneOtp = () => {
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
        {/* Previous code remains the same until Enter Mobile number text */}
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

        <Text className="text-center mt-[51px] text-[28px] font-Roboto-SemiBold text-[#030B19]"> 
          Phone Number
        </Text>

        <View className="mt-[29px] px-6">
          <Text className="text-center text-[18px] font-Roboto text-[#363E4C]">
            Please enter your phone number to{'\n'}
            receive 4-digit verification code for{'\n'}
            authentication
          </Text>
        </View>
        <Text className="text-center mt-[35px] text-[18px] font-Roboto text-[#676B73]">
          Enter Mobile number
        </Text>

        <View className="items-center mt-[3px]">
          <TextInput
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            className="text-[22px] font-Roboto-SemiBold text-center w-[185px] text-[#363E4C]"
            keyboardType="phone-pad"
          />
          <View className={`h-[1px] w-[185px] ${isValidPhone ? 'bg-[#147E93]' : 'bg-[#363E4C]'}`} />
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
  );
};

export default PhoneOtp;
