import { View, Text, TextInput, useWindowDimensions, Image, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from "@expo/vector-icons"
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import { useRouter } from 'expo-router'
import Header from '@/components/Header';

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

const AllServices = () => {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState(servicesData);

  // Search function 
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredServices(servicesData); 
    } else {
      const filtered = servicesData.filter(service =>
        service.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Header 
        title="Services" 
        textSize="text-2xl" 
        showBackButton={false} 
        notificationsCount={4} 
      />
      

      {/* Search & Filter */}
      <View className="px-4 py-2 flex-row items-center justify-between mb-2">
        <View className="flex-row items-center bg-[#F8F8F8] rounded-lg px-2 py-2 flex-1 mr-3 shadow-sm h-10">
          <Ionicons name="search" size={20} color="#030B19" style={{ paddingLeft: 4 }} />
          <SafeAreaView style={{ flex: 1, marginHorizontal: 10 }}>
            <TextInput
              placeholder="Search..."
              clearButtonMode="always"
              value={searchQuery}
              onChangeText={handleSearch} 
              className="flex-1 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
              style={{
                paddingHorizontal: 5,
                paddingVertical: 5,
                borderWidth: 0,
              }}
            />
          </SafeAreaView>
        </View>

        <View className="w-10 h-10 bg-[#F8F8F8] rounded-lg justify-center items-center shadow-sm">
          <Image source={require('@/assets/images/filter.png')} resizeMode="contain" />
        </View>
      </View>

      {/* Services List */}
      <View className="flex-1 bg-[#FFFFFF] rounded-2xl mx-4 shadow-md mb-5">
        <FlatList 
          data={filteredServices}
          keyExtractor={(item) => item.id}
          className="px-4 pb-5"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/services/providerServices`)} // Navigate to provider services
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
  );
}

export default AllServices;