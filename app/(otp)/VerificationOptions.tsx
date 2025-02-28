import { View, Text, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import EmailIcon from "@/assets/icons/EmailIcon";

const VerificationScreen = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<"email" | "phone" | null>(null);

  const handleConfirm = () => {
    if (selectedOption === "email") {
      router.push("/(otp)/EmailOtp");
    } else if (selectedOption === "phone") {
      router.push("/(otp)/phoneOtp");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 relative">
      {/* Header */}
      <View 
        className="w-[338px] h-[33px] flex-row items-center justify-center mt-[57px] ml-[14px] relative"
      >
        {/* Left Icon */}
        <Pressable 
          onPress={() => router.replace("/(tabs)")} 
          className="absolute left-0"
        >
          <Image 
            source={require("@/assets/images/back-Icon.png")} 
            className="w-[13px] h-[26px]" 
            resizeMode="contain"
          />
        </Pressable>

        {/* Title */}
        <Text className="text-[28px] font-Roboto-SemiBold text-[#030B19]">
          Verification Options
        </Text>
      </View>

      {/* Subtitle */}
      <View className="w-[340px] h-[40px] mt-[43px] ml-[9px]">
        <Text className="text-[15px] font-Roboto text-[#363E4C] text-left">
          Choose your preferred method to receive the verification code
        </Text>
      </View>

      {/* Options */}
      <View className="mt-[34px]">
        {/* Email Option */}
        <Pressable 
          onPress={() => setSelectedOption("email")}
          className={`w-[358px] h-[80px] border rounded-[10px] flex-row items-center px-4 ${
            selectedOption === "email" ? "border-[#147E93] border-2"  : "border-[#676B73]"
          }`}
          style={{ marginBottom: 9 }}
        >
          <EmailIcon color={selectedOption === "email" ? "#147E93" : "#676B73"} />
          <View style={{ marginLeft: 16 }}>
            <Text className="text-[22px] font-Roboto-SemiBold text-black">
              Email
            </Text>
            <Text className="text-[14px] font-Roboto text-[#676B73]" style={{ marginTop: 6 }}>
              Receive Verification code via email
            </Text>
          </View>
        </Pressable>

        {/* Phone Option */}
        <Pressable 
          onPress={() => setSelectedOption("phone")}
          className={`w-[358px] h-[80px] border rounded-[10px] flex-row items-center px-4 ${
            selectedOption === "phone" ? "border-[#147E93] border-2" : "border-[#676B73]"
          }`}
        >
          <PhoneIcon color={selectedOption === "phone" ? "#147E93" : "#676B73"} style={{ marginLeft: 8 }} />
          <View style={{ marginLeft: 20 }}>
            <Text className="text-[22px] font-Roboto-SemiBold text-black ">
              Phone
            </Text>
            <Text className="text-[14px] font-Roboto text-[#676B73] " style={{ marginTop: 6 }}>
              Receive Verification code via phone
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Confirm Button */}
      <CustomButton
        onPress={handleConfirm}
        title="Confirm"
        containerStyles="w-[357px] h-[56px] bg-[#FDBC10] rounded-[10px] flex items-center justify-center mt-[25px] shadow-md shadow-black"
        textStyles="text-[21px] text-[#030B19] font-Roboto-SemiBold"
        style={{ padding: 16, paddingRight: 20, paddingLeft: 16, gap: 10 }}
      />

      {/* Decorative Images */}
      <Image 
        source={require("../../assets/images/leftDecore.png")} 
        className="absolute bottom-0 left-[-1]  " 
        resizeMode="cover"

      />
      <Image 
        source={require("../../assets/images/rightDecore.png")} 
        className="absolute bottom-0 right-0 " 
        resizeMode="cover"
      />
    </SafeAreaView>
  );
};

export default VerificationScreen;