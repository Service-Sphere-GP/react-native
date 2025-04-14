import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 
import Header from '@/components/Header'; 

const bookingsData = [
  {
    id: '1',
    name: 'Ali Elnaggar',
    service: 'Bedroom',
    message: 'did u finish the job yet or not?',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open', 
  },
  {
    id: '2',
    name: 'Ali Elnaggar',
    service: 'Arm Chair',
    message: 'did u finish the job yet or not?',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'closed',
  },
  {
    id: '3',
    name: 'Ali Elnaggar',
    service: 'Tuffet',
    message: 'did u finish the job yet or not?',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
  {
    id: '4',
    name: 'Ali Elnaggar',
    service: 'Plan chest',
    message: 'did u finish the job yet or not?',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'closed',
  },
  {
    id: '5',
    name: 'Ali Elnaggar',
    service: 'Dinette (group)',
    message: 'did u finish the job yet or not?',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
  {
    id: '6',
    name: 'Ali Elnaggar',
    service: 'Bar cabinet',
    message: 'did u finish the job yet or not?',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
  {
    id: '7',
    name: 'Ali Elnaggar',
    service: 'Bar cabinet',
    message: 'did u finish the job yet or not?',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
  {
    id: '8',
    name: 'Ali Elnaggar',
    service: 'Bar cabinet',
    message: 'did u finish the job yet or not?',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
];

const BookingsPage = () => {
  const router = useRouter(); 

  const renderBookingItem = ({ item }: { item: typeof bookingsData[0] }) => (
    <TouchableOpacity
      onPress={() => router.push('/bookings/customerBookings')} 
    >
      <View className="flex-row items-center justify-between bg-white px-4 py-3">
        <View className="flex-row items-center">
          <Image
            source={item.cimg}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
          <View className="ml-3">
            <Text className="text-sm font-Roboto-Medium text-[#030B19]">{item.name}</Text>
            <Text className="text-sm text-gray-500">{item.service}</Text>
            <Text className="text-xs text-gray-400">{item.message}</Text>
          </View>
        </View>

        <View className="items-end mb-4">
          <Text className="text-xs font-Roboto text-gray-900">{item.price}</Text>
          {item.status === 'open' && (
            <View className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Header
        title="Bookings"
        textSize="text-xl"
        backRoute="/home"
        notificationsCount={4}
      />

      {/* Bookings List */}
      <View
        className="flex-1 bg-[#FFFFFF] rounded-2xl mx-4 shadow-md"
        style={{ marginBottom: 80 }}
      >
        <FlatList
          data={bookingsData}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={{ paddingBottom: 16 }}
          style={{
            borderRadius: 20,
          }}
          showsVerticalScrollIndicator={false} 
        />
      </View>

    </View>
  );
};

export default BookingsPage;