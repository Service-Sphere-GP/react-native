import { Stack, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '@/components/CustomButton';

const App = () => {
  const router = useRouter();
  const landingImage = require('@/assets/images/LandingImage.png');

  const { height } = useWindowDimensions();
  const responsiveHeight = height * 0.5;

  return (
    <ScrollView
      className="flex-1 bg-[#fdfdfd] px-4 py-6"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <SafeAreaView className="flex flex-1 items-center justify-between px-5">
        <View className="w-full">
          {/* Logo Text */}
          <Animated.View
            entering={FadeInDown.delay(300)}
            className="w-full mt-2"
          >
            <Text className="text-[40px] font-Roboto-SemiBold text-left">
              <Text className="text-[#FFCE4C]">Service </Text>
              <Text className="text-[#147E93]">Sphere</Text>
            </Text>
          </Animated.View>

          {/* Content Section */}
          <View className="w-full" style={{ marginTop: 15 }}>
            {/* Subtitle */}
            <Animated.View entering={FadeInDown.delay(400)}>
              <Text className="text-[#030B19] text-[22px] font-Roboto-SemiBold text-left leading-tight">
                Connecting you to the people you need
              </Text>
            </Animated.View>

            {/* Description */}
            <Animated.View
              entering={FadeInDown.delay(500)}
              style={{ marginTop: 15 }}
            >
              <Text className="text-[#030B19] text-[16px] font-Roboto text-left">
                Welcome! Are you looking for a service or offering one? Let us
                know below. Choose how you'd like to get started.
              </Text>
            </Animated.View>

            {/* Landing Image */}
            <Animated.View
              entering={FadeInDown.delay(600)}
              className="w-full mt-4 items-center justify-center"
            >
              <Image
                source={landingImage}
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: responsiveHeight,
                }}
              />
            </Animated.View>
          </View>
        </View>

        {/* Buttons */}
        <Animated.View
          entering={FadeInDown.delay(700)}
          style={{ width: '100%', gap: 12, marginBottom: 20 }}
        >
          <CustomButton
            onPress={() => router.push('/customer/register')}
            title="Customer"
            containerStyles="bg-[#147E93] rounded-[10px] shadow-md p-2"
            textStyles="text-[20px] text-white font-Roboto-SemiBold"
          />
          <CustomButton
            onPress={() => router.push('/provider/register')}
            title="Service Provider"
            containerStyles="bg-white rounded-[10px] shadow-md p-2"
            textStyles="text-[20px] text-[#147E93] font-Roboto-SemiBold"
          />
        </Animated.View>

        <StatusBar style="dark" />
      </SafeAreaView>
      <Stack />
    </ScrollView>
  );
};

export default App;
