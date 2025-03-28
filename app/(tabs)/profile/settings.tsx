import {
  View,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import NotificationIcon from '@/assets/icons/Notification';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';

const Settings = () => {
  interface User {
    _id: string;
    full_name: string;
    role: string;
    email: string;
    password: string;
    created_at: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          setTimeout(() => {
            router.push('/customer/login');
          }, 100);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setTimeout(() => {
          router.push('/customer/login');
        }, 100);
      }
    };

    checkUser();
  }, [router]);

  const handleDeleteAccount = () => {
    setModalVisible(false);
    if (user?.role === 'customer') {
      ApiService.delete(
        API_ENDPOINTS.Delete_CUSTOMER.replace(':id', user._id as string),
      )
        .then(() => {
          AsyncStorage.clear();
          router.replace('/customer/login');
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      ApiService.delete(
        API_ENDPOINTS.Delete_PROVIDER.replace(':id', user?._id as string),
      )
        .then(() => {
          AsyncStorage.clear();
          router.replace('/provider/login');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  let created_at = '';
  if (user) {
    const date = new Date(user.created_at);
    created_at = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-[80%] items-center">
            <Text className="font-Roboto-Bold text-xl text-center mb-4">
              Delete Account
            </Text>
            <Text className="font-Roboto text-base text-center mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Text>
            <View className="w-full gap-2 flex-col-reverse">
              <TouchableOpacity
                className="bg-gray-300 rounded-xl py-3 px-6"
                onPress={() => setModalVisible(false)}
              >
                <Text className="font-Roboto-Medium text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 rounded-xl py-3 px-6"
                onPress={handleDeleteAccount}
              >
                <Text className="font-Roboto-Medium text-white text-center">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {user ? (
        <View className="px-1 py-4 xs:px-4 mt-12 gap-4">
          <View className="flex-row justify-between mr-2">
            <TouchableOpacity
              onPress={() => router.push('/profile/me')}
              className="flex-row items-center"
            >
              <Image source={require('@/assets/images/blackArrow.png')} />
            </TouchableOpacity>
            <Text className="font-Roboto-Medium text-xl flex-1 text-center">
              Personal Data
            </Text>
            <NotificationIcon />
          </View>
          <View>
            <Image
              source={require('@/assets/images/anonymous.jpg')}
              style={{
                width: 118,
                height: 118,
                borderRadius: 50,
                alignSelf: 'center',
                marginTop: 10,
              }}
            />
            <Image
              source={require('@/assets/images/edit.png')}
              style={{
                width: 36,
                height: 36,
                borderRadius: 50,
                alignSelf: 'center',
                marginTop: -30,
                marginLeft: 70,
              }}
            />
          </View>

          <View className="bg-white rounded-3xl w-full p-3">
            <Text className="font-Roboto-Medium text-lg">Full Name</Text>
            <TextInput
              placeholder={user.full_name}
              className="border border-[#EDEDED] placeholder:text-[#363E4C] rounded-md h-12 px-2 mb-2 font-Roboto text-base focus:outline-[#147E93]"
              inputMode="text"
            />
            <Text className="font-Roboto-Medium text-lg">Email</Text>
            <TextInput
              placeholder={user.email}
              className="border border-[#EDEDED] placeholder:text-[#363E4C] rounded-md h-12 px-2 mb-2 font-Roboto text-base focus:outline-[#147E93]"
              inputMode="email"
            />
            <Text className="font-Roboto-Medium text-lg">Password</Text>
            <TextInput
              placeholder="Enter new password"
              className="border border-[#EDEDED] placeholder:text-[#363E4C] rounded-md h-12 px-2 mb-2 font-Roboto text-base focus:outline-[#147E93]"
            />
          </View>

          <View className="flex-row justify-between">
            <View className="flex-row gap-1 items-center">
              <Text className="font-Roboto text-lg">Joined</Text>
              <Text className="font-Roboto text-lg text-[#363E4C]">
                {created_at}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-red-500 rounded-xl shadow-md items-center px-6 py-3"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white font-Roboto-Medium text-base">
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default Settings;
