import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatHeader from '@/components/Chat/chatHeader';
import MessageInput from '@/components/Chat/messageInput';
import { Ionicons } from '@expo/vector-icons';
import SocketService from '@/constants/SocketService';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import FeedbackModal from '@/components/Modals/FeedbackModal';
// Import translation hooks
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

// Message type definition
interface Message {
  _id?: string;
  id: string;
  sender: string;
  text: string;
  content?: string;
  time: string;
  createdAt?: string;
  isMe: boolean;
  status?: 'read' | 'unread';
  sender_id?: {
    _id: string;
    full_name: string;
    role: string;
    profile_image?: string;
  };
  receiver_id?: {
    _id: string;
    full_name: string;
    role: string;
    profile_image?: string;
  };
}

// Receiver details interface
interface ReceiverDetails {
  _id: string;
  full_name: string;
  profile_image?: string;
}

// Booking details interface
interface BookingDetails {
  _id: string;
  customer: {
    _id: string;
    full_name: string;
    profile_image: string;
  };
  status: string;
  service: {
    _id: string;
    service_name: string;
    base_price: string;
    service_provider: {
      _id: string;
      full_name: string;
      profile_image: string;
    };
  };
}

const ChatRoomScreen = () => {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [receiverDetails, setReceiverDetails] =
    useState<ReceiverDetails | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  // Add translation and RTL support
  const { t } = useTranslation(['chat', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  // Add state for feedback modal
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null,
  );

  // Fetch booking details
  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const response: any = await ApiService.get(
        `${API_ENDPOINTS.GET_BOOKING_DETAILS.replace(':id', bookingId)}`,
      );

      if (response.data && response.data.status === 'success') {
        setBookingDetails(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      return null;
    }
  };

  // Fetch receiver details
  const fetchReceiverDetails = async (bookingId: string) => {
    try {
      const bookingData = await fetchBookingDetails(bookingId);
      if (!bookingData) return null;

      // Get user data to determine if we're the customer or provider
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) return null;

      const userData = JSON.parse(userJson);

      // Determine who the receiver is based on current user role
      let receiverData;
      if (userData._id === bookingData.customer._id) {
        // Current user is customer, receiver is provider
        receiverData = {
          _id: bookingData.service.service_provider._id,
          full_name: bookingData.service.service_provider.full_name,
          profile_image: bookingData.service.service_provider.profile_image,
        };
      } else {
        // Current user is provider, receiver is customer
        receiverData = {
          _id: bookingData.customer._id,
          full_name: bookingData.customer.full_name,
          profile_image: bookingData.customer.profile_image,
        };
      }

      setReceiverDetails(receiverData);
      return receiverData;
    } catch (error) {
      console.error('Error fetching receiver details:', error);
      return null;
    }
  };

  // Open feedback modal
  const handleOpenFeedbackModal = () => {
    if (bookingDetails) {
      setIsFeedbackModalVisible(true);
    }
  };

  // Initialize socket connection
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // Connect to socket server
        await SocketService.connect();

        // Get current user ID from AsyncStorage by extracting it from the user object
        const userJson = await AsyncStorage.getItem('user');
        let userIdFromStorage = null;

        if (userJson) {
          const userData = JSON.parse(userJson);
          userIdFromStorage = userData._id;
          setUserId(userIdFromStorage);
        } else {
          console.warn('User not found in AsyncStorage');
        }

        // Fetch receiver details before joining the room
        if (bookingId) {
          await fetchReceiverDetails(bookingId);

          // Join the chat room for this booking
          SocketService.joinChatRoom(bookingId);
        }

        // Listen for chat history
        const socket = SocketService.getSocket();
        if (socket) {
          socket.on('chatHistory', (history: any[]) => {
            const formattedMessages = history.map((msg) =>
              formatMessageFromServer(msg, userIdFromStorage),
            );
            setMessages(formattedMessages);
            setLoading(false);

            // Scroll to bottom after history loads
            setTimeout(() => scrollToBottom(), 100);
          });

          // Listen for new messages
          socket.on('receiveMessage', (message: any) => {
            // Important: When receiving a message, ensure we're checking against our userId
            const formattedMessage = formatMessageFromServer(
              message,
              userIdFromStorage,
            );

            setMessages((prevMessages) => [...prevMessages, formattedMessage]);

            // Scroll to bottom when new message arrives
            setTimeout(() => scrollToBottom(), 100);
          });

          // Listen for socket errors
          socket.on('error', (error: string) => {
            console.error('Socket error:', error);
            // Add error handling logic here if needed
          });
        }
      } catch (error) {
        console.error('Socket connection failed:', error);
        setLoading(false);
      }
    };

    initializeSocket();

    // Cleanup function
    return () => {
      const socket = SocketService.getSocket();
      if (socket) {
        socket.off('chatHistory');
        socket.off('receiveMessage');
        socket.off('error');
      }
      SocketService.disconnect();
    };
  }, [bookingId]);

  // Add a ref to track receiverDetails
  const receiverDetailsRef = useRef<ReceiverDetails | null>(null);

  // Keep the ref synchronized with the state
  useEffect(() => {
    receiverDetailsRef.current = receiverDetails;
  }, [receiverDetails]);

  // Format message from server to match UI format
  const formatMessageFromServer = (
    message: any,
    currentUserId: string | null,
  ): Message => {
    // Extract sender ID whether it's a string or an object
    const senderId =
      typeof message.sender_id === 'string'
        ? message.sender_id
        : message.sender_id?._id;

    const isSentByMe = senderId === currentUserId;

    // Extract sender name
    let senderName = t('chat:user');
    if (typeof message.sender_id === 'object' && message.sender_id !== null) {
      senderName = message.sender_id.full_name || t('chat:user');
    } else {
      if (senderId === currentUserId) {
        senderName = t('chat:me');
      } else if (receiverDetailsRef.current) {
        // Use the ref to get the latest receiver details
        senderName = receiverDetailsRef.current.full_name;
      }
    }

    return {
      id: message._id || String(Date.now()),
      sender: senderName,
      text: message.content || '',
      time: formatTime(message.createdAt || new Date()),
      isMe: isSentByMe,
      status: 'unread',
      sender_id: message.sender_id,
      receiver_id: message.receiver_id,
    };
  };
  // Format time for display
  const formatTime = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Send a new message
  const sendMessage = (text: string) => {
    if (text.trim() === '' || !bookingId) return;

    try {
      // Send message to server
      SocketService.sendMessage(bookingId, text);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with receiver details */}
      <ChatHeader
        receiverName={receiverDetails?.full_name || 'Chat'}
        receiverImage={receiverDetails?.profile_image}
        onOpenFeedbackModal={handleOpenFeedbackModal}
      />

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-2"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text>{t('common:loading')}</Text>
          </View>
        ) : messages.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">{t('chat:noMessages')}</Text>
          </View>
        ) : (
          messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.isMe ? 'items-end' : 'items-start'}`}
            >
              {/* Sender's Info */}
              {!message.isMe && (
                <View
                  className={`flex-row items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Text className="text-sm text-[#6C757D]">
                    {message.sender}
                  </Text>
                </View>
              )}

              <View
                className={`max-w-[80%] ${
                  message.isMe ? 'bg-[#147E93] mb-1' : 'bg-[#E0E0E0]'
                } rounded-2xl px-4 py-2`}
              >
                {message.text && (
                  <Text
                    className={`text-base ${
                      message.isMe ? 'text-white' : 'text-[#030B19]'
                    }`}
                    style={{
                      ...textStyle.style,
                      textAlign: isRTL ? 'right' : 'left',
                    }}
                  >
                    {message.text}
                  </Text>
                )}
              </View>

              <View
                className={`flex-row items-start mt-1 ${
                  message.isMe ? 'justify-end' : 'justify-start'
                } ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Text
                  className={`text-xs ${
                    message.isMe ? 'text-[#6C757D] mb-6' : 'text-[#6C757D] mb-2'
                  }`}
                >
                  {message.time}
                </Text>
                {message.isMe && (
                  <Ionicons
                    name="checkmark-done"
                    size={16}
                    color={message.status === 'read' ? '#147E93' : '#6C757D'}
                    className={isRTL ? 'mr-1 mb-5' : 'ml-1 mb-5'}
                  />
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Message Input */}
      <MessageInput onSend={sendMessage} />

      {/* Feedback Modal */}
      {bookingDetails && (
        <FeedbackModal
          isVisible={isFeedbackModalVisible}
          onClose={() => setIsFeedbackModalVisible(false)}
          booking={bookingDetails}
        />
      )}
    </View>
  );
};

export default ChatRoomScreen;
