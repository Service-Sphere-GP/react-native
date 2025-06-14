import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

const aboutApp = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-4 mt-6 mb-8">
          <View className="bg-white rounded-3xl overflow-hidden">
            <TouchableOpacity className='p-4' onPress={() => router.push('/profile/me')}>
              <Image
                source={require('@/assets/images/back-Icon.png')}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
            <View className="px-6 pb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-16 h-16 sm:w-20 sm:h-20  rounded-2xl items-center justify-center mr-4">
                  <Image
                    source={require('@/assets/images/adaptive-icon.png')}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 16,
                      resizeMode: 'contain',
                    }}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-2xl sm:text-3xl font-Roboto-Bold mb-1">
                    <Text className="text-[#147E93]">Service</Text>
                    <Text className="text-[#FDBC10]">Sphere</Text>
                  </Text>
                  <Text className="text-base sm:text-lg font-Roboto-SemiBold text-gray-700 mb-1">
                    AI-powered Services
                  </Text>
                  <Text className="text-sm sm:text-base text-gray-500">
                    Connecting People • Optimizing Services
                  </Text>
                </View>
              </View>
            </View>

            <View className="px-6 pb-6">
              <View className="bg-gray-100 rounded-2xl p-4 sm:p-5 mb-4">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-100 rounded-full items-center justify-center mr-4 mt-1">
                    <Image
                      source={require('@/assets/images/vision.png')}
                      style={{
                        width: '80%',
                        height: '80%',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg sm:text-xl font-Roboto-Bold text-[#147E93] mb-2">
                      OUR VISION
                    </Text>
                    <Text className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Transforming the service marketplace with AI-driven
                      solutions
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-gray-100 rounded-2xl p-4 sm:p-5 mb-4">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full items-center justify-center mr-4 mt-1">
                    <Image
                      source={require('@/assets/images/analysis.png')}
                      style={{
                        width: '90%',
                        height: '90%',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg sm:text-xl font-Roboto-Bold text-[#147E93] mb-2">
                      WHAT WE DO
                    </Text>
                    <Text className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      AI feedback analysis, service provider validation,
                      predictive analytics
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-gray-100 rounded-2xl p-4 sm:p-5 mb-6">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-full items-center justify-center mr-4 mt-1">
                    <Image
                      source={require('@/assets/images/matters.png')}
                      style={{
                        width: '90%',
                        height: '90%',
                        borderRadius: 50,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg sm:text-xl font-Roboto-Bold text-[#147E93] mb-2">
                      WHY IT MATTERS
                    </Text>
                    <Text className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Enhancing user satisfaction, empowering local startups
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                className="bg-[#147E93] rounded-full py-4 sm:py-5 mb-6 active:bg-[#0F7A8C]"
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-Roboto-SemiBold text-base sm:text-lg">
                  Explore How It Works
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-between items-center">
                <View className="flex-1 items-center">
                  <Text className="text-2xl sm:text-3xl font-Roboto-Bold text-[#147E93] mb-1">
                    50K+
                  </Text>
                  <Text className="text-xs sm:text-sm text-gray-500 font-Roboto-Medium">
                    Users
                  </Text>
                </View>

                <View className="w-px h-12 bg-gray-200 mx-4" />

                <View className="flex-1 items-center">
                  <Text className="text-2xl sm:text-3xl font-Roboto-Bold text-[#147E93] mb-1">
                    120+
                  </Text>
                  <Text className="text-xs sm:text-sm text-gray-500 font-Roboto-Medium">
                    Services
                  </Text>
                </View>

                <View className="w-px h-12 bg-gray-200 mx-4" />

                <View className="flex-1 items-center">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-2xl sm:text-3xl font-Roboto-Bold text-[#147E93] mr-1">
                      4.8
                    </Text>
                    <Ionicons
                      name="star"
                      size={screenWidth < 400 ? 16 : 20}
                      color="#F59E0B"
                    />
                  </View>
                  <Text className="text-xs sm:text-sm text-gray-500 font-Roboto-Medium">
                    Rating
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default aboutApp;
