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
    <SafeAreaView className="flex-1 bg-white !p-6 relative">
      {/* Header */}
      <View className="flex-row items-center justify-center relative">
        {/* Left Icon */}
        <Pressable 
          onPress={() => router.replace("/(tabs)")} 
          className="absolute left-0"
        >
          <Image 
            source={require("@/assets/images/back-Icon.png")} 
            className="w-3 h-6" 
            resizeMode="contain"
          />
        </Pressable>

        {/* Title */}
        <Text className="text-2xl font-Roboto-SemiBold text-[#030B19]">
          Verification Options
        </Text>
      </View>

      {/* Subtitle */}
      <View className="mt-8">
        <Text className="text-sm font-Roboto text-[#363E4C] text-left">
          Choose your preferred method to receive the verification code
        </Text>
      </View>

      {/* Options */}
      <View className="mt-8 space-y-2">
        {/* Email Option */}
        <Pressable 
          onPress={() => setSelectedOption("email")}
          className={`w-full border rounded-lg flex-row items-center p-4 overflow-auto ${
            selectedOption === "email" ? "border-[#147E93] border-2"  : "border-[#676B73]"
          }`}
        >
          <View className="w-[20%] flex justify-center">
            <EmailIcon color={selectedOption === "email" ? "#147E93" : "#676B73"} />
          </View>
          <View className="w-full">
            <Text className="text-xl font-Roboto-SemiBold text-black">
              Email
            </Text>
            <Text className="text-sm font-Roboto text-[#676B73] mt-1">
              Receive Verification code via email
            </Text>
          </View>
        </Pressable>

        {/* Phone Option */}
        <Pressable 
          onPress={() => setSelectedOption("phone")}
          className={`w-full border rounded-lg flex-row items-center p-4 overflow-auto ${
            selectedOption === "phone" ? "border-[#147E93] border-2" : "border-[#676B73]"
          }`}
        >
          <View className="w-[20%] flex justify-center">
            <PhoneIcon color={selectedOption === "phone" ? "#147E93" : "#676B73"} />
          </View>
          <View className="w-[80%]">
            <Text className="text-xl font-Roboto-SemiBold text-black">
              Phone
            </Text>
            <Text className="text-sm font-Roboto text-[#676B73] mt-1">
              Receive Verification code via phone
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Confirm Button */}
      <CustomButton
        onPress={handleConfirm}
        title="Confirm"
        containerStyles="w-full bg-[#FDBC10] rounded-lg flex items-center justify-center mt-6 shadow-md shadow-black"
        textStyles="text-xl text-[#030B19] font-Roboto-SemiBold"
        style={{ padding: 4 }}
      />

      {/* Decorative Images */}
      <Image 
        source={require("../../assets/images/leftDecore.png")} 
        className="absolute bottom-0 left-0 w-[160px] h-[160px]"
        resizeMode="contain"
      />
      <Image 
        source={require("../../assets/images/rightDecore.png")} 
        className="absolute bottom-0 right-0 w-[160px] h-[160px]"
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

export default VerificationScreen;