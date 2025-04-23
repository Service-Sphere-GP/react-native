import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookingText from '@/components/BookingText';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface BookingItem {
  _id: string;
  customer: {
    full_name: string;
    profile_image: string;
  };
  status: string;
  service: {
    _id: string;
    service_name: string;
    base_price: string;
    service_provider: {
      full_name: string;
      profile_image: string;
    };
  };
}

const Booking = () => {
  const { t } = useTranslation(['bookings', 'common', 'services']);
  const { isRTL } = useLanguage();

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem>(
    {} as BookingItem,
  );
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Fetch bookings data from the API
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setRole(parsedUser.role);
        } else {
          router.push('/(otp)/customer/login');
        }

        if (role === 'customer') {
          const response: any = await ApiService.get(
            API_ENDPOINTS.GET_CUSTOMER_BOOKINGS,
          );
          setBookings(response.data.data || []);
        } else if (role === 'service_provider') {
          const response: any = await ApiService.get(
            API_ENDPOINTS.GET_PROVIDER_BOOKINGS,
          );
          setBookings(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [role]);

  const confirmBookingHandler = async (booking: BookingItem) => {
    try {
      await ApiService.patch(
        API_ENDPOINTS.CHANGE_BOOKING_STATUS.replace(':id', booking._id),
        {
          status: 'confirmed',
        },
      );
      // update only this booking in state
      setBookings(prev =>
        prev.map(b =>
          b._id === booking._id ? { ...b, status: 'confirmed' } : b
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const rejectBookingHandler = async (booking: BookingItem) => {
    try {
      await ApiService.patch(
        API_ENDPOINTS.CHANGE_BOOKING_STATUS.replace(':id', booking._id),
        {
          status: 'cancelled',
        },
      );
      setBookings(prev =>
        prev.map(b =>
          b._id === booking._id ? { ...b, status: 'cancelled' } : b
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseFeedbackModal = () => {
    setModalVisible(false);
    setSelectedBooking({} as BookingItem);
    setFeedback('');
    setRating(0);
  };

  const handleSubmitFeedback = async () => {
    // Here you would implement the API call to submit feedback
    const changeStatusResponse = await ApiService.patch(
      API_ENDPOINTS.CHANGE_BOOKING_STATUS.replace(':id', selectedBooking._id),
      {
        status: 'completed',
      },
    );

    console.log('changeStatusResponse', changeStatusResponse);

    if (
      changeStatusResponse.status === 200 ||
      changeStatusResponse.status === 201
    ) {
      const feedbackResponse = await ApiService.post(
        API_ENDPOINTS.SEND_FEEDBACK,
        {
          rating,
          message: feedback,
          service: selectedBooking.service._id,
          booking: selectedBooking._id,
        },
      );

      if (feedbackResponse.status === 200 || feedbackResponse.status === 201) {
        console.log(feedbackResponse.data);
        console.log('Feedback submitted successfully');
      } else {
        console.error('Failed to submit feedback');
      }
    } else {
      console.error('Failed to submit feedback');
    }
    // For now, just close the modal
    handleCloseFeedbackModal();
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={30}
            color={i <= rating ? '#FFD700' : '#C4C4C4'}
            style={{ marginHorizontal: 5 }}
          />
        </TouchableOpacity>,
      );
    }
    return stars;
  };

  const renderBookingItem = ({
    item,
    index,
  }: {
    item: BookingItem;
    index: number;
  }) => {
    const service = item.service;
    const providerName = service.service_provider?.full_name;
    const customerName = item.customer?.full_name;
    const providerImage = service.service_provider?.profile_image;
    const customerImage = item.customer?.profile_image;
    const serviceName = service.service_name;
    const servicePrice = service.base_price;
    const bookingStatus = item.status;

    return (
      <TouchableOpacity
        onPress={() => router.push('/bookings/Chat/ChatRoomScreen')}
      >
        <View
          className={`flex-row items-center justify-between ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9F9F9]'} px-4 py-3 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Image
              source={{
                uri: role === 'customer' ? providerImage : customerImage,
              }}
              className="w-10 h-10 rounded-full"
              resizeMode="cover"
            />
            <View className={`${isRTL ? 'mr-3 items-end' : 'ml-3'}`}>
              <Text className={`text-sm font-Roboto-Medium text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {role === 'customer' ? `${providerName}` : `${customerName}`}
              </Text>
              <Text className={`text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>{serviceName}</Text>
            </View>
          </View>

          <View className="items-end flex-col-reverse gap-1">
            <Text className="text-xs font-Roboto text-gray-900">
              {servicePrice} {t('services:currency')}
            </Text>
            {role === 'service_provider' && bookingStatus === 'pending' ? (
              <View className={`flex-row gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TouchableOpacity
                  onPress={() => {
                    confirmBookingHandler(item);
                  }}
                  className="bg-[#3BB143] px-3 py-1 rounded-full"
                >
                  <Ionicons
                    name="checkmark-outline"
                    size={16}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    rejectBookingHandler(item);
                  }}
                  className="bg-[#FF5757] px-3 py-1 rounded-full"
                >
                  <Ionicons name="close-outline" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text
                className={`text-xs font-Roboto px-2 py-1 rounded-full ${
                  bookingStatus === 'pending'
                    ? 'text-[#FFBF00] bg-[#FFBF00]/20'
                    : bookingStatus === 'confirmed'
                      ? 'text-[#3BB143] bg-[#3BB143]/20'
                      : bookingStatus === 'cancelled'
                        ? 'text-[#FF5757] bg-[#FF5757]/20'
                        : bookingStatus === 'completed'
                          ? 'text-[#147E93] bg-[#147E93]/20'
                          : ''
                }`}
              >
                {bookingStatus === 'pending'
                  ? t('bookings:pending')
                  : bookingStatus === 'confirmed'
                    ? t('bookings:confirmed')
                    : bookingStatus === 'cancelled'
                      ? t('bookings:rejected')
                      : bookingStatus === 'completed'
                        ? t('bookings:completed')
                        : ''}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex items-center justify-center h-screen">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">{t('common:loading')}</Text>
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
            title={t('bookings:title')}
            showBackButton={false}
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
              className={`bg-[#147E93] h-14 w-14 rounded-full items-center justify-center shadow-lg mb-4 ${isRTL ? 'ml-4 self-start' : 'mr-4 self-end'}`}
            >
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseFeedbackModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-80 bg-white rounded-2xl p-6 shadow-lg">
            <Text className={`text-xl text-center font-bold text-[#147E93] mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('bookings:leaveFeedback')}
            </Text>

            <Text className={`text-base mb-3 text-gray-700 self-start ${isRTL ? 'self-end text-right' : 'self-start text-left'}`}>
              {t('bookings:rateService')}
            </Text>

            <View className={`flex-row justify-center mb-5 space-x-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {renderStars()}
            </View>

            <TextInput
              className={`w-full border border-gray-300 rounded-lg p-3 h-24 ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder={t('bookings:tellExperience')}
              multiline
              textAlignVertical="top"
              value={feedback}
              onChangeText={setFeedback}
              style={{
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr',
              }}
            />

            <View className={`flex-row justify-between w-full mt-6 space-x-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TouchableOpacity
                className="px-4 py-2 rounded-lg bg-gray-200 flex-1 items-center"
                onPress={handleCloseFeedbackModal}
              >
                <Text className="text-gray-700 font-semibold">
                  {t('bookings:cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-4 py-2 rounded-lg bg-[#147E93] flex-1 items-center disabled:opacity-50"
                onPress={handleSubmitFeedback}
                disabled={rating === 0}
              >
                <Text className="text-white font-semibold">
                  {t('bookings:submit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Booking;
