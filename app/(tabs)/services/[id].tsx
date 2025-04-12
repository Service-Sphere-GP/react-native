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
import NotificationIcon from '@/assets/icons/Notification';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { useRouter } from 'expo-router';
import { Rating } from 'react-native-ratings';

interface Service {
  service_name: string;
  description: string;
  base_price: number;
  images: string[];
  service_provider_id: string;
  service_attributes: any[];
  status: string;
  _id: string;
}

interface Provider {
  first_name: string;
  last_name: string;
  rating: number;
  business_name: string;
}

const ServiceDetailsPage = () => {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);

        const response: any = await ApiService.get(
          API_ENDPOINTS.GET_SERVICE_DETAILS.replace(':id', id as string),
        );
        setService(response.data.data);

        const providerResponse: any = await ApiService.get(
          API_ENDPOINTS.GET_USER.replace(
            ':id',
            response.data.data.service_provider_id as string,
          ),
        );

        setProvider(providerResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch service details', error);
        // Handle authentication errors
        if ((error as any)?.response?.status === 401) {
          // Redirect to login if unauthorized
          router.push('/customer/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id, router]);

  const navigateHandler = () => {
    router.push(`/profile/${service?.service_provider_id}`);
  };

  return (
    <>
      {loading ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View className="justify-between bg-white p-2 pt-12 h-full">
          <View>
            <View className="flex-row justify-between items-center">
              <Image source={require('@/assets/images/blackArrow.png')} />
              <Text className="text-2xl font-Roboto-SemiBold">
                {service?.service_name}
              </Text>
              <NotificationIcon />
            </View>
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
              firstName={provider?.first_name}
              LastName={provider?.last_name}
              rating={4.5}
              role={provider?.business_name}
              onPress={navigateHandler}
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
          <View className="flex-row justify-center xs:justify-between items-end mb-28">
            <View className="hidden xs:flex items-center">
              <Text className="font-Roboto-Medium text-lg">4.7</Text>
              <Rating readonly startingValue={4.7} imageSize={18} />
            </View>
            <View className="xs:items-end">
              <Text className="font-Roboto text-lg text-center">
                Base Price: {service?.base_price} EGP
              </Text>
              <TouchableOpacity
                className={`${service?.status === 'active' ? 'bg-[#FDBD10]' : 'bg-[#D9DEE4]'} py-3 px-4 rounded-xl`}
                disabled={service?.status !== 'active'}
              >
                <Text className="font-Roboto-Medium text-base text-center">
                  Open a chat with {provider?.first_name}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default ServiceDetailsPage;
