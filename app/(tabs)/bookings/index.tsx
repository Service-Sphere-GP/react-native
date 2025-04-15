import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookingText from '@/components/BookingText';

interface BookingItem {
  _id: string;
  service: {
    service_name: string;
    base_price: string;
    service_provider: {
      full_name: string;
      profile_image: string;
    };
  };
}

const Booking = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Fetch bookings data from the API
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response: any = await ApiService.get(API_ENDPOINTS.GET_BOOKINGS);
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setRole(parsedUser.role);
        } else {
          router.push('/(otp)/customer/login');
        }
        setBookings(response.data.data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const renderBookingItem = ({
    item,
    index,
  }: {
    item: BookingItem;
    index: number;
  }) => {
    const service = item.service;
    const providerName = service.service_provider?.full_name;
    const providerImage = service.service_provider?.profile_image;
    const serviceName = service.service_name;
    const servicePrice = service.base_price;

    return (
      <TouchableOpacity>
        <View
          className={`flex-row items-center justify-between ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9F9F9]'} px-4 py-3`}
        >
          <View className="flex-row items-center">
            <Image
              source={{ uri: providerImage }}
              className="w-10 h-10 rounded-full"
              resizeMode="cover"
            />
            <View className="ml-3">
              <Text className="text-sm font-Roboto-Medium text-gray-900">
                {providerName}
              </Text>
              <Text className="text-sm text-gray-500">{serviceName}</Text>
            </View>
          </View>

          <View className="items-end mb-4">
            <Text className="text-xs font-Roboto text-gray-900">
              {servicePrice} EGP
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex items-center justify-center h-screen">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      {bookings.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <BookingText />
        </View>
      ) : (
        <View className="flex-1 bg-gray-100">
          {/* Header */}
          <Header
            title="Bookings"
            textSize="text-xl"
            backRoute="/bookings/bookings"
            notificationsCount={4}
          />

          {/* Bookings List */}
          <View
            className="flex-1 bg-[#FFFFFF] rounded-2xl mx-4"
            style={{ marginBottom: 30 }}
          >
            <FlatList
              data={bookings}
              keyExtractor={(item, index) => item._id || `booking-${index}`}
              renderItem={renderBookingItem}
              contentContainerStyle={{ paddingBottom: 16 }}
              style={{
                borderRadius: 20,
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {role === 'customer' ? (
            <TouchableOpacity
              onPress={() => router.push('/bookings')}
              className="bg-[#147E93] h-14 w-14 rounded-full items-center justify-center shadow-lg mb-4 mr-4 self-end"
            >
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </>
  );
};

export default Booking;
