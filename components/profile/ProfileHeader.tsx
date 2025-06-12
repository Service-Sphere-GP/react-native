import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

const ProfileHeader = ({
  fullName,
  rating,
  role,
  onPress,
  imageUrl,
}: {
  fullName?: string | undefined;
  rating: number | undefined;
  role?: string | null;
  onPress?: () => void;
  imageUrl?: string | undefined;
}) => {
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  return (
    <TouchableOpacity
      className={`bg-[#147E93] ${!isRTL ? 'flex-row' : 'flex-row-reverse'} items-center w-full p-5 rounded-3xl shadow-md justify-between`}
      onPress={onPress}
      style={isRTL ? styles.containerRTL : {}}
    >
      <View
        className={`flex-row items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{
            borderColor: '#fff',
            borderRadius: 100,
            width: 60,
            height: 60,
          }}
        />
        <View>
          <Text
            className={`text-lg text-white font-medium ${textStyle.className}`}
          >
            {fullName}
          </Text>
          {role && (
            <Text
              className={`text-[#D9DEE4] text-sm font-light ${textStyle.className}`}
            >
              {role}
            </Text>
          )}
          <View
            className={`flex-row items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {rating ? (
              <>
                <Text className={`text-[#D9DEE4]`}>{rating?.toFixed(2)}</Text>
                <Rating
                  readonly
                  startingValue={rating || 0}
                  imageSize={15}
                  tintColor="#147E93"
                />
              </>
            ) :
              null}
          </View>
        </View>
      </View>
      {onPress && (
        <Image
          source={require('@/assets/images/whiteArrow.png')}
          style={!isRTL ? styles.flippedImage : {}}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  flippedImage: {
    transform: [{ scaleX: -1 }], // Horizontally flip the image
  },
});

export default ProfileHeader;
