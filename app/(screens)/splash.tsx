import { View, Text, Image, useWindowDimensions } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    setTimeout(() => {
      router.push("/(tabs)");
    }, 2000);
  }, []);

  return (
    <View className="flex-1 bg-[#f8f7f8] justify-center items-center">
      <View className="flex-row items-center">
        <Image
          source={require("../../assets/images/icon-dark.png")}
          className="w-64 h-64" 
        />
        <View className="ml-1 mt-10">
          <Text className="text-5xl text-[#147e93] font-semibold">Service</Text>
          <Text className="text-5xl text-[#147e93] font-semibold">Sphere</Text>
        </View>
      </View>

    </View>
  );
}

