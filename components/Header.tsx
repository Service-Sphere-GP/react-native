import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationIcon from '@/assets/icons/Notification';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface HeaderProps {
  title?: string | undefined;
  notificationsCount?: number | undefined;
  showBackButton?: boolean | undefined;
}

const Header: React.FC<HeaderProps> = ({
  title,
  notificationsCount = 0,
  showBackButton = true,
}) => {
  const router = useRouter();
  const { isRTL } = useLanguage();

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

      <Text className="text-center text-[#030B19] w-full font-Roboto-SemiBold text-2xl">
        {title}
      </Text>

      <View>
        <TouchableOpacity onPress={() => router.push('/profile/notification')}>
          <View className="relative">
            <NotificationIcon color="#030B19" />
            {notificationsCount > 0 && (
              <View className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} bg-red-500 rounded-full w-5 h-5 items-center justify-center`}>
                <Text className="text-white text-xs font-bold">
                  {notificationsCount}
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
