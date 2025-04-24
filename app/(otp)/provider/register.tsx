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
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';

const Register = () => {
  const [checked, setChecked] = useState(false);
  const { t } = useTranslation(['auth', 'validation']);
  const { isRTL } = useLanguage();

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
      errors.email = t('validation:required', { field: t('auth:email') });
    }

    if (!provider.password || provider.password.length < 8) {
      errors.password = t('auth:passwordLengthError');
    }

    if (!provider.confirmPassword) {
      errors.confirmPassword = t('validation:required', {
        field: t('auth:confirmPassword'),
      });
    } else if (provider.password !== provider.confirmPassword) {
      errors.confirmPassword = t('validation:passwordMatch');
    }

    if (!provider.firstName) {
      errors.firstName = t('validation:required', {
        field: t('auth:firstName'),
      });
    }

    if (!provider.lastName) {
      errors.lastName = t('validation:required', { field: t('auth:lastName') });
    }

    if (!provider.businessName) {
      errors.businessName = t('validation:required', {
        field: t('auth:businessName'),
      });
    }

    if (!provider.businessAddress) {
      errors.businessAddress = t('validation:required', {
        field: t('auth:businessAddress'),
      });
    }

    if (!provider.taxId) {
      errors.taxId = t('validation:required', { field: t('auth:taxId') });
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
      <View className={`px-3 ${isRTL ? 'items-end' : 'items-start'}`}>
        <Text className={`text-3xl mt-3 font-medium`}>
          {t('auth:register')}
        </Text>
        <View className="flex flex-col items-center mt-5 w-full">
          <Input
            label={t('auth:firstName')}
            placeholder={t('auth:enterFirstName')}
            isPassword={false}
            value={provider.firstName}
            onChangeText={(text) =>
              setProvider({ ...provider, firstName: text })
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
            value={provider.lastName}
            onChangeText={(text) =>
              setProvider({ ...provider, lastName: text })
            }
            error={errorMessages.lastName ? true : false}
            errorMessage={errorMessages.lastName ? errorMessages.lastName : ''}
            isRTL={isRTL}
          />
          <Input
            label={t('auth:email')}
            placeholder={t('auth:enterEmail')}
            isPassword={false}
            value={provider.email}
            onChangeText={(text) => setProvider({ ...provider, email: text })}
            error={errorMessages.email ? true : false}
            errorMessage={errorMessages.email ? errorMessages.email : ''}
            isRTL={isRTL}
          />
          <Input
            label={t('auth:password')}
            placeholder={t('auth:enterPassword')}
            isPassword={true}
            value={provider.password}
            onChangeText={(text) =>
              setProvider({ ...provider, password: text })
            }
            error={errorMessages.password ? true : false}
            errorMessage={errorMessages.password ? errorMessages.password : ''}
            isRTL={isRTL}
          />
          <Input
            label={t('auth:confirmPassword')}
            placeholder={t('auth:reEnterPassword')}
            isPassword={true}
            value={provider.confirmPassword}
            onChangeText={(text) =>
              setProvider({ ...provider, confirmPassword: text })
            }
            error={errorMessages.confirmPassword ? true : false}
            errorMessage={
              errorMessages.confirmPassword ? errorMessages.confirmPassword : ''
            }
            isRTL={isRTL}
          />
          <Input
            label={t('auth:businessName')}
            placeholder={t('auth:enterBusinessName')}
            isPassword={false}
            value={provider.businessName}
            onChangeText={(text) =>
              setProvider({ ...provider, businessName: text })
            }
            error={errorMessages.businessName ? true : false}
            errorMessage={
              errorMessages.businessName ? errorMessages.businessName : ''
            }
            isRTL={isRTL}
          />
          <Input
            label={t('auth:businessAddress')}
            placeholder={t('auth:enterBusinessAddress')}
            isPassword={false}
            value={provider.businessAddress}
            onChangeText={(text) =>
              setProvider({ ...provider, businessAddress: text })
            }
            error={errorMessages.businessAddress ? true : false}
            errorMessage={
              errorMessages.businessAddress ? errorMessages.businessAddress : ''
            }
            isRTL={isRTL}
          />
          <Input
            label={t('auth:taxId')}
            placeholder={t('auth:enterTaxId')}
            isPassword={false}
            value={provider.taxId}
            onChangeText={(text) => setProvider({ ...provider, taxId: text })}
            error={errorMessages.taxId ? true : false}
            errorMessage={errorMessages.taxId ? errorMessages.taxId : ''}
            isRTL={isRTL}
          />
        </View>
        <View
          className={`items-center ${isRTL ? 'flex-row-reverse' : 'justify-start flex-row'} w-full`}
        >
          <CheckBox
            checked={checked}
            containerStyle={{ marginLeft: 0, marginRight: 0 }}
            onPress={() => setChecked(!checked)}
          />
          <Text className="text-black text-base font-medium">
            {t('auth:agreeToThe')}{' '}
            <Text className="text-[#147E93] underline">
              {t('auth:privacyPolicy')}
            </Text>
          </Text>
        </View>
        {error && (
          <Text className="text-[#FF5757] text-center text-base mt-3 -mb-3 w-full font-medium">
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
        <View className="flex-row items-center justify-center my-5 w-full">
          <Text className="text-black text-base font-medium">
            {t('auth:hasAccount')}{' '}
            <Link
              href="/(otp)/provider/login"
              className="text-[#147E93] underline"
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
