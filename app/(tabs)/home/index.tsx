import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import NotificationIcon from '@/assets/icons/Notification';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { useNotifications } from '@/constants/NotificationContext';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

interface BookingItem {
  _id: string;
  customer: {
    full_name: string;
    profile_image?: string;
  };
  service: {
    service_name: string;
    service_provider: {
      full_name: string;
      profile_image?: string;
    };
  };
  status: string;
}

const Dashboard = () => {
  const { t } = useTranslation(['home', 'common']);
  const { isRTL } = useLanguage();
  const router = useRouter();

  const { unreadCount } = useNotifications();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [userName, setUserName] = useState('User');
  const [userImage, setUserImage] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [advice, setAdvice] = useState('');
  const [showFullAdvice, setShowFullAdvice] = useState(false);
  const [loadingAdvice, setLoadingAdvice] = useState(true);
  const { width } = useWindowDimensions();

  // Add state for performance metrics
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [openedSessions, setOpenedSessions] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [rating, setRating] = useState(0);

  // Add state for customer view
  const [recommendedServices, setRecommendedServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  // Add state for sentiment analysis
  const [positiveFeedbacks, setPositiveFeedbacks] = useState(0);
  const [negativeFeedbacks, setNegativeFeedbacks] = useState(0);
  const [loadingSentiment, setLoadingSentiment] = useState(false);

  // Get user data and bookings
  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        // Get user data
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserName(parsedUser.full_name?.split(' ')[0] || 'User');
          setUserImage(parsedUser.profile_image);
          setUserRole(parsedUser.role);
          setRating(parsedUser.rating_average || 0);

          // Load stored advice for service providers
          if (parsedUser.role === 'service_provider') {
            const storedAdvice = await AsyncStorage.getItem('stored_advice');
            if (storedAdvice) {
              setAdvice(storedAdvice);
            }
            setLoadingAdvice(false);

            // Fetch sentiment analysis
            fetchSentimentAnalysis();
          }

          // Get all bookings based on user role
          const endpoint =
            parsedUser.role === 'customer'
              ? API_ENDPOINTS.GET_CUSTOMER_BOOKINGS
              : API_ENDPOINTS.GET_PROVIDER_BOOKINGS;

          const response: any = await ApiService.get(endpoint);

          if (response.data && response.data.data) {
            const allBookingsData = response.data.data;
            setAllBookings(allBookingsData);

            // Filter bookings by status
            const confirmedBookings = allBookingsData.filter(
              (booking: BookingItem) => booking.status === 'confirmed',
            );
            const completedBookings = allBookingsData.filter(
              (booking: BookingItem) => booking.status === 'completed',
            );

            // Update metrics
            setBookings(confirmedBookings); // For quick chats
            setCompletedSessions(completedBookings.length);
            setOpenedSessions(confirmedBookings.length);

            // Calculate completion rate
            const totalBookings = allBookingsData.length;
            const completionRateValue =
              totalBookings > 0
                ? Math.round((completedBookings.length / totalBookings) * 100)
                : 0;

            setCompletionRate(completionRateValue);

            // For customer view - set recent bookings
            if (parsedUser.role === 'customer') {
              // Sort by date and take most recent 3
              const sortedBookings = [...allBookingsData]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 3);
              setRecentBookings(sortedBookings);

              // Also fetch recommended services and categories for customer view
              try {
                const servicesResponse: any = await ApiService.get(
                  API_ENDPOINTS.GET_SERVICES,
                );
                if (servicesResponse.data && servicesResponse.data.data) {
                  // Get top rated services
                  const servicesData = servicesResponse.data.data;
                  const recommended = servicesData
                    .filter((service: any) => service.rating_average >= 4)
                    .slice(0, 5);
                  setRecommendedServices(recommended);
                }

                const categoriesResponse: any = await ApiService.get(
                  API_ENDPOINTS.GET_CATEGORIES,
                );
                if (categoriesResponse.data && categoriesResponse.data.data) {
                  setCategories(categoriesResponse.data.data);
                }
              } catch (error) {
                console.error('Error fetching services or categories:', error);
              }
            }
          }
        }

        // Get advice for service providers only
        // if (userRole === 'service_provider') {
        //   setLoadingAdvice(true);
        //   const adviceResponse: any = await ApiService.get(
        //     API_ENDPOINTS.ADVICE,
        //   );

        //   if (
        //     adviceResponse.data &&
        //     adviceResponse.data.data &&
        //     adviceResponse.data.data.advice
        //   ) {
        //     setAdvice(adviceResponse.data.data.advice);
        //   }
        //   setLoadingAdvice(false);
        // }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoadingAdvice(false);
      }
    };

    fetchUserAndBookings();
  }, [userRole]);

  // Navigate to chat with booking
  const handleChatPress = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  };

  // Fetch sentiment analysis for service providers
  const fetchSentimentAnalysis = async () => {
    try {
      setLoadingSentiment(true);
      const response: any = await ApiService.get(
        API_ENDPOINTS.GET_MY_FEEDBACKS,
      );

      if (response.data && response.data.data) {
        const feedbacks = response.data.data;
        const positive = feedbacks.filter(
          (feedback: any) => feedback.sentiment === 'positive',
        ).length;
        const negative = feedbacks.filter(
          (feedback: any) => feedback.sentiment === 'negative',
        ).length;

        setPositiveFeedbacks(positive);
        setNegativeFeedbacks(negative);
      }
    } catch (error) {
      console.error('Error fetching sentiment analysis:', error);
    } finally {
      setLoadingSentiment(false);
    }
  };

  // Convert markdown to HTML
  const markdownToHtml = (markdown: string) => {
    if (!markdown) return '';

    // Basic markdown to HTML conversion
    return (
      markdown
        // Convert headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        // Convert bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Convert emphasis/italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Convert bullet lists
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gm, '<ul>$1</ul>')
        // Convert links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // convert points
        .replace(/^\- (.*$)/gm, '<ul>$1</ul>')
        // Convert paragraphs (add line breaks)
        .replace(/\n\n/g, '<br /><br />')
    );
  };

  // Get the first two lines of advice
  const getTruncatedAdvice = () => {
    if (!advice) return '';
    const lines = advice.split('\n').filter((line) => line.trim() !== '');
    const truncated = lines.slice(0, 2).join('\n');
    return markdownToHtml(truncated);
  };

  // Function to navigate to service details
  const handleServicePress = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  // Function to navigate to category listings
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/services?category=${categoryId}`);
  };

  // Function to navigate to booking details
  const handleBookingPress = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  };

  // Function to load new advice
  const loadNewAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const response: any = await ApiService.get(API_ENDPOINTS.ADVICE);
      if (response.data && response.data.data && response.data.data.advice) {
        const newAdvice = response.data.data.advice;
        setAdvice(newAdvice);
        // Store the advice in AsyncStorage
        await AsyncStorage.setItem('stored_advice', newAdvice);
      }
    } catch (error) {
      console.error('Error fetching advice:', error);
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <ScrollView className="flex-1">
      {/* Header */}
      <View
        className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between bg-[#2C8394] px-4 h-44`}
        style={{ paddingTop: 20 }} // Adjust for status bar height
      >
        <View
          className={`flex-row items-center mb-12 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Image
            source={
              userImage
                ? { uri: userImage }
                : require('@/assets/images/Profile.png')
            }
            className="rounded-full border-2 border-white"
            style={{ width: 53, height: 53 }}
          />
          <View
            className={`flex-row items-center ${isRTL ? 'mr-3 flex-row-reverse' : 'ml-3'}`}
          >
            <Text
              className={`text-white text-lg font-medium ${isRTL ? 'ml-2' : 'mr-2'} `}
            >
              {t('home:hi')} {userName}
            </Text>
            <Image
              source={require('@/assets/images/whiteverifyed.png')}
              style={{ width: 16, height: 16 }}
            />
          </View>
        </View>
        <View className="relative mb-12">
          <TouchableOpacity
            onPress={() => router.push('/profile/notification')}
          >
            <NotificationIcon color="#FFFFFF" />

            <View
              className={`absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full items-center justify-center`}
            >
              <Text className="text-white text-xs font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Show different content based on user role */}
      {userRole === 'customer' ? (
        // Customer View
        <>
          {/* Welcome Card */}
          <View className="bg-white rounded-2xl mx-4 p-4 -mt-16 shadow-sm">
            <Text className={`text-base font-medium text-[#030B19]`}>
              {t('home:welcomeMessage')}
            </Text>
            <Text className={`text-sm text-[#363E4C] mt-2`}>
              {t('home:exploreServices')}
            </Text>

            <View
              className={`mt-3 flex-row ${isRTL ? 'justify-end' : 'justify-start'}`}
            >
              <TouchableOpacity
                className="bg-[#FDBC10] px-4 py-2 rounded-md"
                onPress={() => router.push('/services')}
              >
                <Text className="text-[#030B19] font-medium">
                  {t('home:exploreNow')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Categories */}
          <Text
            className={`text-lg font-medium text-[#030B19] mx-4 mt-4 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {t('home:categories')}
          </Text>
          <View className="h-20">
            <FlatList
              data={categories}
              horizontal
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, marginTop: 10 }}
              ItemSeparatorComponent={() => <View className="w-4" />}
              inverted={isRTL}
              ListEmptyComponent={() => (
                <View
                  style={{
                    width: width - 32,
                    alignItems: isRTL ? 'flex-end' : 'flex-start',
                  }}
                  className="justify-center px-4"
                >
                  <Text className={`text-[#676B73] text-sm`}>
                    {t('home:noCategories')}
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-gradient-to-br from-[#2C8394] to-[#147E93] rounded-xl px-4 py-3 min-w-[120px] items-center justify-center shadow-lg"
                  style={{
                    shadowColor: '#2C8394',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    elevation: 6,
                    backgroundColor: '#2C8394',
                  }}
                  onPress={() => handleCategoryPress(item._id)}
                >
                  <Text
                    className={`text-white font-semibold text-sm text-center ${isRTL ? 'text-right' : 'text-left'}`}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Recommended Services */}
          <Text
            className={`text-lg font-medium text-[#030B19] mx-4 mt-3 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {t('home:recommended')}
          </Text>
          <View className="mb-3">
            <FlatList
              data={recommendedServices}
              horizontal
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
              inverted={isRTL}
              ItemSeparatorComponent={() => <View className="w-3" />}
              ListEmptyComponent={() => (
                <View
                  style={{
                    width: width - 32,
                    alignItems: isRTL ? 'flex-end' : 'flex-start',
                  }}
                  className="justify-center px-4"
                >
                  <Text className={`text-[#676B73] text-sm`}>
                    {t('home:noRecommendations')}
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-white rounded-lg shadow-sm w-56 overflow-hidden"
                  onPress={() => handleServicePress(item._id)}
                >
                  <Image
                    source={{ uri: item.images[0] }}
                    className="w-full h-24"
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <Text
                      className={`font-medium text-[#030B19] ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {item.service_name}
                    </Text>
                    <View
                      className={` items-center mt-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Image
                        source={require('@/assets/images/st.png')}
                        style={{ width: 12, height: 12 }}
                      />
                      <Text
                        className={`text-xs text-gray-600 ${isRTL ? 'mr-1' : 'ml-1'}`}
                      >
                        {item.rating_average
                          ? item.rating_average.toFixed(1)
                          : '0.0'}{' '}
                      </Text>
                    </View>
                    <Text
                      className={`text-[#147E93] text-sm mt-2 ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {item.base_price} {t('services:currency')}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Recent Bookings */}
          <Text
            className={`text-lg font-medium text-[#030B19] mx-4 my-2 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {t('home:recentBookings')}
          </Text>
          <View className="px-4 pb-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <TouchableOpacity
                  key={booking._id}
                  className={`flex-row bg-white rounded-lg shadow-sm p-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                  onPress={() => handleBookingPress(booking._id)}
                  disabled={booking.status !== 'confirmed'}
                >
                  <Image
                    source={{ uri: booking.service.images[0] }}
                    className="w-16 h-16 rounded-lg"
                    resizeMode="cover"
                  />
                  <View
                    className={`${isRTL ? 'mr-3' : 'ml-3'} flex-1 justify-center`}
                  >
                    <Text
                      className={`font-medium text-[#030B19] ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {booking.service.service_name}
                    </Text>
                    <Text
                      className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {t(`bookings:${booking.status.toLowerCase()}`)}
                    </Text>
                    <Text
                      className={`text-xs text-gray-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {new Date(booking.createdAt).toLocaleDateString(
                        isRTL ? 'ar-EG' : 'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        },
                      )}
                    </Text>
                  </View>
                  <View className={`justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                    <Image
                      source={require('@/assets/images/rightArrow.png')}
                      style={{
                        transform: [{ scaleX: isRTL ? -1 : 1 }],
                      }}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="items-center justify-center py-6 bg-white rounded-lg">
                <Text className="text-[#676B73]">
                  {t('home:noRecentBookings')}
                </Text>
                <TouchableOpacity
                  className="mt-3 bg-[#FDBC10] px-4 py-2 rounded-md"
                  onPress={() => router.push('/services')}
                >
                  <Text className="text-[#030B19] font-medium">
                    {t('home:bookNow')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      ) : (
        // Service Provider View - original content
        <>
          {/* Feedback Insights */}
          <View className="bg-white rounded-2xl mx-4 p-4 -mt-16 shadow-sm">
            <Text className={`text-base font-medium text-[#030B19]`}>
              {t('home:feedbackInsights')}
            </Text>

            {advice ? (
              <>
                {/* Using RenderHtml with ScrollView for full advice */}
                {showFullAdvice ? (
                  <ScrollView
                    style={{
                      maxHeight: 200, // Fixed height for scrollable area
                      marginVertical: 8,
                    }}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    <RenderHtml
                      contentWidth={width - 40} // Account for padding
                      source={{
                        html: markdownToHtml(advice),
                      }}
                      tagsStyles={{
                        body: {
                          fontSize: 14,
                          color: '#363E4C',
                          marginVertical: 4,
                        },
                        h1: {
                          fontSize: 18,
                          color: '#030B19',
                          marginVertical: 4,
                        },
                        h2: {
                          fontSize: 16,
                          color: '#363E4C',
                          marginVertical: 3,
                        },
                        a: { color: '#147E93' },
                        ul: { marginVertical: 4 },
                        li: { marginBottom: 2 },
                      }}
                    />
                  </ScrollView>
                ) : (
                  <RenderHtml
                    contentWidth={width - 40} // Account for padding
                    source={{
                      html: getTruncatedAdvice(),
                    }}
                    tagsStyles={{
                      body: {
                        fontSize: 14,
                        color: '#363E4C',
                        marginVertical: 4,
                      },
                      h1: { fontSize: 18, color: '#030B19', marginVertical: 4 },
                      h2: { fontSize: 16, color: '#363E4C', marginVertical: 3 },
                      a: { color: '#147E93' },
                      ul: { marginVertical: 4 },
                      li: { marginBottom: 2 },
                    }}
                  />
                )}

                {/* See More/See Less Toggle Button */}
                {advice &&
                  advice.split('\n').filter((line) => line.trim() !== '')
                    .length > 2 && (
                    <TouchableOpacity
                      className="mt-2"
                      onPress={() => setShowFullAdvice(!showFullAdvice)}
                    >
                      <Text className="text-[#147E93] text-sm font-medium">
                        {showFullAdvice
                          ? t('home:showLess')
                          : t('home:seeMore')}
                      </Text>
                    </TouchableOpacity>
                  )}

                {/* Load New Advice Button */}
                <TouchableOpacity
                  className="bg-gradient-to-r from-[#2C8394] to-[#147E93] px-6 py-3 rounded-xl mt-4 shadow-lg"
                  style={{
                    backgroundColor: '#2C8394',
                    shadowColor: '#2C8394',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                  onPress={loadNewAdvice}
                  disabled={loadingAdvice}
                >
                  <View
                    className={`flex-row items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {loadingAdvice ? (
                      <>
                        <ActivityIndicator
                          size="small"
                          color="#FFFFFF"
                          className={isRTL ? 'ml-2' : 'mr-2'}
                        />
                        <Text className="text-white font-semibold text-base">
                          {t('home:loadingAdvice')}
                        </Text>
                      </>
                    ) : (
                      <>
                        {/* Use a circular arrow or sync icon effect */}
                        <View
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            borderWidth: 2,
                            borderColor: '#FFFFFF',
                            borderTopColor: 'transparent',
                            marginRight: isRTL ? 0 : 8,
                            marginLeft: isRTL ? 8 : 0,
                            transform: [{ rotate: '45deg' }],
                          }}
                        />
                        <Text className="text-white font-semibold text-base">
                          {t('home:loadNewAdvice')}
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <View className="mt-4">
                <Text className="text-[#676B73] text-sm mb-4 text-center">
                  {t('home:noAdviceYet')}
                </Text>
                <TouchableOpacity
                  className="bg-gradient-to-r from-[#FDBC10] to-[#F5A623] px-6 py-4 rounded-xl shadow-lg"
                  style={{
                    backgroundColor: '#FDBC10',
                    shadowColor: '#FDBC10',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                  onPress={loadNewAdvice}
                  disabled={loadingAdvice}
                >
                  <View
                    className={`flex-row items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {loadingAdvice ? (
                      <>
                        <ActivityIndicator
                          size="small"
                          color="#030B19"
                          className={isRTL ? 'ml-2' : 'mr-2'}
                        />
                        <Text className="text-[#030B19] font-bold text-base">
                          {t('home:loadingAdvice')}
                        </Text>
                      </>
                    ) : (
                      <>
                        {/* Use a lightbulb-like icon made from basic shapes */}
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            marginRight: isRTL ? 0 : 8,
                            marginLeft: isRTL ? 8 : 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <View
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 6,
                              backgroundColor: '#030B19',
                              marginBottom: 2,
                            }}
                          />
                          <View
                            style={{
                              width: 8,
                              height: 4,
                              backgroundColor: '#030B19',
                              borderRadius: 2,
                            }}
                          />
                        </View>
                        <Text className="text-[#030B19] font-bold text-base">
                          {t('home:getAdvice')}
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text className={`text-lg font-medium text-[#030B19] mx-4 mt-4`}>
            {t('home:quickChats')}
          </Text>
          <View className="h-24">
            <FlatList
              data={bookings}
              horizontal
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{ paddingHorizontal: 16, marginTop: 10 }}
              ItemSeparatorComponent={() => <View className="w-2" />}
              ListEmptyComponent={() => (
                <View className="items-center justify-center px-4">
                  <Text className="text-[#676B73] text-sm">
                    {t('home:noConfirmedBookings')}
                  </Text>
                </View>
              )}
              renderItem={({ item }) => {
                // Determine which name/image to show based on user role
                const name =
                  userRole === 'customer'
                    ? item.service.service_provider.full_name
                    : item.customer.full_name;

                const image =
                  userRole === 'customer'
                    ? item.service.service_provider.profile_image
                    : item.customer.profile_image;

                return (
                  <TouchableOpacity
                    className="items-center mr-1"
                    onPress={() => handleChatPress(item._id)}
                  >
                    <Image
                      source={
                        image
                          ? { uri: image }
                          : require('@/assets/images/Profile.png')
                      }
                      className="w-[50px] h-[50px] rounded-full"
                    />
                    <Text
                      className={`text-xs text-gray-900 mt-1.5 text-center `}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          <Text className={`text-lg font-medium text-[#030B19] mx-4 mt-4 `}>
            {t('home:performanceOverview')}
          </Text>

          <View
            className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between mt-2 mx-4 mb-6`}
          >
            <View className={`flex-1 ${isRTL ? 'ml-2' : 'mr-2'}`}>
              <View className="bg-white rounded-lg items-center justify-center shadow-sm p-4">
                <Image
                  source={require('@/assets/images/verifyedgreen.png')}
                  style={{ width: 24, height: 24 }}
                />
                <Text className={`text-xl font-semibold text-[#030B19] mt-2 `}>
                  {completedSessions}
                </Text>
                <Text className={`text-sm text-[#676B73] text-center mt-1 `}>
                  {t('home:completedSessions')}
                </Text>
              </View>

              <View className="h-6" />

              <View className="bg-white rounded-lg items-center justify-center shadow-sm p-4">
                <Image
                  source={require('@/assets/images/opened sessions.png')}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
                <Text className={`text-xl font-semibold text-[#030B19] mt-2 `}>
                  {openedSessions}
                </Text>
                <Text className={`text-sm text-[#676B73] text-center mt-1 `}>
                  {t('home:openedSessions')}
                </Text>
              </View>
            </View>

            <View className={`flex-1 ${isRTL ? 'mr-2' : 'ml-2'}`}>
              <View className="bg-white rounded-lg items-center justify-center shadow-sm p-4">
                <Image
                  source={require('@/assets/images/st.png')}
                  style={{ width: 24, height: 24 }}
                />
                <Text className={`text-xl font-semibold text-[#030B19] mt-2 `}>
                  {rating.toFixed(1)}
                </Text>
                <Text className={`text-sm text-[#676B73] text-center mt-1 `}>
                  {t('home:rating')}
                </Text>
              </View>

              <View className="h-6" />

              <View className="bg-white rounded-lg items-center justify-center shadow-sm p-4">
                <Image
                  source={require('@/assets/images/verifyedgreen.png')}
                  style={{ width: 24, height: 24 }}
                />
                <Text className={`text-xl font-semibold text-[#030B19] mt-2 `}>
                  {completionRate}%
                </Text>
                <Text className={`text-sm text-[#676B73] text-center mt-1 `}>
                  {t('home:completionRate')}
                </Text>
              </View>
            </View>
          </View>

          {/* Sentiment Analysis Section */}
          <Text className={`text-lg font-medium text-[#030B19] mx-4 mt-4 `}>
            {t('home:sentimentAnalysis')}
          </Text>

          <View
            className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between mt-2 mx-4 mb-6`}
          >
            <View className={`flex-1 ${isRTL ? 'ml-2' : 'mr-2'}`}>
              <View className="bg-white rounded-lg items-center justify-center shadow-sm p-4">
                {loadingSentiment ? (
                  <ActivityIndicator size="small" color="#34C759" />
                ) : (
                  <>
                    <View className="bg-green-100 rounded-full w-12 h-12 items-center justify-center mb-2">
                      <Text style={{ fontSize: 20 }}>😊</Text>
                    </View>
                    <Text
                      className={`text-xl font-semibold text-[#030B19] mt-2 `}
                    >
                      {positiveFeedbacks}
                    </Text>
                    <Text
                      className={`text-sm text-[#676B73] text-center mt-1 `}
                    >
                      {t('home:positiveFeedbacks')}
                    </Text>
                  </>
                )}
              </View>
            </View>

            <View className={`flex-1 ${isRTL ? 'mr-2' : 'ml-2'}`}>
              <View className="bg-white rounded-lg items-center justify-center shadow-sm p-4">
                {loadingSentiment ? (
                  <ActivityIndicator size="small" color="#FF3B30" />
                ) : (
                  <>
                    <View className="bg-red-100 rounded-full w-12 h-12 items-center justify-center mb-2">
                      <Text style={{ fontSize: 20 }}>😞</Text>
                    </View>
                    <Text
                      className={`text-xl font-semibold text-[#030B19] mt-2 `}
                    >
                      {negativeFeedbacks}
                    </Text>
                    <Text
                      className={`text-sm text-[#676B73] text-center mt-1 `}
                    >
                      {t('home:negativeFeedbacks')}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Dashboard;
