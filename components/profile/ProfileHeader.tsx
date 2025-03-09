import { View, Text, Image } from 'react-native';
import { Rating } from 'react-native-ratings';

const ProfileHeader = ({
  firstName,
  LastName,
  rating,
  role,
}: {
  firstName: string | undefined;
  LastName: string | undefined;
  rating: number;
  role?: string | null;
}) => {
  return (
    <View className="bg-[#147E93] w-full p-5 rounded-3xl shadow-md flex-row items-center gap-2">
      <Image
        source={require('@/assets/images/UserImage.png')}
        style={{
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 100,
        }}
      />
      <View className=''>
        <Text className="font-Roboto-Medium text-lg text-white">
          {firstName} {LastName}
        </Text>
        {role && (
          <Text className="font-Roboto-Light text-[#D9DEE4] text-sm">{role}</Text>
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
  );
};

export default ProfileHeader;
