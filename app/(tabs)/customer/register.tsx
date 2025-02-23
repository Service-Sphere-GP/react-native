import { View, Text, ScrollView } from 'react-native';
import { CheckBox } from '@rneui/themed';
import CustomButton from '@/components/CustomButton';
import Header from '@/components/login/Header';
import { Link } from 'expo-router';
import { useState } from 'react';
import useRegister from '@/hooks/useRegister';
import Input from '@/components/login/Input';
import { Customer } from '@/types/Customer';

const Register = () => {
  const [checked, setChecked] = useState(false);

  const [customer, setCustomer] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  });

  const { error, data, loading, customerRegister } = useRegister();

  const validateForm = (customer: Customer) => {
    const errors = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
    };

    if (!customer.email) {
      errors.email = 'Email is required';
    }

    if (!customer.password || customer.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!customer.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (customer.password !== customer.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!customer.firstName) {
      errors.firstName = 'First Name is required';
    }

    if (!customer.lastName) {
      errors.lastName = 'Last Name is required';
    }

    return errors;
  };

  const handleRegister = () => {
    const errors = validateForm(customer);
    setErrorMessages(errors);

    const hasErrors = Object.values(errors).some((error) => error.length > 0);
    if (hasErrors) {
      return;
    }

    customerRegister(
      customer.email,
      customer.password,
      customer.firstName,
      customer.lastName,
      customer.confirmPassword,
    );
  };

  return (
    <ScrollView className="bg-white h-full">
      <Header />
      <View className="px-3">
        <Text className="text-3xl font-Roboto-Medium mt-3">Sign Up</Text>
        <View className="flex flex-col items-center mt-5">
          <Input
            label="First Name"
            placeholder="Enter your first name"
            isPassword={false}
            value={customer.firstName}
            onChangeText={(text) =>
              setCustomer({ ...customer, firstName: text })
            }
            error={errorMessages.firstName ? true : false}
            errorMessage={
              errorMessages.firstName ? errorMessages.firstName : ''
            }
          />
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            isPassword={false}
            value={customer.lastName}
            onChangeText={(text) =>
              setCustomer({ ...customer, lastName: text })
            }
            error={errorMessages.lastName ? true : false}
            errorMessage={errorMessages.lastName ? errorMessages.lastName : ''}
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            isPassword={false}
            value={customer.email}
            onChangeText={(text) => setCustomer({ ...customer, email: text })}
            error={errorMessages.email ? true : false}
            errorMessage={errorMessages.email ? errorMessages.email : ''}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            isPassword={true}
            value={customer.password}
            onChangeText={(text) =>
              setCustomer({ ...customer, password: text })
            }
            error={errorMessages.password ? true : false}
            errorMessage={errorMessages.password ? errorMessages.password : ''}
          />
          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            isPassword={true}
            value={customer.confirmPassword}
            onChangeText={(text) =>
              setCustomer({ ...customer, confirmPassword: text })
            }
            error={errorMessages.confirmPassword ? true : false}
            errorMessage={
              errorMessages.confirmPassword ? errorMessages.confirmPassword : ''
            }
          />
        </View>
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

        {error && (
          <Text className="text-[#FF5757] text-center font-Roboto-Medium text-base mt-3 -mb-3">
            {error}
          </Text>
        )}

        <CustomButton
          title="Continue"
          containerStyles="mt-5 bg-[#FDBD10] p-4 rounded-lg w-full shadow-md"
          textStyles="font-medium text-[21px]"
          onPress={handleRegister}
          disabled={loading || !checked}
        />

        {data && (
          <Text className="text-center text-2xl text-green-500">
            Registeration Successful!
          </Text>
        )}

        <View className="flex-row items-center justify-center my-5">
          <Text className="font-Roboto-Light text-black/70 text-base">
            Already have an account?{' '}
            <Link
              href="/(tabs)/customer/login"
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
