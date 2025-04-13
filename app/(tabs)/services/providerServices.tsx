import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons"
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import Header from '@/components/Header';
import { useRouter } from 'expo-router'

const servicesData = [
  {
    id: '1',
    title: 'Living Room Setup',
    provider: 'Mark Johnson (Plumber)',
    rating: 4.7,
    price: '10.500$',
    image: require('@/assets/images/service1.png'),
  },
  {
    id: '2',
    title: 'Kitchen Remodeling',
    provider: 'Mark Johnson (Plumber)',
    rating: 4,
    price: '12.000$',
    image: require('@/assets/images/service2.png'),
  },
  {
    id: '3',
    title: 'Bedroom Decoration',
    provider: 'Mark Johnson (Plumber)',
    rating: 5,
    price: '8.500$',
    image: require('@/assets/images/service3.png'),
  },
  {
    id: '4',
    title: 'Office Furniture Setup',
    provider: 'David Martinez (Carpenter)',
    rating: 5,
    price: '8.500$',
    image: require('@/assets/images/service4.png'),
  },
  {
    id: '5',
    title: 'Bedroom Decoration',
    provider: 'Mark Johnson (Plumber)',
    rating: 5,
    price: '8.500$',
    image: require('@/assets/images/service5.png'),
  },
];

const providerServices = () => {
    const router = useRouter()
  return (
    <View className="flex-1 bg-[#F9F9F9]">
      {/* Header */}
      <Header 
        title="Services by (Provider Name)" 
        textSize="text-lg" 
        backRoute="/services/all-services" 
        notificationsCount={4} 
      />
      
      <View className="flex-1 bg-[#FFFFFF] rounded-2xl mx-4 shadow-md mb-4">
        <FlatList 
          data={servicesData}
          keyExtractor={(item) => item.id}
          className="px-4 pb-5"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/services/all-services`)} // Navigate to all services
              className="flex-row items-center justify-between bg-[#FFFFFF] py-3 px-3 "
            >
             
              <View className="flex-row items-center">
                <Image
                  source={item.image}
                  className="rounded-full mr-3"
                  style={{
                    width: 60,
                    height: 60,
                    maxWidth: 70, 
                    maxHeight: 70, 
                  }}
                  resizeMode="cover" 
                />
                <View>
                  <Text className="text-[#030B19] font-bold text-base">{item.title}</Text>
                  <Text className="text-gray-600 text-sm">{item.provider}</Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-sm text-[#030B19] mr-1">{item.rating}</Text>
                    <StarRatingDisplay rating={item.rating} starSize={14} starStyle={{ marginRight: 1 }} />
                  </View>
                </View>
              </View>
              
              <View className="items-end">
                <Text className="text-[#030B19] font-semibold text-sm">{item.price}</Text>
                <Ionicons name="chevron-forward" size={20} color="#030B19" />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>


    </View>
  )
}

export default providerServices