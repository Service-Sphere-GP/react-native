import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';

const ProfileHeader = ({
  firstName,
  LastName,
  rating,
  role,
  onPress,
}: {
  firstName: string | undefined;
  LastName: string | undefined;
  rating: number;
  role?: string | null;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      className="bg-[#147E93] w-full p-5 rounded-3xl shadow-md flex-row items-center justify-between"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-2">
        <Image
          source={require('@/assets/images/anonymous.jpg')}
          style={{
            borderColor: '#fff',
            borderRadius: 100,
            width: 60,
            height: 60,
          }}
        />
        <View>
          <Text className="font-Roboto-Medium text-lg text-white">
            {firstName} {LastName}
          </Text>
          {role && (
            <Text className="font-Roboto-Light text-[#D9DEE4] text-sm">
              {role}
            </Text>
          )}
          <View className="flex-row items-center gap-1">
            <Text className="text-[#D9DEE4]">{rating}</Text>
            <Rating
              readonly
              startingValue={rating}
              imageSize={15}
              tintColor="#147E93"
            />
          </View>
        </View>
      </View>
      {onPress && (
        <Image source={require('@/assets/images/RightWhiteArrow.png')} />
      )}
    </TouchableOpacity>
  );
};

export default ProfileHeader;
