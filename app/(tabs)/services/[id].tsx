import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useState, useEffect } from 'react';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import { useLocalSearchParams } from 'expo-router';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { useRouter } from 'expo-router';
import Rating from '@/components/ui/Rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';

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

interface Feedback {
  _id: string;
  rating: number;
  message: string;
  user: {
    first_name: string;
    last_name: string;
    profile_image: string;
  };
  createdAt: string;
  service: {
    service_name: string;
  };
}

const ServiceDetailsPage = () => {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>();

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
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const response: any = await ApiService.get(
          API_ENDPOINTS.GET_SERVICE_FEEDBACKS.replace(':id', id as string),
        );
        setFeedbacks(response.data.data);
      } catch (error) {
        console.error('Failed to fetch feedbacks', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
    fetchFeedbacks();
  }, [id, router]);

  const renderReviewItem = ({ item }: { item: Feedback }) => (
    <View className="bg-white pb-4 pt-3 border-b items-start gap-2 border-gray-200">
      <View className="flex-row">
        <Image
          source={{ uri: item.user.profile_image }}
          className="w-12 h-12 rounded-full mt-1"
          resizeMode="cover"
        />

        {/* Review Details */}
        <View className="ml-4 flex-1">
          <Text className="text-lg font-Roboto-Medium text-[#030B19]">
            {item.user.first_name} {item.user.last_name}
          </Text>

          <Text className="text-sm text-[#676B73]">
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      <Rating value={item.rating} />

      <Text className="text-sm font-Roboto text-[#363E4C] mt-2">
        {item.message}
      </Text>
    </View>
  );

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
        <ScrollView className="bg-[#F4F4F4]">
          <View className="bg-white px-2 py-2">
            <Header title={service?.service_name} showBackButton={true} />

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

            <Text className="font-Roboto-Medium text-lg mt-5">
              EGP {service?.base_price.toFixed(2)}
            </Text>
          </View>
          <View className="bg-white px-6 py-2">
            <Text className="text-2xl font-Roboto-SemiBold border-b border-gray-200 py-2 mb-4">
              Service Ratings & Reviews
            </Text>
            <View className="items-start gap-3 border-b border-gray-200 mb-4 pb-4">
              <Text className="text-xl font-Roboto-Medium">Overall Rating</Text>
              <Text className="text-2xl font-Roboto-Bold">
                {service?.rating_average.toFixed(2)}
              </Text>
              <Rating value={service?.rating_average} />
              <View className="border-t border-gray-200 py-4">
                <Text className="text-2xl font-Roboto-SemiBold text-[#147E93] mb-3">
                  ✨ How to write a helpful review
                </Text>

                <View className="space-y-3">
                  <View className="flex-row items-start">
                    <Ionicons
                      name="megaphone-outline"
                      size={20}
                      color="#147E93"
                    />
                    <Text className="ml-2 text-sm text-[#363E4C]">
                      Be specific about what you liked or didn’t like.
                    </Text>
                  </View>

                  <View className="flex-row items-start">
                    <Ionicons
                      name="chatbox-ellipses-outline"
                      size={20}
                      color="#147E93"
                    />
                    <Text className="ml-2 text-sm text-[#363E4C]">
                      Mention the quality of service and communication.
                    </Text>
                  </View>

                  <View className="flex-row items-start">
                    <Ionicons name="trophy-outline" size={20} color="#147E93" />
                    <Text className="ml-2 text-sm text-[#363E4C]">
                      Share if the service met or exceeded expectations.
                    </Text>
                  </View>

                  <View className="flex-row items-start">
                    <Ionicons name="bulb-outline" size={20} color="#147E93" />
                    <Text className="ml-2 text-sm text-[#363E4C]">
                      Suggest improvements or highlight standout aspects.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <FlatList
              data={feedbacks}
              keyExtractor={(item) => item._id}
              renderItem={renderReviewItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View className="flex-row justify-center xs:justify-between items-end sticky bottom-0 w-full">
            <TouchableOpacity
              className={`${service?.status === 'active' || service?.service_provider.full_name === user?.full_name ? 'bg-[#FDBD10]' : 'bg-[#D9DEE4]'} py-3 px-4 rounded-t-md w-full`}
              disabled={
                service?.service_provider.full_name !== user?.full_name &&
                service?.status !== 'active'
              }
              onPress={() => {
                if (service?.service_provider._id === user?._id) {
                  router.push(`/profile/edit-service/${service?._id}`);
                } else {
                  bookServiceHandler();
                }
              }}
            >
              <Text className="font-Roboto-Medium text-lg text-center">
                {service?.service_provider.full_name === user?.full_name
                  ? 'Edit your Service'
                  : `Open Chat with ${service?.service_provider.full_name}`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default ServiceDetailsPage;
