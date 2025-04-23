import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface ProfileDetailProps {
  title: string;
  description: null | string;
  image: any;
  onPress?: () => void;
}

const ProfileDetail = ({
  title,
  description,
  image,
  onPress,
}: ProfileDetailProps) => {
  const { width } = useWindowDimensions();
  const { isRTL } = useLanguage();

  return (
    <TouchableOpacity onPress={onPress}>
      <View className={`flex-row justify-between p-4 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <View className={`flex-row gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Image source={image} style={{ width: 40, height: 40 }} />
          <View className="justify-center">
            <Text
              className={`font-Roboto-Medium text-base ${title === 'Log out' || title === 'تسجيل الخروج' ? 'text-red-500' : 'text-black'} ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {title}
            </Text>
            {description && (
              <Text className={`text-[#666B73] text-sm font-Roboto ${isRTL ? 'text-right' : 'text-left'}`}>
                {description}
              </Text>
            )}
          </View>
        </View>
        {width > 375 && (
          <Image 
            source={require('@/assets/images/rightArrow.png')} 
            style={isRTL ? styles.flippedArrow : {}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flippedArrow: {
    transform: [{ scaleX: -1 }]
  }
});

export default ProfileDetail;
