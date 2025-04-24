import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationIcon from '@/assets/icons/Notification';
import { useNotifications } from '@/constants/NotificationContext';

interface HeaderProps {
  title?: string | undefined;
  showBackButton?: boolean | undefined;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
  const router = useRouter();
  // Use the notification context to get the unread count
  const { unreadCount } = useNotifications();

  return (
    <View className="flex-row items-center justify-between px-4 py-4 relative mt-6">
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('@/assets/images/leftArrow.png')}
            className="w-full h-full"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      <Text className="text-center text-[#030B19] w-full font-Roboto-SemiBold text-2xl">
        {title}
      </Text>

      <View>
        <TouchableOpacity onPress={() => router.push('/profile/notification')}>
          <View className="relative">
            <NotificationIcon color="#030B19" />
            {unreadCount > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
