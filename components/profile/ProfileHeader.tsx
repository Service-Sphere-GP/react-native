import { View, Text, Image } from 'react-native';
import React from 'react';

const ProfileHeader = ({
  firstName,
  LastName,
  rating,
}: {
  firstName: string;
  LastName: string;
  rating: number;
}) => {
  return (
    <View className="bg-[#147E93] w-full p-5 rounded-3xl shadow-md flex-row gap-2">
      <Image
        source={require('@/assets/images/UserImage.png')}
        style={{
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 100,
        }}
      />
      <View>
        <Text className="font-Roboto-Medium text-lg text-white">
          {firstName} {LastName}
        </Text>
        <Text className="text-[#D9DEE4]">{rating}</Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
