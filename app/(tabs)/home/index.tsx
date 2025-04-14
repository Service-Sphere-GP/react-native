import React from 'react';
import { View, Text, Image, ScrollView, FlatList } from 'react-native';
import NotificationIcon from '@/assets/icons/Notification';

const Dashboard = () => {
  const quickChats = [
    {
      id: '1',
      name: 'John Doe',
      image: require('@/assets/images/Profile.png'),
    },
    {
      id: '2',
      name: 'John Doe',
      image: require('@/assets/images/Profile.png'),
    },
    {
      id: '3',
      name: 'John Doe',
      image: require('@/assets/images/Profile.png'),
    },
    {
      id: '4',
      name: 'John Doe',
      image: require('@/assets/images/Profile.png'),
    },
    {
      id: '5',
      name: 'John Doe',
      image: require('@/assets/images/Profile.png'),
    },
    {
      id: '6',
      name: 'John Doe',
      image: require('@/assets/images/Profile.png'),
    },
  ];

  return (
    <ScrollView className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#2C8394] px-4 py-3 h-44">
        <View className="flex-row items-center mb-12">
          <Image
            source={require('@/assets/images/Profile.png')}
            className="rounded-full border-2  border-white"
            style={{ width: 53, height: 53 }}
          />
          <View className="flex-row items-center ml-3">
            <Text className="text-white text-lg font-Roboto-Medium mr-2">
              Hi John
            </Text>
            <Image
              source={require('@/assets/images/whiteverifyed.png')}
              style={{ width: 16, height: 16 }}
            />
          </View>
        </View>
        <View className="relative mb-12">
          <NotificationIcon color="#FFFFFF" />
          <View className="absolute -top-1 -right-1 bg-amber-500 w-5 h-5 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">4</Text>
          </View>
        </View>
      </View>

      {/* Feedback Insights */}
      <View className="bg-white rounded-2xl mx-4 p-4 -mt-20 shadow-sm ">
        <Text className="text-base font-Roboto-Medium text-[#030B19]">
          Feedback Insights
        </Text>
        <Text className="text-sm text-[#363E4C]">
          "Try to communicate more clearly and provide detailed responses to
          enhance collaboration"
        </Text>
      </View>
      <Text className="text-lg font-Roboto-Medium text-[#030B19] mx-4 mt-4">
        Quick Chats
      </Text>
      <View className="h-24">
        <FlatList
          data={quickChats}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, marginTop: 10 }}
          ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
          renderItem={({ item }) => (
            <View className="items-center mr-1">
              <Image
                source={item.image}
                className="w-[50px] h-[50px] rounded-full"
              />
              <Text className="text-xs text-gray-900 mt-1.5 text-center">
                {item.name}
              </Text>
            </View>
          )}
        />
      </View>
      <Text className="text-lg font-Roboto-Medium text-[#030B19] mx-4 mt-4">
        Performance Overview
      </Text>

      <View className="flex-row justify-between mt-2 mx-4 mb-6">
        <View className="flex-1 mr-2">
          <View className="bg-white rounded-lg items-center justify-center shadow-sm p-4">
            <Image
              source={require('@/assets/images/verifyedgreen.png')}
              style={{ width: 24, height: 24 }}
            />
            <Text className="text-xl font-Roboto-SemiBold text-[#030B19] mt-2">
              32
            </Text>
            <Text className="text-sm text-[#676B73] text-center mt-1">
              Completed Sessions
            </Text>
          </View>

          <View className="h-6" />

          <View className="bg-white rounded-lg items-center justify-center shadow-sm p-4">
            <Image
              source={require('@/assets/images/opened sessions.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
            <Text className="text-xl font-Roboto-SemiBold text-[#030B19] mt-2">
              6
            </Text>
            <Text className="text-sm text-[#676B73] text-center mt-1">
              Opened Sessions
            </Text>
          </View>
        </View>

        <View className="flex-1 ml-2">
          <View className="bg-white rounded-lg items-center justify-center shadow-sm p-4">
            <Image
              source={require('@/assets/images/st.png')}
              style={{ width: 24, height: 24 }}
            />
            <Text className="text-xl font-Roboto-SemiBold text-[#030B19] mt-2">
              4.2
            </Text>
            <Text className="text-sm text-[#676B73] text-center mt-1">
              Rating
            </Text>
          </View>

          <View className="h-6" />

          <View className="bg-white rounded-lg items-center justify-center shadow-sm p-4">
            <Image
              source={require('@/assets/images/verifyedgreen.png')}
              style={{ width: 24, height: 24 }}
            />
            <Text className="text-xl font-Roboto-SemiBold text-[#030B19] mt-2">
              90%
            </Text>
            <Text className="text-sm text-[#676B73] text-center mt-1">
              Completion Rate
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
