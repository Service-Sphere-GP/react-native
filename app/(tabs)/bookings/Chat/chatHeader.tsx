import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ChatHeader = () => {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-sm mt-2 ">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => router.push('/bookings')}>
          <Image
            source={require('@/assets/images/leftArrow.png')}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Image
          source={require('@/assets/images/Profile.png')}
          className="rounded-full ml-4 "
          style={{ width: 40, height: 40 }}
        />
        <Text className="ml-2 text-lg font-Roboto-Medium text-[#030B19]">
          Ahmed Elnaggar
        </Text>
      </View>

      {/* Icons */}
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity>
          <Image
            source={require('@/assets/images/audiocall.png')}
            style={{ width: 24, height: 24 }}
            resizeMode="center"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('@/assets/images/videocall.png')}
            style={{ width: 24, height: 24 }}
            resizeMode="center"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="checkmark-circle" size={24} color="#147E93" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
