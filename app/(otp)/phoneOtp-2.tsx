import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import CustomButton from "@/components/CustomButton";
import OtpInput from "@/components/OtpInput";

const PhoneOtp2 = () => {
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [showError, setShowError] = useState(false);

  const handleOtpComplete = (code: string) => {
    setOtp(code);
    setShowError(false);
  };

  const handleConfirmCode = () => {
    if (otp.length === 4) {
      router.replace("/(otp)/RegistrationSuccess");
    } else {
      setShowError(true);
    }
  };

  const handleResend = () => {
    setShowError(false);
    setOtp('');
  };

  return (
    <ScrollView 
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 bg-white">
        <TouchableOpacity 
          className="mt-20 ml-[22px]" 
          onPress={() => router.replace("/(otp)/phoneOtp")}
        >
          <Image 
            source={require('../../assets/images/back-Icon.png')}
            className="w-[13px] h-[26px]"
          />
        </TouchableOpacity>

        <View className="items-center mt-[11px]">
          <Image 
            source={require('../../assets/images/OTP.png')}
            className="w-[232.87px] h-[243.31px]"
          />
        </View>

        <Text className="text-center mt-[46px] text-[28px] font-Roboto-SemiBold text-[#030B19]"> 
          Phone Number
        </Text>

        <View className="mt-[35px] px-6">
          <Text className="text-center text-[18px] font-Roboto text-[#363E4C]">
            Enter the code sent to {'\n'}
            <Text className="text-[18px] font-Roboto-Bold text-[#3A3A3A]">
              {phoneNumber}
            </Text>
          </Text>
        </View>

        <View className="mt-[18px]">
          <OtpInput onComplete={handleOtpComplete} />
        </View>

        {showError && (
          <View className="flex-row items-center ml-[45px] mt-[15px]">
            <Image 
              source={require('../../assets/images/xicon.png')}
              className="w-[15.75px] h-[15.75px] mr-2 mb-4"
            />
            <Text className="text-red-500 text-[15px] font-Roboto">
              The code you entered is incorrect{'\n'}Please try again or resend code
            </Text>
          </View>
        )}

        <View className="mt-[15px]">
          <Text className="text-center text-[15px] font-Roboto">
            <Text className="text-[#3A3A3A]">Didn't you receive the Number? </Text>
            <Text 
              className="text-[#147E93] underline"
              onPress={handleResend}
            >
              Resend Number
            </Text>
          </Text>
        </View>

        <CustomButton
          onPress={handleConfirmCode}
          title="Confirm Code"
          containerStyles={`mx-auto mt-[26px] w-[333px] h-[56px] rounded-[10px] justify-center items-center bg-[#FDBC10]`}
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

export default PhoneOtp2;
