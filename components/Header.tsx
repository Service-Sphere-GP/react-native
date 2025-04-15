import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationIcon from '@/assets/icons/Notification'; 

interface HeaderProps {
  title: string; 
  textSize?: string; 
  backRoute?: string; 
  notificationsCount?: number; 
  showBackButton?: boolean; 
}

const Header: React.FC<HeaderProps> = ({
  title,
  textSize = 'text-xl', 
  backRoute = '', 
  notificationsCount = 0,
  showBackButton = true,
}) => {
  const router = useRouter(); 

  return (
    <View className="flex-row items-center justify-center px-4 py-4 relative mt-6">
      {showBackButton && (
        <TouchableOpacity 
          onPress={() => router.push(backRoute as any)} 
          className="absolute left-4 w-6 h-6"
        >
          <Image
            source={require('@/assets/images/leftArrow.png')}
            className="w-full h-full"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      
      <Text className={`text-center text-[#030B19] font-Roboto-SemiBold ${textSize}`}>
        {title}
      </Text>

      <View className="absolute right-4">
        <TouchableOpacity onPress={() => router.push('/profile/notification')}>
          <View className="relative">
            <NotificationIcon color="#030B19" /> 
            {notificationsCount > 0 && (
              <View className="absolute -top-2 -right-2 bg-[#FDBC10] rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">{notificationsCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;