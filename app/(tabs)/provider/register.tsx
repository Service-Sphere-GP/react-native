import { View, Text, ScrollView } from 'react-native';
import { CheckBox } from '@rneui/themed';
import CustomButton from '@/components/CustomButton';
import Header from '@/components/login/Header';
import ThirdParty from '@/components/login/ThirdParty';
import Inputs from '@/components/login/Inputs';
import { Link, router } from 'expo-router';
import { useState } from 'react';

const Register = () => {
  const [checked, setChecked] = useState(false);

  return (
    <ScrollView className="bg-white h-full">
      <Header />
      <View className="px-3">
        <Text className="text-3xl font-Roboto-Medium mt-3">Sign Up</Text>
        <Inputs />
        <View className="flex-row items-center">
          <CheckBox
            checked={checked}
            containerStyle={{ marginLeft: 0, marginRight: 0 }}
            onPress={() => setChecked(!checked)}
          />
          <Text className="font-Roboto-Light text-black/70 text-base">
            I agree to the{' '}
            <Text className="text-[#147E93] underline font-Roboto-Medium">
              Privacy policy
            </Text>
          </Text>
        </View>
        <CustomButton
          title="Sign Up"
          containerStyles="mt-5 bg-[#FDBD10] p-4 rounded-lg w-full shadow-md"
          textStyles="font-medium text-[21px]"
          onPress={() => router.push('/(tabs)/provider/details')}
        />

        <View className="flex-row items-center mt-5">
          <View className="flex-1 h-[1px] bg-[#EDEDED]" />
          <Text className="font-Roboto-Light text-center mx-2 text-base text-black/70">
            Sign up with
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
            Already have an account?{' '}
            <Link
              href="/(tabs)/provider/login"
              className="text-[#147E93] underline font-Roboto-Medium"
            >
              Login
            </Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;
