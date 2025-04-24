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

const ProviderServices = () => {
  const router = useRouter();
  const { t } = useTranslation(['services', 'common', 'profile']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

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
      <Header title={t('profile:services')} showBackButton={true} />

      {/* Services List */}
      <View className="bg-[#FFFFFF] rounded-2xl mx-2 xs:mx-4 xs:px-4 mb-5 px-2 flex-1">
        <FlatList
          data={services}
          keyExtractor={(item) => item._id}
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
                    className={`text-[#030B19] font-bold text-sm xs:text-base ${textStyle.className}`}
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
                      className={`text-sm text-[#030B19] ${isRTL ? 'ml-1' : 'mr-1'} ${textStyle.className}`}
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
    </View>
  );
};

export default ProviderServices;
