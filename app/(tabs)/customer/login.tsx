import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import Header from '@/components/login/Header';
import ThirdParty from '@/components/login/ThirdParty';
import Input from '@/components/login/Input';
import { Link } from 'expo-router';
import useLogin from '@/hooks/useLogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, data, clearError } = useLogin();

  const handleLogin = () => {
    login(email, password);
  };

  const handleInputFocus = () => {
    if (error) {
      clearError();
    }
  }

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
          value={email}
          onChangeText={setEmail}
          error={Boolean(error)}
          onFocus={handleInputFocus}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          isPassword={true}
          value={password}
          onChangeText={setPassword}
          error={Boolean(error)}
          onFocus={handleInputFocus}
        />
        <Text className="font-Roboto-Light text-black/70 text-base mt-2">
          Forget your password?{' '}
          <Text className="text-[#147E93] underline font-Roboto-Medium">
            Reset it
          </Text>
        </Text>

        {error && (
          <Text className="text-[#FF5757] text-center font-Roboto-Medium text-base mt-3 -mb-3">
            {error[0]}
          </Text>
        )}

        <CustomButton
          title="Login"
          containerStyles="mt-5 bg-[#FDBD10] p-4 rounded-lg w-full shadow-md"
          textStyles="font-medium text-[21px]"
          onPress={handleLogin}
          disabled={loading}
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
              href="/(tabs)/customer/register"
              className="text-[#147E93] underline font-Roboto-Medium"
            >
              Sign up
            </Link>
            
          </Text>
          
        </View>
        {data && <Text className='text-center text-2xl text-green-500'>Login Successful!</Text>}
      </View>
    </ScrollView>
  );
};

export default Login;
