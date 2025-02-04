import { View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const Header = () => {
  const router = useRouter();

  return (
    <>
      <View
        className="bg-[#147E93] w-full items-start"
        style={{
          height: 169,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else router.push('/');
          }}
        >
          <Image
            source={require('@/assets/images/whiteArrow.png')}
            style={{ marginTop: 50, marginLeft: 20 }}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <Image
          source={require('@/assets/images/buildings.png')}
          style={{
            width: screenWidth > 425 ? 390 : 320,
            marginRight: 'auto',
            marginLeft: 'auto',
          }}
          resizeMode="cover"
        />
      </View>
      <Image
        source={require('@/assets/images/icon.png')}
        style={{
          width: 67,
          height: 67,
          borderColor: 'white',
          borderWidth: 3,
          borderRadius: 8,
          marginTop: -33,
          marginLeft: 20,
        }}
        resizeMode="cover"
      />
    </>
  );
};

export default Header;
