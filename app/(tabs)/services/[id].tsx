import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import { useLocalSearchParams } from 'expo-router';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { useRouter } from 'expo-router';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/Header';

interface Service {
  service_name: string;
  description: string;
  base_price: number;
  images: string[];
  service_provider: {
    _id: string;
    full_name: string;
    rating_average: number;
    business_name: string;
    profile_image: string;
  };
  service_attributes: any[];
  status: string;
  _id: string;
  rating_average: number;
}

const ServiceDetailsPage = () => {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          router.push('/(otp)/customer/login');
        }
        const response: any = await ApiService.get(
          API_ENDPOINTS.GET_SERVICE_DETAILS.replace(':id', id as string),
        );
        setService(response.data.data);
      } catch (error) {
        console.error('Failed to fetch service details', error);
        // Handle authentication errors
        if ((error as any)?.response?.status === 401) {
          // Redirect to login if unauthorized
          router.push('/(otp)/customer/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id, router]);

  const navigateHandler = () => {
    router.push(`/profile/${service?.service_provider._id}`);
  };

  const bookServiceHandler = async () => {
    try {
      const response: any = await ApiService.post(
        API_ENDPOINTS.BOOK_SERVICE.replace(
          ':serviceId',
          service?._id as string,
        ),
      );
      if (response.status === 201) {
        router.push('/(tabs)/bookings');
      }
    } catch (error) {
      console.error('Failed to book service', error);
    }
  };

  return (
    <>
      {loading ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View className="justify-between bg-white h-full">
          <View className="px-2">
            <Header
              title={service?.service_name}
              showBackButton={true}
              notificationsCount={4}
            />

            <View className="flex-row justify-between my-4 items-center">
              <Text className="font-Roboto-Medium text-lg">
                Service Provider
              </Text>
              <Text
                className={`${service?.status === 'active' ? 'bg-[#34C759]/20 text-[#34C759]' : 'bg-[#FF3B30]/20 text-[#FF3B30]'} font-Roboto-Medium py-1 px-3 rounded-xl text-base`}
              >
                {service?.status}
              </Text>
            </View>
            <ProfileHeader
              fullName={service?.service_provider.full_name}
              rating={service?.service_provider.rating_average}
              role={service?.service_provider.business_name}
              onPress={navigateHandler}
              imageUrl={service?.service_provider?.profile_image}
            />

            <View className="mt-6">
              <Text className="font-Roboto-Medium text-lg">Images</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                className="mt-3"
              >
                {service?.images.map((image, index) => (
                  <View key={index} className="mr-3">
                    <Image
                      source={{ uri: image }}
                      style={{ width: 130, height: 108, borderRadius: 10 }}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            <Text className="font-Roboto text-xs text-[#666B73] mt-5">
              {service?.description}
            </Text>
          </View>
          <View className="flex-row justify-center xs:justify-between items-end">
            <TouchableOpacity
              className={`${service?.status === 'active' ? 'bg-[#FDBD10]' : 'bg-[#D9DEE4]'} py-3 px-4 rounded-t-md w-full`}
              disabled={service?.status !== 'active'}
              onPress={() => {
                if (service?.service_provider._id === user?._id) {
                  router.push(`/profile/edit-service/${service?._id}`);
                } else {
                  bookServiceHandler();
                }
              }}
            >
              <Text className="font-Roboto-Medium text-base text-center">
                {service?.service_provider.full_name === user?.full_name
                  ? 'Edit your Service'
                  : `Open Chat with ${service?.service_provider.full_name}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default ServiceDetailsPage;
