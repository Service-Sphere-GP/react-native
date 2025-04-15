import {
  View,
  Text,
  TextInput,
  Image,
  SafeAreaView,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import NotificationIcon from '@/assets/icons/Notification';
import { Ionicons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useRouter } from 'expo-router';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';

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
  };
  status: string;
  _id: string;
  rating_average: number;
}

const AllServices = () => {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  // Calculate image size based on screen width
  const imageSize = screenWidth < 375 ? 45 : screenWidth < 768 ? 60 : 75;

  const [services, setServices] = useState<Service[]>([]); // Initialize services as an empty array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response: any = await ApiService.get(API_ENDPOINTS.GET_SERVICES);
        setServices(response.data.data);
      } catch (error) {
        console.error('Failed to fetch services', error);
        if ((error as any)?.response?.status === 401) {
          // Redirect to login if unauthorized
          router.push('/(otp)/customer/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [router]);

  return (
    <>
      {loading ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <SafeAreaView className="flex-1 bg-[#F4F4F4]">
          {/* Header */}
          <View className="flex-row items-center justify-center px-4 py-4 relative mt-6">
            <Text className="text-center text-[#030B19] font-Roboto-SemiBold text-2xl">
              Services
            </Text>
            <View style={{ position: 'absolute', right: 16, marginBottom: 23 }}>
              <View className="absolute right-4">
                <View className="relative ">
                  <NotificationIcon />
                  <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-white text-xs font-bold">4</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Search & Filter */}
          <View className="px-4 py-2 flex-row items-center justify-between mb-2">
            <View className="flex-row items-center bg-white rounded-lg px-2 py-2 flex-1 h-10">
              <Ionicons
                name="search"
                size={20}
                color="#030B19"
                style={{ paddingLeft: 4 }}
              />
              <SafeAreaView style={{ flex: 1, marginHorizontal: 10 }}>
                <TextInput
                  placeholder="Search..."
                  clearButtonMode="always"
                  className="flex-1 text-base text-[#666B73]"
                  placeholderTextColor="#666B73"
                  style={{
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    borderWidth: 0,
                  }}
                />
              </SafeAreaView>
            </View>
          </View>

          {/* Services List */}
          <View className="bg-[#FFFFFF] rounded-2xl mx-2 xs:mx-4 xs:px-4 mb-5 px-2  flex-1">
            <FlatList
              data={services}
              keyExtractor={(services) => services._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/services/${item._id}`)}
                  className="flex-row py-3 w-full items-center"
                >
                  <Image
                    source={{ uri: item.images[0] }}
                    className="rounded-full mr-3"
                    style={{
                      width: imageSize,
                      height: imageSize,
                    }}
                    resizeMode="cover"
                  />
                  <View className="flex-1 ">
                    <Text className="text-[#030B19] font-bold text-sm xs:text-base">
                      {item.service_name}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-600 text-xs xs:text-sm flex-1 pr-2">
                        {item.service_provider.full_name}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#030B19"
                      />
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-1">
                        <Text className="text-sm text-[#030B19] mr-1">
                          {item.rating_average}
                        </Text>
                        <Rating
                          readonly
                          startingValue={item.rating_average}
                          imageSize={10}
                        />
                      </View>
                      <Text className="text-[#030B19] font-semibold text-xs xs:text-sm">
                        {item.base_price} EGP
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default AllServices;
