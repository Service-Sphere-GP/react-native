import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useRouter } from 'expo-router';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import Header from '@/components/Header';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastService from '@/constants/ToastService';

interface Service {
  service_name: string;
  description: string;
  base_price: number;
  images: string[];
  service_provider_id: string;
  service_attributes: any[];
  status: string;
  _id: string;
  rating_average: number;
}

const MyServices = () => {
  const router = useRouter();
  const { t } = useTranslation(['services', 'common']);
  const { isRTL } = useLanguage();

  const { width: screenWidth } = useWindowDimensions();
  const [services, setServices] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshingUser, setRefreshingUser] = useState(false);
  const [userVerificationStatus, setUserVerificationStatus] = useState<
    string | null
  >(null);

  const imageSize = screenWidth < 375 ? 45 : screenWidth < 768 ? 60 : 75;

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);

        // Get user data from AsyncStorage to check verification status
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserVerificationStatus(parsedUser.verification_status || null);
        }

        const response: any = await ApiService.get(
          API_ENDPOINTS.GET_MY_SERVICES,
        );

        setServices(response.data.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setTimeout(() => {
          router.push('/(otp)/customer/login');
        }, 100);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const refreshUserData = async () => {
    try {
      setRefreshingUser(true);

      // Get current user ID from AsyncStorage
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        ToastService.error('Error', 'User data not found');
        return;
      }

      const parsedUser = JSON.parse(userData);
      const userId = parsedUser._id;

      // Fetch fresh user data from server
      const response: any = await ApiService.get(
        API_ENDPOINTS.GET_USER.replace(':id', userId),
      );

      if (response.data && response.data.data) {
        const freshUserData = response.data.data;

        // Update AsyncStorage with fresh data
        await AsyncStorage.setItem('user', JSON.stringify(freshUserData));

        // Update local state
        setUserVerificationStatus(freshUserData.verification_status || null);

        // Show success message
        ToastService.success(
          t('common:success') || 'Success',
          t('services:dataRefreshed') ||
            'Verification status updated successfully!',
        );
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      ToastService.error(
        t('common:error') || 'Error',
        t('services:refreshFailed') ||
          'Failed to refresh data. Please try again.',
      );
    } finally {
      setRefreshingUser(false);
    }
  };

  return (
    <>
      {/* Loading Indicator */}
      {loading ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View className="flex-1 bg-[#F4F4F4]">
          {/* Header */}
          <Header title={t('services:myServices')} showBackButton={true} />

          {/* Services List */}
          {services?.length ? (
            <View className="bg-[#FFFFFF] rounded-2xl mx-2 xs:mx-4 xs:px-4 mb-5 px-2 flex-1">
              <FlatList
                data={services}
                keyExtractor={(service) => service._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/services/${item._id}`)}
                    className={`flex-row py-3 w-full items-center ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Image
                      source={{ uri: item.images[0] }}
                      className={`rounded-full ${isRTL ? 'ml-3' : 'mr-3'}`}
                      style={{
                        width: imageSize,
                        height: imageSize,
                      }}
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <View
                        className={`flex-row justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <Text
                          className={`text-[#030B19] font-bold text-sm xs:text-base`}
                        >
                          {item.service_name}
                        </Text>
                        <Ionicons
                          name={isRTL ? 'chevron-back' : 'chevron-forward'}
                          size={20}
                          color="#030B19"
                        />
                      </View>

                      <View
                        className={`flex-row items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <View
                          className={`flex-row items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <Text
                            className={`text-sm text-[#030B19] ${isRTL ? 'ml-1' : 'mr-1'}`}
                          >
                            {item.rating_average.toFixed(2)}
                          </Text>
                          <Rating
                            readonly
                            startingValue={item.rating_average}
                            imageSize={10}
                          />
                        </View>
                        <Text
                          className={`text-[#030B19] font-semibold text-xs xs:text-sm`}
                        >
                          {item.base_price} {t('services:currency')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className={`text-[#666B73] font-Roboto-Medium text-lg`}>
                {t('services:noServicesFound')}
              </Text>
            </View>
          )}

          {/* Footer Button */}
          {userVerificationStatus === 'approved' && (
            <View className="mt-4 px-4 mb-3">
              <TouchableOpacity
                className={` items-center ${isRTL ? 'justify-start flex-row-reverse' : 'justify-end flex-row'}`}
                onPress={() => router.push('/profile/new-service')}
              >
                <Text className="font-semibold text-base bg-[#FDBD10] rounded-md px-5 py-3">
                  {t('services:addNewService')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Show verification status message if not approved */}
          {userVerificationStatus && userVerificationStatus !== 'approved' && (
            <View className="mt-4 px-4 mb-3">
              <View className="bg-orange-100 border border-orange-300 rounded-md p-4">
                <Text className="text-orange-800 text-center font-medium mb-3">
                  {userVerificationStatus === 'pending'
                    ? t('services:verificationPending') ||
                      'Your account verification is pending. You cannot add new services until your account is approved.'
                    : userVerificationStatus === 'rejected'
                      ? t('services:verificationRejected') ||
                        'Your account verification was rejected. Please contact support to resolve this issue.'
                      : t('services:verificationRequired') ||
                        'Account verification required to add new services.'}
                </Text>

                {/* Refresh Button */}
                <TouchableOpacity
                  className={`bg-orange-600 rounded-md py-2 px-4 flex-row items-center justify-center ${refreshingUser ? 'opacity-50' : ''}`}
                  onPress={refreshUserData}
                  disabled={refreshingUser}
                >
                  {refreshingUser ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                        className="mr-2"
                      />
                      <Text className="text-white font-medium">
                        {t('services:refreshing') || 'Refreshing...'}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name="refresh"
                        size={16}
                        color="#FFFFFF"
                        style={{ marginRight: 8 }}
                      />
                      <Text className="text-white font-medium">
                        {t('services:refreshStatus') || 'Refresh Status'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default MyServices;
