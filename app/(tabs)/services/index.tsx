import {
  View,
  Text,
  TextInput,
  Image,
  SafeAreaView,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import NotificationIcon from '@/assets/icons/Notification';
import { Ionicons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useRouter } from 'expo-router';

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
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  // Calculate image size based on screen width
  const imageSize = screenWidth < 375 ? 45 : screenWidth < 768 ? 60 : 75;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState(servicesData);

  // Search function
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredServices(servicesData);
    } else {
      const filtered = servicesData.filter((service) =>
        service.title.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredServices(filtered);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
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
        <View className="flex-row items-center bg-white rounded-lg px-2 py-2 flex-1 mr-3 h-10">
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
              value={searchQuery}
              onChangeText={handleSearch}
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

        <View className="w-10 h-10 bg-white rounded-lg justify-center items-center">
          <Image
            source={require('@/assets/images/filter.png')}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Services List */}
      <View className="bg-[#FFFFFF] rounded-2xl mx-2 xs:mx-4 xs:px-4 mb-5 px-2  flex-1">
        <FlatList
          data={servicesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/services/providerServices`)}
              className="flex-row py-3 w-full items-center"
            >
              <Image
                source={item.image}
                className="rounded-full mr-3"
                style={{
                  width: imageSize,
                  height: imageSize,
                }}
                resizeMode="cover"
              />
              <View className="flex-1 ">
                <Text className="text-[#030B19] font-bold text-sm xs:text-base">
                  {item.title}
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600 text-xs xs:text-sm flex-1 pr-2">
                    {item.provider}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#030B19" />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-sm text-[#030B19] mr-1">
                      {item.rating}
                    </Text>
                    <Rating
                      readonly
                      startingValue={item.rating}
                      imageSize={10}
                    />
                  </View>
                  <Text className="text-[#030B19] font-semibold text-xs xs:text-sm">
                    {item.price}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default AllServices;
