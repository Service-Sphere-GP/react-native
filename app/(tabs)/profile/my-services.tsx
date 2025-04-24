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
import { getTextStyle } from '@/src/utils/fontUtils';

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
  const textStyle = getTextStyle(isRTL);

  const { width: screenWidth } = useWindowDimensions();
  const [services, setServices] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(false);

  const imageSize = screenWidth < 375 ? 45 : screenWidth < 768 ? 60 : 75;

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
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
                      <View className={`flex-row justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Text 
                          className={`text-[#030B19] font-bold text-sm xs:text-base ${textStyle.className}`}
                          style={textStyle.style}
                        >
                          {item.service_name}
                        </Text>
                        <Ionicons
                          name={isRTL ? "chevron-back" : "chevron-forward"}
                          size={20}
                          color="#030B19"
                        />
                      </View>

                      <View className={`flex-row items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <View className={`flex-row items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Text 
                            className={`text-sm text-[#030B19] ${isRTL ? 'ml-1' : 'mr-1'} ${textStyle.className}`}
                            style={textStyle.style}
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
                          className={`text-[#030B19] font-semibold text-xs xs:text-sm ${textStyle.className}`}
                          style={textStyle.style}
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
              <Text 
                className={`text-[#666B73] font-Roboto-Medium text-lg ${textStyle.className}`}
                style={textStyle.style}
              >
                {t('services:noServicesFound')}
              </Text>
            </View>
          )}

          {/* Footer Button */}
          <View className="mt-4 px-4 mb-3">
            <TouchableOpacity
              className={` items-center ${isRTL ? 'justify-start flex-row-reverse' : 'justify-end flex-row'}`}
              onPress={() => router.push('/profile/new-service')}
            >
              <Text 
                className={`text-center font-Roboto-Medium text-base bg-[#FDBD10] rounded-md px-5 py-3 ${textStyle.className}`}
                style={textStyle.style}
              >
                {t('services:addNewService')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default MyServices;
