import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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
  service_provider_id: string;
  service_attributes: any[];
  status: string;
  _id: string;
  rating_average: number;
}

const ProviderServices = () => {
  const router = useRouter();

  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { width: screenWidth } = useWindowDimensions();
  const imageSize = screenWidth < 375 ? 45 : screenWidth < 768 ? 60 : 75;

  const [services, setServices] = useState<Service[]>();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response: any = await ApiService.get(
          API_ENDPOINTS.GET_PROVIDER_SERVICES.replace(':id', id as string),
        );
        setServices(response.data.data);
      } catch (error) {
        console.error('Failed to fetch services', error);
      }
    };

    fetchServices();
  }, [id]);

  return (
    <View className="flex-1 bg-[#F4F4F4]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative mt-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 w-6 h-6"
        >
          <Image
            source={require('@/assets/images/blackArrow.png')}
            className="w-full h-full"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text className="text-center text-[#030B19] font-Roboto-SemiBold text-lg">
          Provider Services
        </Text>

        <View className="absolute right-4">
          <View className="relative">
            <Ionicons name="notifications-outline" size={24} color="#030B19" />
            <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">4</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Services List */}
      <View className="bg-[#FFFFFF] rounded-2xl mx-2 xs:mx-4 xs:px-4 mb-5 px-2  flex-1">
        <FlatList
          data={services}
          keyExtractor={(item) => item._id}
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
              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[#030B19] font-bold text-sm xs:text-base">
                    {item.service_name}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#030B19" />
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
    </View>
  );
};

export default ProviderServices;
