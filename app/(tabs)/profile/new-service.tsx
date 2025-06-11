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
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import ToastService from '@/constants/ToastService';
import Header from '@/components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
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
const NewService = () => {
  const router = useRouter();
  const { t } = useTranslation(['services', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
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
    { label: string; value: number }[] // Update value type to number
  >([]);

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

  useEffect(() => {
    setCategoryItems(
      categories.map((cat) => ({
        label: cat.name,
        value: cat._id,
      })),
    );
  }, [categories]);

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
      quality: 0.7, // Reduce quality to 70% for smaller file sizes
      aspect: [4, 3],
      allowsEditing: false,
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

  const addNewServiceHandler = async () => {
    if (creating) return; // Prevent double submission

    console.log('🚀 Starting service creation process...');

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

    if (service.categories.length === 0) {
      ToastService.error(
        t('services:validation'),
        t('services:categoryRequired') || 'Please select a category',
      );
      return;
    }

    if (images.length === 0) {
      ToastService.error(
        t('services:validation'),
        t('services:imagesRequired') || 'Please add at least one image',
      );
      return;
    }

    console.log('✅ All validations passed');

    setCreating(true);

    try {
      console.log('Creating FormData...');

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

      console.log('Adding images to FormData...');

      // Process images - use proper React Native FormData format
      for (let i = 0; i < images.length; i++) {
        const uri = images[i];

        // For React Native, we need to append the file with proper format
        formData.append('images', {
          uri: uri,
          type: 'image/jpeg',
          name: `image_${i}.jpg`,
        } as any);
      }

      console.log('Sending request...');

      // Send FormData to server using basic post method
      const response = await ApiService.post(
        API_ENDPOINTS.CREATE_SERVICE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        },
      );

      console.log('✅ Service created successfully', response.status);
      console.log('Service response data:', response.data);

      const serviceId =
        (response.data as any)?.data?._id || (response.data as any)?._id;

      ToastService.success(
        t('services:success'),
        t('services:serviceCreatedSuccessfully') ||
          'Service created successfully!',
      );

      // Wait a moment for user to see the success message, then redirect to the new service
      setTimeout(() => {
        if (serviceId) {
          console.log('Redirecting to service:', serviceId);
          router.push(`/(tabs)/services/${serviceId}`);
        } else {
          console.warn('No service ID found, redirecting to profile');
          router.push('/profile/me');
        }
      }, 1500);
    } catch (err: any) {
      console.error('Error creating service:', err.message);
      console.error('Full error object:', {
        code: err.code,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: err.config
          ? {
              url: err.config.url,
              method: err.config.method,
              headers: err.config.headers,
            }
          : null,
      });

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
      } else if (err.response?.status === 413) {
        ToastService.error(
          'File Size Error',
          'Images are too large. Please reduce image size and try again.',
        );
      } else if (err.response?.status >= 500) {
        ToastService.error(
          t('services:serverError'),
          'Server error. Please try again later',
        );
      } else if (
        err.code === 'ERR_NETWORK' ||
        err.message === 'Network Error'
      ) {
        console.warn('🌐 Network error detected:', {
          code: err.code,
          message: err.message,
        });

        ToastService.error(
          'Network Error',
          'Please check your internet connection and try again.',
        );
      } else if (
        err.code === 'ECONNABORTED' ||
        err.message.includes('timeout')
      ) {
        ToastService.error(
          'Timeout Error',
          'Request took too long. Please try again.',
        );
      } else {
        ToastService.error(
          t('services:createServiceError') || 'Error',
          'Failed to create service. Please try again.',
        );
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      {loading ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className={`mt-2 text-gray-600 ${textStyle.className}`}>
            {t('common:loading')}
          </Text>
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
            <Header title={t('services:newService')} showBackButton={true} />
            <View>
              <Text className={`font-semibold text-lg ${textStyle.className}`}>
                {t('services:name')}
              </Text>
              <TextInput
                placeholder={t('services:enterServiceName')}
                className={`border border-gray-300 rounded-md px-4 py-3 h-12 w-full my-2 ${textStyle.className}`}
                onChangeText={(text) =>
                  setService({ ...service, service_name: text })
                }
              />
            </View>

            <View>
              <View
                className={`flex-row justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}
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
                onChangeText={(text) =>
                  setService({ ...service, base_price: text })
                }
              />
            </View>
          </View>
          <TouchableOpacity
            className={`flex-row items-center justify-center w-fit mt-20 ${
              creating ? 'opacity-50' : ''
            }`}
            onPress={addNewServiceHandler}
            disabled={creating}
          >
            {creating ? (
              <View className="flex-row items-center bg-[#FDBD10] rounded-md px-5 py-3">
                <ActivityIndicator size="small" color="#000" className="mr-2" />
                <Text className="font-semibold text-base">
                  {t('services:creatingService') || 'Creating Service...'}
                </Text>
              </View>
            ) : (
              <Text className="font-semibold text-base bg-[#FDBD10] rounded-md px-5 py-3">
                {t('services:addNewService')}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

export default NewService;
