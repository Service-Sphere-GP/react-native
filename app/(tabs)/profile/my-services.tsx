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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

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

const MyServices = () => {
  const router = useRouter();

  const { width: screenWidth } = useWindowDimensions();
  const [services, setServices] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(false);

  const imageSize = screenWidth < 375 ? 45 : screenWidth < 768 ? 60 : 75;

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setServices(parsedUser.services);
        } else {
          setTimeout(() => {
            router.push('/customer/login');
          }, 100);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setTimeout(() => {
          router.push('/customer/login');
        }, 100);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

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
          <View className="flex-row items-center justify-center px-4 py-4 relative mt-6">
            <TouchableOpacity
              onPress={() => router.push('/profile/me')}
              className="absolute left-4 w-6 h-6"
            >
              <Image
                source={require('@/assets/images/blackArrow.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Text className="text-center text-[#030B19] font-Roboto-SemiBold text-xl">
              {' '}
              My Services
            </Text>

            <View className="absolute right-4">
              <View className="relative">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#030B19"
                />
                <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">4</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Services List */}
          {services?.length ? (
            <View className="bg-[#FFFFFF] rounded-2xl mx-2 xs:mx-4 xs:px-4 mb-5 px-2  flex-1">
              <FlatList
                data={services}
                keyExtractor={(service) => service._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/services/providerServices`)}
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
                          Moaz
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
                            4.5
                          </Text>
                          <Rating readonly startingValue={4.5} imageSize={10} />
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
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-[#666B73] font-Roboto-Medium text-lg">
                No services found
              </Text>
            </View>
          )}

          {/* Footer Button */}
          <View className="mt-4 px-4 mb-3">
            <TouchableOpacity
              className="flex-row items-center justify-end"
              onPress={() => router.push('/profile/new-service')}
            >
              <Text className="text-center font-Roboto-Medium text-base bg-[#FDBD10] rounded-md px-5 py-3">
                Add new service
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default MyServices;
