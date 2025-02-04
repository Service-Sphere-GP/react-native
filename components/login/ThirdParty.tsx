import { View, Image } from 'react-native';
import React from 'react';

const iconMap: { [key: string]: any } = {
  facebook: require('@/assets/images/facebook.png'),
  google: require('@/assets/images/google.png'),
  apple: require('@/assets/images/apple.png'),
};

const ThirdParty = ({ icon }: { icon: string }) => {
  const iconSource = iconMap[icon];

  return (
    <View className="p-3 mt-5 border border-black/20 rounded-full">
      <Image source={iconSource}  resizeMode="cover" 
        style={{ width: 30, height: 30 }}
      />
    </View>
  );
};

export default ThirdParty;
