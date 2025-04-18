import { View, Text, ScrollView } from 'react-native';
import { CheckBox } from '@rneui/themed';
import CustomButton from '@/components/CustomButton';
import Header from '@/components/login/Header';
import { Link } from 'expo-router';
import { useState } from 'react';
import useRegister from '@/hooks/useRegister';
import Input from '@/components/login/Input';
import { Provider } from '@/types/Provider';
import { useRouter } from 'expo-router';

const Register = () => {
  const [checked, setChecked] = useState(false);

  const [provider, setProvider] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    businessName: '',
    businessAddress: '',
    taxId: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    businessName: '',
    businessAddress: '',
    taxId: '',
  });

  const { error, loading, providerRegister } = useRegister();
  const router = useRouter();

  const validateForm = (provider: Provider) => {
    const errors = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
      businessName: '',
      businessAddress: '',
      taxId: '',
    };

    if (!provider.email) {
      errors.email = 'Email is required';
    }

    if (!provider.password || provider.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!provider.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (provider.password !== provider.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!provider.firstName) {
      errors.firstName = 'First Name is required';
    }

    if (!provider.lastName) {
      errors.lastName = 'Last Name is required';
    }

    if (!provider.businessName) {
      errors.businessName = 'Business Name is required';
    }

    if (!provider.businessAddress) {
      errors.businessAddress = 'Business Address is required';
    }

    if (!provider.taxId) {
      errors.taxId = 'Tax ID is required';
    }

    return errors;
  };

  const handleRegister = async () => {
    const errors = validateForm(provider);
    setErrorMessages(errors);

    const hasErrors = Object.values(errors).some((error) => error.length > 0);
    if (hasErrors) {
      return;
    }
    try {
      const success = await providerRegister(
        provider.email,
        provider.password,
        provider.firstName,
        provider.lastName,
        provider.confirmPassword,
        provider.businessName,
        provider.businessAddress,
        provider.taxId,
      );

      if (success) {
        router.push('/(otp)/Verification');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
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
            value={provider.firstName}
            onChangeText={(text) =>
              setProvider({ ...provider, firstName: text })
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
            value={provider.lastName}
            onChangeText={(text) =>
              setProvider({ ...provider, lastName: text })
            }
            error={errorMessages.lastName ? true : false}
            errorMessage={errorMessages.lastName ? errorMessages.lastName : ''}
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            isPassword={false}
            value={provider.email}
            onChangeText={(text) => setProvider({ ...provider, email: text })}
            error={errorMessages.email ? true : false}
            errorMessage={errorMessages.email ? errorMessages.email : ''}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            isPassword={true}
            value={provider.password}
            onChangeText={(text) =>
              setProvider({ ...provider, password: text })
            }
            error={errorMessages.password ? true : false}
            errorMessage={errorMessages.password ? errorMessages.password : ''}
          />
          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            isPassword={true}
            value={provider.confirmPassword}
            onChangeText={(text) =>
              setProvider({ ...provider, confirmPassword: text })
            }
            error={errorMessages.confirmPassword ? true : false}
            errorMessage={
              errorMessages.confirmPassword ? errorMessages.confirmPassword : ''
            }
          />
          <Input
            label="Business Name"
            placeholder="Enter your business name"
            isPassword={false}
            value={provider.businessName}
            onChangeText={(text) =>
              setProvider({ ...provider, businessName: text })
            }
            error={errorMessages.businessName ? true : false}
            errorMessage={
              errorMessages.businessName ? errorMessages.businessName : ''
            }
          />
          <Input
            label="Business Address"
            placeholder="Enter your business address"
            isPassword={false}
            value={provider.businessAddress}
            onChangeText={(text) =>
              setProvider({ ...provider, businessAddress: text })
            }
            error={errorMessages.businessAddress ? true : false}
            errorMessage={
              errorMessages.businessAddress ? errorMessages.businessAddress : ''
            }
          />
          <Input
            label="Tax ID"
            placeholder="Enter your tax ID"
            isPassword={false}
            value={provider.taxId}
            onChangeText={(text) => setProvider({ ...provider, taxId: text })}
            error={errorMessages.taxId ? true : false}
            errorMessage={errorMessages.taxId ? errorMessages.taxId : ''}
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
        <View className="flex-row items-center justify-center my-5">
          <Text className="font-Roboto-Light text-black/70 text-base">
            Already have an account?{' '}
            <Link
              href="/(otp)/provider/login"
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
