import { View, Text, ScrollView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import Header from '@/components/login/Header';
import ThirdParty from '@/components/login/ThirdParty';
import Input from '@/components/login/Input';

import React from 'react';
import { Link } from 'expo-router';

const login = () => {
  return (
    <ScrollView className="bg-white h-full">
      <Header />
      <View className="px-3">
        <Text className="text-3xl font-Roboto-Medium mt-3">Login</Text>
        <Text
          className="font-Roboto-Light text-black/70 text-base my-5"
          style={{ lineHeight: 20 }}
        >
          Welcome Back, we missed you.
        </Text>
        <Input
          label="Email"
          placeholder="Enter your email"
          isPassword={false}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          isPassword={true}
        />
        <Text className="font-Roboto-Light text-black/70 text-base mt-2">
          Forget your password?{' '}
          <Text className="text-[#147E93] underline font-Roboto-Medium">
            Reset it
          </Text>
        </Text>
        <CustomButton
          title="Login"
          containerStyles="mt-5 bg-[#FDBD10] p-4 rounded-lg w-full shadow-md"
          textStyles="font-medium text-[21px]"
          onPress={() => console.log('Sign Up')}
        />

        <View className="flex-row items-center mt-5">
          <View className="flex-1 h-[1px] bg-[#EDEDED]" />
          <Text className="font-Roboto-Light text-center mx-2 text-base text-black/70">
            Log in with
          </Text>
          <View className="flex-1 h-[1px] bg-[#EDEDED]" />
        </View>
        <View className="flex-row justify-center items-center gap-4">
          <ThirdParty icon="google" />
          <ThirdParty icon="facebook" />
          <ThirdParty icon="apple" />
        </View>
        <View className="flex-row items-center justify-center my-5">
          <Text className="font-Roboto-Light text-black/70 text-base">
            Don't have an account?{' '}
            <Link
              href="/(tabs)/provider/register"
              className="text-[#147E93] underline font-Roboto-Medium"
            >
              Sign up
            </Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default login;
