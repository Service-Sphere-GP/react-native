import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import NotificationIcon from '@/assets/icons/Notification'; // Import your custom Notification icon
import { Ionicons } from '@expo/vector-icons';

const notification = () => {
  const [notifications, setNotifications] = useState([
    { id: '1', name: 'Ahmed Elghazy', message: 'Sent you a message yesterday', avatar: require('@/assets/images/Profile.png'), read: false },
    { id: '2', name: 'Layla Hossam', message: 'rated your service with a bad rating check your feedback', avatar: require('@/assets/images/Profile.png'), read: false },
    { id: '3', name: 'Ahmed Elghazy', message: 'Sent you a message yesterday', avatar: require('@/assets/images/Profile.png'), read: true },
    { id: '4', name: 'Ahmed Elghazy', message: 'ended the session with you, provide a feedback to help others know Ahmed', avatar: require('@/assets/images/Profile.png'), read: true },
    { id: '5', name: 'Ahmed Elghazy', message: 'Sent you a message yesterday', avatar: require('@/assets/images/Profile.png'), read: false },
    { id: '6', name: 'Ahmed Elghazy', message: 'Sent you a message yesterday', avatar: require('@/assets/images/Profile.png'), read: true },
  ]);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <Text className="text-lg font-Roboto-Medium text-[#030B19]">Notifications</Text>
        <View className="absolute right-4">
          <NotificationIcon />
        </View>
      </View>

      {/* Notifications List */}
      <View
        className="flex-1 bg-[#FFFFFF] rounded-2xl mx-4 "
        style={{ marginBottom: 40 }}
      >
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            style={{
              borderRadius: 20,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="flex-row items-center bg-white px- py-3 ">
                <Image source={item.avatar} className="w-12 h-12 rounded-full" />
                <View className="flex-1 ml-4">
                  <Text className="text-[#030B19]">
                    <Text className="font-Roboto">{item.name} </Text>
                    <Text className="text-sm text-[#363E4C]">{item.message}</Text>
                  </Text>
                </View>
                {!item.read && (
                  <Ionicons name="alert-circle-outline" size={24} color="#147E93" />
                )}
              </View>
            )}
          />
        ) : (
          <View className="flex-1 justify-center items-center bg-[#F9F9F9] ">
            <Text className="text-[#030B19] text-xl font-Roboto">
              There are no currently notification
            </Text>
          </View>
        )}
      </View>

      {/* Footer Buttons */}
      <View className="flex-row justify-between px-4 py-4">
        <TouchableOpacity
          className="bg-[#F9F9F9] px-6 py-3 rounded-lg shadow-md"
          style={{ flex: 1, marginRight: 8 }}
          onPress={markAllAsRead}
        >
          <Text className="text-[#030B19] text-sm font-Roboto text-center  ">
            Mark all as read
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#FF3B30] px-6 py-3 rounded-lg shadow-md"
          style={{ flex: 1, marginLeft: 8 }}
          onPress={clearAllNotifications}
        >
          <Text className="text-[#FFFFFF] text-xs font-Roboto-Medium text-center">
            Clear All Notifications
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default notification;