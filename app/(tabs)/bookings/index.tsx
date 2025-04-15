import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';

const bookingsData = [
  {
    id: '1',
    name: 'Ali Elnaggar',
    service: 'Bedroom',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
  {
    id: '2',
    name: 'Ali Elnaggar',
    service: 'Arm Chair',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'closed',
  },
  {
    id: '3',
    name: 'Ali Elnaggar',
    service: 'Tuffet',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
  {
    id: '4',
    name: 'Ali Elnaggar',
    service: 'Plan chest',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'closed',
  },
  {
    id: '5',
    name: 'Ali Elnaggar',
    service: 'Dinette (group)',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
  {
    id: '6',
    name: 'Ali Elnaggar',
    service: 'Bar cabinet',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
  {
    id: '7',
    name: 'Ali Elnaggar',
    service: 'Bar cabinet',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
  {
    id: '8',
    name: 'Ali Elnaggar',
    service: 'Bar cabinet',
    price: '10.500$',
    cimg: require('@/assets/images/Profile.png'),
    status: 'open',
  },
];

const customerBookings = () => {
  const renderBookingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
    //   onPress={() => router.push('/bookings/customerBookings')} // Navigate to chat
    >
      <View
        className={`flex-row items-center justify-between ${item.id & 1 ? 'bg-white' : 'bg-[#F9F9F9]'} px-4 py-3`}
      >
        <View className="flex-row items-center">
          <Image
            source={item.cimg}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
          <View className="ml-3">
            <Text className="text-sm font-Roboto-Medium text-gray-900">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-500">{item.service}</Text>
          </View>
        </View>

        <View className="items-end mb-4">
          <Text className="text-xs font-Roboto text-gray-900">
            {item.price}
          </Text>
          {item.status === 'open' && (
            <View className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/*  Header */}
      <Header
        title="Bookings"
        textSize="text-xl"
        backRoute="/bookings/bookings"
        notificationsCount={4}
      />

      {/* Bookings List */}
      <View
        className="flex-1 bg-[#FFFFFF] rounded-2xl mx-4 shadow-md"
        style={{ marginBottom: 30 }}
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

      <TouchableOpacity
        // onPress={() => router.push('/bookings/addBooking')} // Navigate to the Add Booking screen
        className="bg-[#147E93] h-14 w-14 rounded-full items-center justify-center shadow-lg mb-4 mr-4 self-end"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default customerBookings;
