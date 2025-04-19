import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { Rating } from 'react-native-ratings';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import ApiService from '@/constants/ApiService';

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
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response: any = await ApiService.get(
          API_ENDPOINTS.GET_MY_FEEDBACKS,
        );
        setReviews(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);
  const renderReviewItem = ({ item }: { item: Review }) => (
    <TouchableOpacity
      onPress={() => router.push('/profile/userReviews')}
      className="bg-white mx-1 px-2 py-3 flex-row items-start border-b border-[#E5E5E5]"
    >
      <Image
        source={{ uri: item.user.profile_image }}
        className="w-12 h-12 rounded-full mt-1"
        resizeMode="cover"
      />

      {/* Review Details */}
      <View className="ml-4 flex-1">
        <Text className="text-base font-Roboto-Medium text-[#030B19]">
          {item.user.first_name} {item.user.last_name}
        </Text>

        <View className="flex-row items-center gap-2">
          <Text className="text-xs text-[#363E4C]">
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
        <Text className="text-xs text-[#676B73]">
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
        <Text className="text-xs font-Roboto text-[#363E4C] mt-2 ml-[-65]">
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {loading ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View className="bg-[#F4F4F4]">
          <Header
            title="My Reviews"
            showBackButton={true}
            notificationsCount={4}
          />

          <View
            className="flex-1 bg-[#FFFFFF] rounded-2xl mx-4"
            style={{ marginBottom: 15 }}
          >
            {/* Reviews List */}
            <FlatList
              data={reviews}
              keyExtractor={(item) => item._id}
              renderItem={renderReviewItem}
              contentContainerStyle={{
                paddingBottom: 16,
              }}
              style={{
                borderRadius: 20,
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default MyReviews;
