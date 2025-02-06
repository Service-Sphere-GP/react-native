import { View, Image } from 'react-native';

const Footer = () => {
  return (
    <View className="flex-row justify-between items-end w-full absolute bottom-0">
      <Image
        source={require('@/assets/images/footer1.png')}
        resizeMode="cover"
        style={{ marginLeft: -1 }}
      />
      <Image
        source={require('@/assets/images/footer2.png')}
        resizeMode="cover"
      />
    </View>
  );
};

export default Footer;
