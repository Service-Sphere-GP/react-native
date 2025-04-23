import { View, Text, ScrollView } from 'react-native';
import { CheckBox } from '@rneui/themed';
import CustomButton from '@/components/CustomButton';
import Header from '@/components/login/Header';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import useRegister from '@/hooks/useRegister';
import Input from '@/components/login/Input';
import { Customer } from '@/types/Customer';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

const Register = () => {
  const [checked, setChecked] = useState(false);
  const { t } = useTranslation(['auth', 'validation']);
  const { isRTL } = useLanguage();

  // Get text styles with appropriate font family and alignment
  const textStyle = getTextStyle(isRTL);

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

  const { error, loading, customerRegister } = useRegister();

  const validateForm = (customer: Customer) => {
    const errors = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
    };

    if (!customer.email) {
      errors.email = t('validation:required', { field: t('auth:email') });
    }

    if (!customer.password || customer.password.length < 8) {
      errors.password = t('auth:passwordLengthError');
    }

    if (!customer.confirmPassword) {
      errors.confirmPassword = t('validation:required', { field: t('auth:confirmPassword') });
    } else if (customer.password !== customer.confirmPassword) {
      errors.confirmPassword = t('validation:passwordMatch');
    }

    if (!customer.firstName) {
      errors.firstName = t('validation:required', { field: t('auth:firstName') });
    }

    if (!customer.lastName) {
      errors.lastName = t('validation:required', { field: t('auth:lastName') });
    }

    return errors;
  };

  const handleRegister = async () => {
    const errors = validateForm(customer);
    setErrorMessages(errors);

    const hasErrors = Object.values(errors).some((error) => error.length > 0);
    if (hasErrors) {
      return;
    }

    try {
      const success = await customerRegister(
        customer.email,
        customer.password,
        customer.firstName,
        customer.lastName,
        customer.confirmPassword,
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
      <View className={`px-3 ${isRTL ? 'items-end' : 'items-start'}`}>
        <Text 
          className={`text-3xl mt-3 font-medium ${textStyle.className}`}
          style={textStyle.style}
        >
          {t('auth:register')}
        </Text>
        <View className="flex flex-col items-center mt-5 w-full">
          <Input
            label={t('auth:firstName')}
            placeholder={t('auth:enterFirstName')}
            isPassword={false}
            value={customer.firstName}
            onChangeText={(text) =>
              setCustomer({ ...customer, firstName: text })
            }
            error={errorMessages.firstName ? true : false}
            errorMessage={
              errorMessages.firstName ? errorMessages.firstName : ''
            }
            isRTL={isRTL}
          />
          <Input
            label={t('auth:lastName')}
            placeholder={t('auth:enterLastName')}
            isPassword={false}
            value={customer.lastName}
            onChangeText={(text) =>
              setCustomer({ ...customer, lastName: text })
            }
            error={errorMessages.lastName ? true : false}
            errorMessage={errorMessages.lastName ? errorMessages.lastName : ''}
            isRTL={isRTL}
          />
          <Input
            label={t('auth:email')}
            placeholder={t('auth:enterEmail')}
            isPassword={false}
            value={customer.email}
            onChangeText={(text) => setCustomer({ ...customer, email: text })}
            error={errorMessages.email ? true : false}
            errorMessage={errorMessages.email ? errorMessages.email : ''}
            isRTL={isRTL}
          />
          <Input
            label={t('auth:password')}
            placeholder={t('auth:enterPassword')}
            isPassword={true}
            value={customer.password}
            onChangeText={(text) =>
              setCustomer({ ...customer, password: text })
            }
            error={errorMessages.password ? true : false}
            errorMessage={errorMessages.password ? errorMessages.password : ''}
            isRTL={isRTL}
          />
          <Input
            label={t('auth:confirmPassword')}
            placeholder={t('auth:reEnterPassword')}
            isPassword={true}
            value={customer.confirmPassword}
            onChangeText={(text) =>
              setCustomer({ ...customer, confirmPassword: text })
            }
            error={errorMessages.confirmPassword ? true : false}
            errorMessage={
              errorMessages.confirmPassword ? errorMessages.confirmPassword : ''
            }
            isRTL={isRTL}
          />
        </View>
        <View className={`flex-row items-center ${isRTL ? 'justify-end' : 'justify-start'} w-full`}>
          <CheckBox
            checked={checked}
            containerStyle={{ marginLeft: 0, marginRight: 0 }}
            onPress={() => setChecked(!checked)}
          />
          <Text 
            className="text-black/70 text-base font-light"
            style={textStyle.style}
          >
            {t('auth:agreeToThe')}{' '}
            <Text 
              className="text-[#147E93] underline font-medium"
              style={textStyle.style}
            >
              {t('auth:privacyPolicy')}
            </Text>
          </Text>
        </View>

        {error && (
          <Text 
            className={`text-[#FF5757] text-center text-base mt-3 -mb-3 w-full font-medium ${textStyle.className}`}
            style={textStyle.style}
          >
            {error}
          </Text>
        )}

        <CustomButton
          title={t('auth:continue')}
          containerStyles="mt-5 bg-[#FDBD10] p-4 rounded-lg w-full shadow-md"
          textStyles="font-medium text-[21px]"
          onPress={handleRegister}
          disabled={loading || !checked}
        />

        <View className={`flex-row items-center justify-center my-5 w-full ${textStyle.className}`}>
          <Text 
            className="text-black/70 text-base font-light"
            style={textStyle.style}
          >
            {t('auth:hasAccount')}{' '}
            <Link
              href="/(otp)/customer/login"
              className="text-[#147E93] underline font-medium"
              style={textStyle.style}
            >
              {t('auth:login')}
            </Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;
