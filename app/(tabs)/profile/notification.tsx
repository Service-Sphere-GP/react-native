import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import NotificationIcon from '@/assets/icons/Notification';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '@/constants/NotificationContext';

const notification = () => {
  const [loading, setLoading] = useState(false);
  // Use our notification context to get all notification data and methods
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    clearAllNotifications,
    refreshNotifications
  } = useNotifications();

  // Get appropriate avatar based on notification type
  const getNotificationAvatar = (type: string) => {
    // You can customize this based on notification types
    switch (type) {
      case 'booking':
        return require('@/assets/images/Profile.png');
      case 'status_change':
        return require('@/assets/images/Profile.png');
      case 'feedback':
        return require('@/assets/images/Profile.png');
      default:
        return require('@/assets/images/Profile.png');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <Text className="text-lg font-Roboto-Medium text-[#030B19]">
          Notifications
        </Text>
        <View className="absolute right-4">
          <NotificationIcon />
        </View>
      </View>

      {/* Notifications List */}
      <View
        className="flex-1 bg-[#FFFFFF] rounded-2xl mx-4"
        style={{ marginBottom: 40 }}
      >
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#147E93" />
          </View>
        ) : notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            style={{
              borderRadius: 20,
            }}
            onRefresh={() => {
              setLoading(true);
              refreshNotifications().finally(() => setLoading(false));
            }}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center bg-white px- py-3"
                onPress={() => {
                  if (!item.read) {
                    markAsRead(item._id);
                  }
                }}
              >
                <Image
                  source={getNotificationAvatar(item.type)}
                  className="w-12 h-12 rounded-full"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-[#030B19] font-Roboto-Medium">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-[#363E4C]">{item.message}</Text>
                  <Text className="text-xs text-gray-400 mt-1">
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
                {!item.read && (
                  <Ionicons
                    name="alert-circle-outline"
                    size={24}
                    color="#147E93"
                  />
                )}
              </TouchableOpacity>
            )}
          />
        ) : (
          <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
            <Text className="text-[#030B19] text-xl font-Roboto">
              There are no notifications
            </Text>
          </View>
        )}
      </View>

      {/* Footer Buttons */}
      <View className="flex-row px-4 py-4 justify-between">
        <TouchableOpacity
          className="bg-[#F9F9F9] px-6 py-3 rounded-lg shadow-md w-1/2 mr-2"
          onPress={markAllAsRead}
        >
          <Text className="text-[#030B19] text-sm font-Roboto text-center">
            Mark all as read
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#FF3B30] px-6 py-3 rounded-lg shadow-md w-1/2 ml-2"
          onPress={clearAllNotifications}
        >
          <Text className="text-[#FFFFFF] text-sm font-Roboto text-center">
            Clear All Notifications
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default notification;
