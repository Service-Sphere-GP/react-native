import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useWindowDimensions } from 'react-native';

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

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between p-4 items-center">
        <View className="flex-row gap-4">
          <Image source={image} style={{ width: 40, height: 40 }} />
          <View className="justify-center">
            <Text
              className={`font-Roboto-Medium text-base ${title === 'Log out' ? 'text-red-500' : 'text-black'}`}
            >
              {title}
            </Text>
            {description && (
              <Text className="text-[#666B73] text-sm font-Roboto">
                {description}
              </Text>
            )}
          </View>
        </View>
        {width > 375 && (
          <Image source={require('@/assets/images/rightArrow.png')} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProfileDetail;
