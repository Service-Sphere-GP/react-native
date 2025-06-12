import {
  View,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import ToastService from '@/constants/ToastService';
import Header from '@/components/Header';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet } from 'react-native';

const Settings = () => {
  interface User {
    _id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    role: string;
    email: string;
    password: string;
    createdAt: string;
    business_name?: string;
    business_address?: string;
    profile_image?: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isFormModified, setIsFormModified] = useState(false);
  const [saving, setSaving] = useState(false);
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
    if (!user || !isFormModified || saving) return;

    setSaving(true);

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

      // Handle image upload for React Native
      if (
        formData.profile_image &&
        formData.profile_image !== user.profile_image
      ) {
        // For React Native, we need to handle the image differently
        const imageUri = formData.profile_image;
        const filename = `profile_${Date.now()}.jpg`;

        // Create the file object for React Native
        const imageFile = {
          uri: imageUri,
          type: 'image/jpeg',
          name: filename,
        } as any;

        formDataObj.append('profile_image', imageFile);
      }

      const endpoint =
        user.role === 'customer'
          ? API_ENDPOINTS.UPDATE_CUSTOMER.replace(':id', user._id)
          : API_ENDPOINTS.UPDATE_PROVIDER.replace(':id', user._id);

      const response: any = await ApiService.patch(endpoint, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
        transformRequest: (data) => data, // Don't transform FormData
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

        ToastService.success('Success', 'Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Update failed:', error.response?.data || error.message);

      if (error.response?.status === 400) {
        ToastService.error(
          'Validation Error',
          error.response?.data?.message ||
            'Please check your input and try again',
        );
      } else if (error.response?.status === 401) {
        ToastService.error('Authentication Error', 'Please log in again');
        router.push('/(otp)/customer/login');
      } else if (error.response?.status >= 500) {
        ToastService.error(
          'Server Error',
          'Server error. Please try again later',
        );
      } else if (
        error.code === 'ERR_NETWORK' ||
        error.message === 'Network Error'
      ) {
        console.error('Network error:', JSON.stringify(error));
      } else {
        ToastService.error(
          'Update Failed',
          error.response?.data?.message ||
            error.message ||
            'Failed to update profile',
        );
      }
    } finally {
      setSaving(false);
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

  let createdAt = '';
  if (user) {
    const date = new Date(user.createdAt);
    createdAt = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }
  return (
    <View style={styles.container}>
      <Header title="Personal Data" showBackButton={true} />

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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Image Section */}
          <View style={styles.profileImageSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  image
                    ? { uri: image }
                    : require('@/assets/images/anonymous.jpg')
                }
                style={styles.profileImage}
              />
              <TouchableOpacity
                onPress={pickImage}
                style={styles.editImageButton}
              >
                <Image
                  source={require('@/assets/images/edit.png')}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              value={formData.first_name || ''}
              onChangeText={(value) => handleInputChange('first_name', value)}
              placeholder={user.first_name}
              style={styles.textInput}
              inputMode="text"
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              value={formData.last_name || ''}
              onChangeText={(value) => handleInputChange('last_name', value)}
              placeholder={user.last_name}
              style={styles.textInput}
              inputMode="text"
            />

            {user.role === 'service_provider' && (
              <>
                <Text style={styles.label}>Business Name</Text>
                <TextInput
                  value={formData.business_name || ''}
                  onChangeText={(value) =>
                    handleInputChange('business_name', value)
                  }
                  placeholder={user.business_name}
                  style={styles.textInput}
                  inputMode="text"
                />
                <Text style={styles.label}>Business Address</Text>
                <TextInput
                  value={formData.business_address || ''}
                  onChangeText={(value) =>
                    handleInputChange('business_address', value)
                  }
                  placeholder={user.business_address}
                  style={styles.textInput}
                  inputMode="text"
                />
              </>
            )}

            {isFormModified && (
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={handleSaveChanges}
                disabled={saving}
              >
                {saving ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.saveButtonText}>Saving...</Text>
                  </View>
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Footer Section */}
          <View style={styles.footerContainer} className="m-4">
            <View style={styles.joinedContainer}>
              <Text style={styles.joinedText}>Joined </Text>
              <Text style={styles.joinedDate}>{createdAt}</Text>
            </View>

            <TouchableOpacity
              style={styles.deleteAccountButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#147E93" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileImageSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 118,
    height: 118,
    borderRadius: 59,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#147E93',
  },
  editIcon: {
    width: 16,
    height: 16,
    tintColor: '#147E93',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    elevation: 2,
  },
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#333333',
  },
  saveButton: {
    backgroundColor: '#147E93',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinedText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#666666',
  },
  joinedDate: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
  },
  deleteAccountButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  deleteAccountButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#666666',
  },
});

export default Settings;
