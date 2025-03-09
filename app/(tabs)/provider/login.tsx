import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import Header from '@/components/login/Header';
import Input from '@/components/login/Input';
import { Link } from 'expo-router';
import useLogin from '@/hooks/useLogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
  });

  const { login, loading, error } = useLogin();

  const validateForm = (user: { email: string; password: string }) => {
    const errors = {
      email: '',
      password: '',
    };

    if (!user.email) {
      errors.email = 'Email is required';
    }

    if (!user.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleLogin = () => {
    const errors = validateForm({ email, password });
    setErrorMessages(errors);

    const hasErrors = Object.values(errors).some((error) => error.length > 0);
    if (hasErrors) {
      return;
    }

    login(email, password);
  };

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
          error={errorMessages.email ? true : false}
          errorMessage={errorMessages.email ? errorMessages.email : ''}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          isPassword={true}
          value={password}
          onChangeText={setPassword}
          error={errorMessages.password ? true : false}
          errorMessage={errorMessages.password ? errorMessages.password : ''}
        />
        <Text className="font-Roboto-Light text-black/70 text-base mt-2">
          Forget your password?{' '}
          <Text className="text-[#147E93] underline font-Roboto-Medium">
            Reset it
          </Text>
        </Text>

        {error && (
          <Text className="text-[#FF5757] text-center font-Roboto-Medium text-base mt-3 -mb-3">
            {error}
          </Text>
        )}

        <CustomButton
          title="Login"
          containerStyles="mt-5 bg-[#FDBD10] p-4 rounded-lg w-full shadow-md"
          textStyles="font-medium text-[21px]"
          onPress={handleLogin}
          disabled={loading}
        />

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
      </View>
    </ScrollView>
  );
};

export default Login;
