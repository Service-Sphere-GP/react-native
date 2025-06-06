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

  const addNewServiceHandler = async () => {
    try {
      console.log('Images array before sending:', images);

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

      // Convert images to blobs and append to FormData
      await Promise.all(
        images.map(async (uri, index) => {
          try {
            // Fetch the image and convert to blob
            const response = await fetch(uri);
            const blob = await response.blob();

            // Append blob to FormData with appropriate filename and type
            formData.append('images', blob, `image_${index}.jpg`);
          } catch (error) {
            console.error(`Failed to process image ${index}:`, error);
          }
        }),
      );

      // Send FormData to server with proper configuration
      const response = await ApiService.post(
        API_ENDPOINTS.CREATE_SERVICE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
          transformRequest: (data) => data, // Don't transform FormData
        },
      );
      console.log('Response:', response);

      router.push('/profile/me');
    } catch (err: any) {
      console.error(
        'Error creating service:',
        err.response?.data || err.message || err,
      );
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
        <ScrollView className="bg-white px-4 pb-12 h-full justify-between">
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
                <Text className={`font-semibold text-lg ${textStyle.className}`}>
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
            className="flex-row items-center w-fit mt-20"
            onPress={addNewServiceHandler}
          >
            <Text className="font-semibold text-base bg-[#FDBD10] rounded-md px-5 py-3">
              {t('services:addNewService')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

export default NewService;
