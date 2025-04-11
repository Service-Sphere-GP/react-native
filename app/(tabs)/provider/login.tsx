import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import Header from '@/components/login/Header';
import Input from '@/components/login/Input';
import { Link } from 'expo-router';
import useLogin from '@/hooks/useLogin';
import ToastService from '../../../constants/ToastService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
  });

  const { login, loading } = useLogin();

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

  const handleLogin = async () => {
    const errors = validateForm({ email, password });
    setErrorMessages(errors);

    const hasErrors = Object.values(errors).some((error) => error.length > 0);
    if (hasErrors) {
      const errorMessage =
        Object.values(errors).find((error) => error.length > 0) ||
        'Please check your input';
      ToastService.error('Validation Error', errorMessage);
      return;
    }

    login(email, password)
      .then((success) => {
        if (success) {
          ToastService.success('Login Successful', 'Welcome back!');
        }
      })
      .catch((err) => {
        console.error('Login error:', err);
        ToastService.error(
          'Login Failed',
          'Please check your credentials and try again',
        );
      });
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
