import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

const App = () => {
  const router = useRouter();
  const landingImage = require("@/assets/images/LandingImage.png");

  return (
    <View className="flex-1 bg-[#fdfdfd] px-5 pt-10">
      <SafeAreaView className="flex flex-1 items-start">
        <View style={{ marginTop: 19 }}>
          {/* Logo Text */}
          <Animated.View entering={FadeInDown.delay(300)} className="w-full">
            <Text className="text-[50px] font-Roboto-SemiBold text-left">
              <Text className="text-[#FFCE4C]">Service </Text>
              <Text className="text-[#147E93]">Sphere</Text>
            </Text>
          </Animated.View>

          {/* Content Section */}
          <View className="w-full" style={{ marginTop: 31 }}>
            {/* Subtitle */}
            <Animated.View entering={FadeInDown.delay(400)} className="w-full">
              <Text className="text-[#030B19] text-[28px] font-Roboto-SemiBold text-left leading-tight">
                Connecting you to {"\n"}the people you need
              </Text>
            </Animated.View>

            {/* Description */}
            <Animated.View entering={FadeInDown.delay(500)} className="w-full" style={{ marginTop: 32 }}>
              <Text className="text-[#030B19] text-[18px] font-Roboto text-left">
                Welcome! Are you looking for a service{"\n"}
                or offering one? Let us know below.{"\n"}
                Choose how you'd like to get started.
              </Text>
            </Animated.View>

            {/* Landing Image */}
            <Animated.View entering={FadeInDown.delay(600)} className="w-full mt-9 items-center">
              <Image
                source={landingImage}
                className="w-[290px] h-[255px]"
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        </View>


        {/* Buttons */}
        <Animated.View entering={FadeInDown.delay(700)} className="w-full" style={{ marginTop: 34 }}>
          <CustomButton
            onPress={() => router.push("/customer")}
            title="Customer"
            containerStyles="w-[358px] h-[46px] bg-[#147E93] rounded-[10px] shadow-md p-2"
            textStyles="text-[22px] text-white font-Roboto-SemiBold"
            
          />
          <CustomButton
            onPress={() => router.push("/serviceProvider")}
            title="Service Provider"
            containerStyles="w-[358px] h-[46px] bg-white rounded-[10px] shadow-md p-2"
            textStyles="text-[22px] text-[#147E93] font-Roboto-SemiBold"
            style={{ marginTop: 15 }}
          />
        </Animated.View>

        <StatusBar style="dark" />
      </SafeAreaView>
    </View>
  );
};

export default App;