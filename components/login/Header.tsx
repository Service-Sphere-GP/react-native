import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/src/i18n/LanguageContext';

const screenWidth = Dimensions.get('window').width;

const Header = () => {
  const router = useRouter();
  const { isRTL } = useLanguage();

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
          style={{
            marginTop: 50,
            marginLeft: isRTL ? undefined : 20,
            marginRight: isRTL ? 20 : undefined,
            alignSelf: isRTL ? 'flex-end' : 'flex-start'
          }}
        >
          <Image
            source={require('@/assets/images/whiteArrow.png')}
            style={isRTL ? styles.flippedImage : {}}
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
          width: 100,
          height: 100,
          borderColor: 'white',
          borderWidth: 3,
          borderRadius: 8,
          marginTop: -40,
          marginLeft: isRTL ? undefined : 20,
          marginRight: isRTL ? 20 : undefined,
          alignSelf: isRTL ? 'flex-end' : 'flex-start'
        }}
        resizeMode="cover"
      />
    </>
  );
};

const styles = StyleSheet.create({
  flippedImage: {
    transform: [{ scaleX: -1 }] // Horizontally flip the image
  }
});

export default Header;
