import { View, Text } from 'react-native';

const BookingText = () => {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-2">
        There are no current Bookings
      </Text>
      <Text className="text-base text-[#666]">
        Manage your appointments here.
      </Text>
    </View>
  );
};

export default BookingText;
