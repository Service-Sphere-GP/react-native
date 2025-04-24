import {
  View,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import Header from '@/components/Header';
import * as ImagePicker from 'expo-image-picker';

const Settings = () => {
  interface User {
    _id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    role: string;
    email: string;
    password: string;
    created_at: string;
    business_name?: string;
    business_address?: string;
    profile_image?: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isFormModified, setIsFormModified] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setImage(parsedUser.profile_image || null);
          setFormData({
            first_name: parsedUser.first_name,
            last_name: parsedUser.last_name,
            business_name: parsedUser.business_name,
            business_address: parsedUser.business_address,
            profile_image: parsedUser.profile_image,
          });
        } else {
          setTimeout(() => {
            router.push('/(otp)/customer/login');
          }, 100);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setTimeout(() => {
          router.push('/(otp)/customer/login');
        }, 100);
      }
    };

    checkUser();

    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert(
            'Sorry, we need camera roll permissions to change your profile picture!',
          );
        }
      }
    })();
  }, [router]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        setFormData((prev) => ({ ...prev, profile_image: uri }));
        setIsFormModified(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (user) {
      const isModified =
        newFormData.first_name !== user.first_name ||
        newFormData.last_name !== user.last_name ||
        newFormData.profile_image !== user.profile_image ||
        (user.role === 'service_provider' &&
          (newFormData.business_name !== user.business_name ||
            newFormData.business_address !== user.business_address));

      setIsFormModified(isModified);
    }
  };

  const handleSaveChanges = async () => {
    if (!user || !isFormModified) return;

    try {
      const formDataObj = new FormData();

      // Add text fields
      if (formData.first_name)
        formDataObj.append('first_name', formData.first_name);
      if (formData.last_name)
        formDataObj.append('last_name', formData.last_name);
      formDataObj.append(
        'full_name',
        `${formData.first_name || user.first_name} ${formData.last_name || user.last_name}`,
      );

      if (user.role === 'service_provider') {
        if (formData.business_name)
          formDataObj.append('business_name', formData.business_name);
        if (formData.business_address)
          formDataObj.append('business_address', formData.business_address);
      }

      // Handle image upload similar to service creation
      if (
        formData.profile_image &&
        formData.profile_image !== user.profile_image
      ) {
        const response = await fetch(formData.profile_image);
        const blob = await response.blob();
        formDataObj.append('profile_image', blob, `profile_${Date.now()}.jpg`);
      }

      const endpoint =
        user.role === 'customer'
          ? API_ENDPOINTS.UPDATE_CUSTOMER.replace(':id', user._id)
          : API_ENDPOINTS.UPDATE_PROVIDER.replace(':id', user._id);

      const response: any = await ApiService.patch(endpoint, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => data,
      });

      if (response.data) {
        // Get updated data from both response and formData
        const serverData = response.data.data || response.data;
        const newFirstName =
          serverData.first_name || formData.first_name || user.first_name;
        const newLastName =
          serverData.last_name || formData.last_name || user.last_name;

        const updatedUser = {
          ...user,
          ...serverData,
          first_name: newFirstName,
          last_name: newLastName,
          full_name: `${newFirstName} ${newLastName}`,
          profile_image: serverData.profile_image || user.profile_image,
        };

        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setImage(updatedUser.profile_image);
        setIsFormModified(false);
        alert('Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Update failed:', error.response?.data || error.message);
      alert(`Update failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteAccount = () => {
    setModalVisible(false);
    if (user?.role === 'customer') {
      ApiService.delete(
        API_ENDPOINTS.DELETE_CUSTOMER.replace(':id', user._id as string),
      )
        .then(() => {
          AsyncStorage.clear();
          router.replace('/(otp)/customer/login');
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      ApiService.delete(
        API_ENDPOINTS.DELETE_PROVIDER.replace(':id', user?._id as string),
      )
        .then(() => {
          AsyncStorage.clear();
          router.replace('/(otp)/provider/login');
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
        <View className="px-1 py-4 xs:px-4 gap-4">
          <Header title="Personal Data" showBackButton={true} />
          <View>
            <Image
              source={
                image
                  ? { uri: image }
                  : require('@/assets/images/anonymous.jpg')
              }
              style={{
                width: 118,
                height: 118,
                borderRadius: 59,
                alignSelf: 'center',
                marginTop: 10,
              }}
            />
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={require('@/assets/images/edit.png')}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignSelf: 'center',
                  marginTop: -30,
                  marginLeft: 70,
                }}
              />
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-3xl w-full p-3">
            <Text className="font-Roboto-Medium text-lg">First Name</Text>
            <TextInput
              value={formData.first_name}
              onChangeText={(value) => handleInputChange('first_name', value)}
              placeholder={user.first_name}
              className="border border-[#EDEDED] placeholder:text-[#363E4C] rounded-md h-12 px-2 mb-2 font-Roboto text-base focus:outline-[#147E93]"
              inputMode="text"
            />

            <Text className="font-Roboto-Medium text-lg">Last Name</Text>
            <TextInput
              value={formData.last_name}
              onChangeText={(value) => handleInputChange('last_name', value)}
              placeholder={user.last_name}
              className="border border-[#EDEDED] placeholder:text-[#363E4C] rounded-md h-12 px-2 mb-2 font-Roboto text-base focus:outline-[#147E93]"
              inputMode="text"
            />

            {user.role === 'service_provider' ? (
              <>
                <Text className="font-Roboto-Medium text-lg">
                  Business Name
                </Text>
                <TextInput
                  value={formData.business_name}
                  onChangeText={(value) =>
                    handleInputChange('business_name', value)
                  }
                  placeholder={user.business_name}
                  className="border border-[#EDEDED] placeholder:text-[#363E4C] rounded-md h-12 px-2 mb-2 font-Roboto text-base focus:outline-[#147E93]"
                  inputMode="text"
                />
                <Text className="font-Roboto-Medium text-lg">
                  Business Address
                </Text>
                <TextInput
                  value={formData.business_address}
                  onChangeText={(value) =>
                    handleInputChange('business_address', value)
                  }
                  placeholder={user.business_address}
                  className="border border-[#EDEDED] placeholder:text-[#363E4C] rounded-md h-12 px-2 mb-2 font-Roboto text-base focus:outline-[#147E93]"
                  inputMode="text"
                />
              </>
            ) : null}

            {isFormModified && (
              <TouchableOpacity
                className="bg-[#147E93] rounded-xl shadow-md items-center px-6 py-3 mt-3"
                onPress={handleSaveChanges}
              >
                <Text className="text-white font-Roboto-Medium text-base">
                  Save Changes
                </Text>
              </TouchableOpacity>
            )}
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
