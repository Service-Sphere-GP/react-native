import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { Rating } from 'react-native-ratings';

const reviewsData = [
  {
    id: '1',
    name: 'Customer Name',
    rating: 4.7,
    date: '26/5/2025',
    review:
      'We create stylish and functional bedrooms tailored to your needs, offering high-quality furniture with elegant finishes. Transform your space with our expert craftsmanship!',
    Cimage: require('@/assets/images/Profile.png'), // Replace with actual image path
  },
  {
    id: '2',
    name: 'Customer Name',
    rating: 4,
    date: '26/5/2025',
    review:
      'We create stylish and functional bedrooms tailored to your needs, offering high-quality furniture with elegant finishes. Transform your space with our expert craftsmanship!',
    Cimage: require('@/assets/images/Profile.png'),
  },
  {
    id: '3',
    name: 'Customer Name',
    rating: 3,
    date: '26/5/2025',
    review:
      'We create stylish and functional bedrooms tailored to your needs, offering high-quality furniture with elegant finishes. Transform your space with our expert craftsmanship!',
    Cimage: require('@/assets/images/Profile.png'),
  },
  {
    id: '4',
    name: 'Customer Name',
    rating: 2.5,
    date: '26/5/2025',
    review:
      'We create stylish and functional bedrooms tailored to your needs, offering high-quality furniture with elegant finishes. Transform your space with our expert craftsmanship!',
    Cimage: require('@/assets/images/Profile.png'),
  },
  {
    id: '5',
    name: 'Customer Name',
    rating: 5,
    date: '26/5/2025',
    review:
      'We create stylish and functional bedrooms tailored to your needs, offering high-quality furniture with elegant finishes. Transform your space with our expert craftsmanship!',
    Cimage: require('@/assets/images/Profile.png'),
  },
];

const MyReviews = () => {
  const router = useRouter();
  const renderReviewItem = ({ item }: { item: (typeof reviewsData)[0] }) => (
    <TouchableOpacity
      onPress={() => router.push('/profile/userReviews')}
      className="bg-white rounded-2xl mx-1 p-3 flex-row items-start  "
    >
      <Image
        source={item.Cimage}
        className="w-12 h-12 rounded-full mt-1"
        resizeMode="cover"
      />

      {/* Review Details */}
      <View className="ml-4 flex-1">
        <Text className="text-base font-Roboto-Medium text-[#030B19] ">
          {item.name}
        </Text>

        <View className="flex-row items-center ">
          <Text className="text-xs text-[#363E4C] ">{item.rating}</Text>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={12}
            startingValue={item.rating}
            readonly
          />
        </View>
        <Text className="text-xs text-[#676B73]  ">{item.date}</Text>
        <Text className="text-xs font-Roboto text-[#363E4C] mt-2 ml-[-65] ">
          {item.review}
        </Text>
      </View>
      <View className="self-center">
        <Image
          source={require('@/assets/images/rightArrow.png')}
          className="w-4 h-4 mb-16"
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      {/* Header */}
      <Header
        title="My Reviews"
        textSize="text-lg"
        backRoute="/profile/me"
        notificationsCount={4}
      />

      <View
        className="flex-1 bg-[#FFFFFF] rounded-2xl mx-4 shadow-md"
        style={{ marginBottom: 15 }}
      >
        {/* Reviews List */}
        <FlatList
          data={reviewsData}
          keyExtractor={(item) => item.id}
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
  );
};

export default MyReviews;
