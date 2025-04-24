import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationIcon from '@/assets/icons/Notification';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';
import { useNotifications } from '@/constants/NotificationContext';

interface HeaderProps {
  title?: string | undefined;
  showBackButton?: boolean | undefined;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
  const router = useRouter();
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);
  // Use the notification context to get the unread count
  const { unreadCount } = useNotifications();

  return (
    <View className={`flex-row items-center justify-between px-4 py-4 relative mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={isRTL ? require('@/assets/images/rightArrow.png') : require('@/assets/images/leftArrow.png')}
            className="w-full h-full"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      
      <Text 
        className={`text-xl text-[#030B19] ${showBackButton ? (isRTL ? 'mr-4' : 'ml-4') : ''} ${isRTL ? 'text-right' : 'text-left'}`}
        style={[textStyle.style, {flex: 1}]}
      >
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
