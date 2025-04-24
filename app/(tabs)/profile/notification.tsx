import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import NotificationIcon from '@/assets/icons/Notification';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '@/constants/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

const notification = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['profile', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);
  
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
      <View className={`flex-row items-center justify-center px-4 py-4 relative ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Text 
          className="text-lg text-[#030B19] font-medium"
          style={textStyle.style}
        >
          {t('profile:notifications')}
        </Text>
        <View className={`absolute ${isRTL ? 'left-4' : 'right-4'}`}>
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
                className={`flex-row items-center bg-white py-3 ${isRTL ? 'flex-row-reverse' : ''}`}
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
                <View className={`flex-1 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                  <Text 
                    className="text-[#030B19] font-medium"
                    style={textStyle.style}
                  >
                    {item.title}
                  </Text>
                  <Text 
                    className="text-sm text-[#363E4C]"
                    style={textStyle.style}
                  >
                    {item.message}
                  </Text>
                  <Text 
                    className="text-xs text-gray-400 mt-1"
                    style={textStyle.style}
                  >
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
            <Text 
              className="text-[#030B19] text-xl"
              style={textStyle.style}
            >
              {t('profile:noNotifications')}
            </Text>
          </View>
        )}
      </View>

      {/* Footer Buttons */}
      <View className={`flex-row px-4 py-4 justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <TouchableOpacity
          className={`bg-[#F9F9F9] px-6 py-3 rounded-lg shadow-md w-1/2 ${isRTL ? 'ml-2' : 'mr-2'}`}
          onPress={markAllAsRead}
        >
          <Text 
            className="text-[#030B19] text-sm text-center"
            style={textStyle.style}
          >
            {t('profile:markAllRead')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`bg-[#FF3B30] px-6 py-3 rounded-lg shadow-md w-1/2 ${isRTL ? 'mr-2' : 'ml-2'}`}
          onPress={clearAllNotifications}
        >
          <Text 
            className="text-[#FFFFFF] text-sm text-center"
            style={textStyle.style}
          >
            {t('profile:clearAllNotifications')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default notification;
