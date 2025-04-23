import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationIcon from '@/assets/icons/Notification';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

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
  const textStyle = getTextStyle(isRTL);

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
      
      <TouchableOpacity onPress={() => router.push('/notifications')}>
        <View className="relative">
          <NotificationIcon />
          {notificationsCount > 0 && (
            <View className="absolute top-0 right-0 bg-[#FF5757] rounded-full w-4 h-4 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {notificationsCount > 9 ? '9+' : notificationsCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
