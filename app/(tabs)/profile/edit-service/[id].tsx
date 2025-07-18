import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import ToastService from '@/constants/ToastService';
import Header from '@/components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

interface ServiceData {
  service_name: string;
  description: string;
  base_price: string;
  categories: (string | number)[];
  images: string[];
  status: string;
  service_attributes: {
    availability: string;
  };
}

const EditService = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation(['services', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);
  const [loading, setLoading] = useState(true);
  const [loadingService, setLoadingService] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [service, setService] = useState<ServiceData>({
    service_name: '',
    description: '',
    base_price: '',
    categories: [],
    images: [],
    status: 'active',
    service_attributes: {
      availability: '24/7',
    },
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryValue, setCategoryValue] = useState<number | null>(null);
  const [categoryItems, setCategoryItems] = useState<
    { label: string; value: number }[]
  >([]);

  // Fetch user data and categories
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.role === 'customer') {
            router.push('/profile/me');
            return;
          }

          const response: any = await ApiService.get(
            API_ENDPOINTS.GET_CATEGORIES,
          );
          setCategories(response.data.data);
        } else {
          router.push('/(otp)/customer/login');
          return;
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        router.push('/(otp)/customer/login');
      }
    };

    checkUser();
  }, [router]);

  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!loading && id) {
        try {
          setLoadingService(true);
          const response: any = await ApiService.get(
            API_ENDPOINTS.GET_SERVICE_DETAILS.replace(':id', id as string),
          );

          const serviceData = response.data.data;
          setService({
            service_name: serviceData.service_name,
            description: serviceData.description,
            base_price: serviceData.base_price.toString(),
            categories: serviceData.categories.map((cat: any) => cat._id),
            images: [], // Don't load existing images for editing
            status: serviceData.status,
            service_attributes: serviceData.service_attributes,
          });

          // Don't set existing images - user will select new ones to overwrite
          setImages([]);

          // Set category value from existing service
          if (serviceData.categories && serviceData.categories.length > 0) {
            setCategoryValue(serviceData.categories[0]._id);
          }

          setLoadingService(false);
        } catch (error) {
          console.error('Failed to fetch service details', error);
          setLoadingService(false);
        }
      }
    };

    fetchServiceDetails();
  }, [id, loading]);

  // Update category items when categories change
  useEffect(() => {
    setCategoryItems(
      categories.map((cat) => ({
        label: cat.name,
        value: cat._id,
      })),
    );
  }, [categories]);

  // Update service categories when category value changes
  useEffect(() => {
    setService((prev) => ({
      ...prev,
      categories: categoryValue ? [categoryValue] : [],
    }));
  }, [categoryValue]);

  const addImagesHandler = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(t('services:permissionDenied'));
      return;
    }

    // Launch the image library with options
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => {
        const newImages = [...prevImages, ...selectedImages];
        setService((prevService) => ({ ...prevService, images: newImages }));
        return newImages;
      });
    }
  };

  const removeImageHandler = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setService((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const updateServiceHandler = async () => {
    if (updating) return; // Prevent double submission

    // Basic validation
    if (!service.service_name.trim()) {
      ToastService.error(
        t('services:validation'),
        t('services:serviceNameRequired') || 'Service name is required',
      );
      return;
    }

    if (!service.description.trim()) {
      ToastService.error(
        t('services:validation'),
        t('services:descriptionRequired') || 'Description is required',
      );
      return;
    }

    if (!service.base_price.trim()) {
      ToastService.error(
        t('services:validation'),
        t('services:priceRequired') || 'Price is required',
      );
      return;
    }

    setUpdating(true);

    try {
      // Create a new FormData instance
      const formData = new FormData();

      // Add text fields
      formData.append('service_name', service.service_name);
      formData.append('description', service.description);
      formData.append('base_price', service.base_price);
      formData.append('categories', JSON.stringify(service.categories));
      formData.append('status', service.status);
      formData.append(
        'service_attributes',
        JSON.stringify(service.service_attributes),
      );

      // Process images - use proper React Native FormData format (same as new-service)
      for (let i = 0; i < images.length; i++) {
        const uri = images[i];

        // For React Native, we need to append the file with proper format
        formData.append('images', {
          uri: uri,
          type: 'image/jpeg',
          name: `image_${i}.jpg`,
        } as any);
      }

      // Send FormData to server - let React Native handle Content-Type automatically
      await ApiService.patch(
        API_ENDPOINTS.UPDATE_SERVICE.replace(':id', id as string),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
          transformRequest: (data) => data, // Don't transform FormData
        },
      );

      await ApiService.patch(
        API_ENDPOINTS.UPDATE_SERVICE.replace(':id', id as string),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
          transformRequest: (data) => data, // Don't transform FormData
        },
      );
      console.log('Service updated successfully');

      ToastService.success(
        t('services:success'),
        t('services:serviceUpdatedSuccessfully') ||
          'Service updated successfully!',
      );

      // Wait a moment for user to see the success message
      setTimeout(() => {
        router.push('/profile/my-services');
      }, 1500);
    } catch (err: any) {
      console.log('Error updating service:', JSON.stringify(err));

      // Handle different types of errors
      if (err.response?.status === 400) {
        ToastService.error(
          t('services:validationError'),
          err.response?.data?.message ||
            'Please check your input and try again',
        );
      } else if (err.response?.status === 401) {
        ToastService.error(t('services:authError'), 'Please log in again');
        router.push('/(otp)/customer/login');
      } else if (err.response?.status >= 500) {
        ToastService.error(
          t('services:serverError'),
          'Server error. Please try again later',
        );
      } else if (
        err.code === 'ERR_NETWORK' ||
        err.message === 'Network Error'
      ) {
        console.warn('Network error occurred:', err);
        // For network errors, redirect after showing the warning
        setTimeout(() => {
          router.push('/profile/me');
        }, 3000);
      } else {
        ToastService.error(
          t('services:updateServiceError') || 'Error',
          'Failed to update service. Please try again.',
        );
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {loading || loadingService ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView
          className="bg-white px-4 pb-12 h-full"
          contentContainerStyle={{
            justifyContent: 'space-between',
            flexGrow: 1,
          }}
        >
          <View className="gap-4">
            <Header title={t('services:editService')} showBackButton={true} />
            <View>
              <Text className={`font-semibold text-lg ${textStyle.className}`}>
                {t('services:name')}
              </Text>
              <TextInput
                placeholder={t('services:enterServiceName')}
                className={`border border-gray-300 rounded-md px-4 py-3 h-12 w-full my-2 ${textStyle.className}`}
                value={service.service_name}
                onChangeText={(text) =>
                  setService({ ...service, service_name: text })
                }
              />
            </View>

            <View>
              <View
                className={`flex-row justify-between items-center ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <Text
                  className={`font-semibold text-lg ${textStyle.className}`}
                >
                  {t('services:images')}
                </Text>
                <TouchableOpacity
                  className="bg-[#147E93] px-[6px] rounded-md"
                  onPress={addImagesHandler}
                >
                  <Text className="text-white text-xl font-semibold mb-1">
                    ＋
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Instructions for image replacement */}
              <Text
                className={`text-sm text-gray-600 mt-2 mb-3 ${textStyle.className}`}
              >
                {t('services:chooseImagesToOverwrite') ||
                  'Choose images if you want to overwrite the current ones. Leave empty to keep existing images.'}
              </Text>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                className="mt-3"
              >
                {images.map((image, index) => (
                  <View
                    key={index}
                    className={`mr-3 ${isRTL ? 'ml-3 mr-0' : 'mr-3'} relative`}
                  >
                    <Image
                      source={{ uri: image }}
                      style={{ width: 130, height: 108, borderRadius: 10 }}
                    />
                    <TouchableOpacity
                      onPress={() => removeImageHandler(index)}
                      className="absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255, 59, 48, 1)' }}
                    >
                      <Text className="text-white font-bold text-xs">✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View>
              <Text className={`font-semibold text-lg ${textStyle.className}`}>
                {t('services:description')}
              </Text>
              <TextInput
                placeholder={t('services:enterServiceDescription')}
                className={`border border-gray-300 rounded-md px-4 py-5 h-16 w-full my-2 ${textStyle.className}`}
                multiline={true}
                value={service.description}
                onChangeText={(text) =>
                  setService({ ...service, description: text })
                }
              />
            </View>

            <View style={{ zIndex: 1000 }}>
              <Text className={`font-semibold text-lg ${textStyle.className}`}>
                {t('services:category')}
              </Text>
              <DropDownPicker
                open={openCategory}
                value={categoryValue}
                items={categoryItems}
                setOpen={setOpenCategory}
                setValue={setCategoryValue}
                setItems={setCategoryItems}
                placeholder={t('services:selectCategory')}
                zIndex={1000}
                zIndexInverse={2000}
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#ccc',
                  marginVertical: 8,
                }}
                dropDownContainerStyle={{
                  backgroundColor: '#fff',
                  borderColor: '#ccc',
                }}
                textStyle={{
                  textAlign: isRTL ? 'right' : 'left',
                }}
              />
            </View>

            <View>
              <Text className={`font-semibold text-lg ${textStyle.className}`}>
                {t('services:price')}
              </Text>
              <TextInput
                placeholder={t('services:enterServicePrice')}
                className={`border border-gray-300 rounded-md px-4 py-3 h-12 w-full my-2 ${textStyle.className}`}
                value={service.base_price}
                onChangeText={(text) =>
                  setService({ ...service, base_price: text })
                }
              />
            </View>

            <View
              className={`items-center mb-3 ${
                isRTL ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Text className={`font-semibold text-lg ${textStyle.className}`}>
                {t('services:status')}
              </Text>
              <CheckBox
                checked={service.status === 'active'}
                title={t(
                  service.status === 'active'
                    ? 'services:active'
                    : 'services:inactive',
                )}
                onPress={() =>
                  setService((prev) => ({
                    ...prev,
                    status: prev.status === 'active' ? 'inactive' : 'active',
                  }))
                }
                containerStyle={{ padding: 0 }}
              />
            </View>
          </View>
          <TouchableOpacity
            className={`flex-row items-center justify-center w-fit ${
              updating ? 'opacity-50' : ''
            }`}
            onPress={updateServiceHandler}
            disabled={updating}
          >
            {updating ? (
              <View className="flex-row items-center bg-[#FDBD10] rounded-md px-5 py-3">
                <ActivityIndicator size="small" color="#000" className="mr-2" />
                <Text
                  className={`text-center font-semibold text-base ${textStyle.className}`}
                >
                  {t('services:updatingService') || 'Updating Service...'}
                </Text>
              </View>
            ) : (
              <Text
                className={`text-center font-semibold text-base bg-[#FDBD10] rounded-md px-5 py-3 ${textStyle.className}`}
              >
                {t('services:updateService')}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

export default EditService;
