import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Rating } from 'react-native-ratings';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import ApiService from '@/constants/ApiService';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

interface Review {
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

const MyReviews = () => {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { t } = useTranslation(['reviews', 'profile', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [username, setUsername] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const userResponse: any = await ApiService.get(
          API_ENDPOINTS.GET_USER.replace(':id', id as string),
        );

        setUsername(userResponse.data.data.first_name);

        if (userResponse.data.data.role === 'customer') {
          const response: any = await ApiService.get(
            API_ENDPOINTS.GET_CUSTOMER_FEEDBACKS.replace(':id', id as string),
          );
          setReviews(response.data.data);
        } else if (userResponse.data.data.role === 'service_provider') {
          const response: any = await ApiService.get(
            API_ENDPOINTS.GET_PROVIDER_FEEDBACKS.replace(':id', id as string),
          );
          setReviews(response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id]);
  const renderReviewItem = ({ item }: { item: Review }) => (
    <View className="bg-white mx-1 px-2 py-3 border-b border-gray-200">
      {/* Review Details */}
      <View className={`flex-row gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Image
          source={{ uri: item.user.profile_image }}
          className={`w-12 h-12 rounded-full mt-1 ${isRTL ? 'ml-1' : 'mr-1'}`}
          resizeMode="cover"
        />

        <View>
          <Text 
            className={`text-base font-Roboto-Medium text-[#030B19] ${textStyle.className}`}
            style={textStyle.style}
          >
            {item.user.first_name} {item.user.last_name}
          </Text>

          <View className={`flex-row items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Text 
              className={`text-xs text-[#363E4C] ${textStyle.className}`}
              style={textStyle.style}
            >
              {item.rating.toFixed(2)}
            </Text>
            <Rating
              type="star"
              ratingCount={5}
              imageSize={12}
              startingValue={item.rating}
              readonly
            />
          </View>
          <Text 
            className={`text-xs text-[#676B73] ${textStyle.className}`}
            style={textStyle.style}
          >
            {new Date(item.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>
      <Text 
        className={`text-xs font-Roboto text-[#363E4C] mt-2 ${textStyle.className}`}
        style={textStyle.style}
      >
        {item.message}
      </Text>
    </View>
  );

  return (
    <>
      {loading ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View className="bg-[#F4F4F4] flex-1 px-4">
          <Header 
            title={t('profile:reviewsOf', { name: username })} 
            showBackButton={true} 
          />

          <View className="bg-white flex-1 rounded-t-2xl">
            {reviews.length > 0 ? (
              <FlatList
                data={reviews}
                keyExtractor={(item) => item._id}
                renderItem={renderReviewItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: 16,
                  paddingTop: 8,
                  paddingBottom: 16,
                }}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text 
                  className={`text-[#666B73] font-Roboto-Medium text-lg ${textStyle.className}`}
                  style={textStyle.style}
                >
                  {t('profile:noReviewsYet')}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default MyReviews;
