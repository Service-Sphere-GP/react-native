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
import Header from '@/components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox } from '@rneui/themed';

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
  const [loading, setLoading] = useState(true);
  const [loadingService, setLoadingService] = useState(true);
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
            images: serviceData.images,
            status: serviceData.status,
            service_attributes: serviceData.service_attributes,
          });

          setImages(serviceData.images);

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
      alert("You've refused to allow this app to access your photos!");
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

      // Add new image files
      await Promise.all(
        images.map(async (uri, index) => {
          try {
            // Fetch the image and convert to blob
            const response = await fetch(uri);
            const blob = await response.blob();

            // Append the blob to FormData images
            formData.append('images', blob, `image_${index}.jpg`);
          } catch (error) {
            console.error(`Failed to process image ${index}:`, error);
          }
        }),
      );

      // Send FormData to server with proper configuration
      await ApiService.patch(
        API_ENDPOINTS.UPDATE_SERVICE.replace(':id', id as string),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
          transformRequest: (data) => data, // Don't transform FormData
        },
      );

      router.push('/profile/me');
    } catch (err: any) {
      console.error(
        'Error updating service:',
        err.response?.data || err.message || err,
      );
    }
  };

  return (
    <>
      {loading || loadingService ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView className="bg-white px-4 pb-12 h-full justify-between">
          <View className="gap-4">
            <Header title="Edit Service" showBackButton={true} />
            <View>
              <Text className="font-Roboto-Medium text-lg">Name</Text>
              <TextInput
                placeholder="Enter service name"
                className="border border-gray-300 rounded-md px-4 py-3 h-12 w-full mb-3"
                value={service.service_name}
                onChangeText={(text) =>
                  setService({ ...service, service_name: text })
                }
              />
            </View>

            <View>
              <View className="flex-row justify-between items-center">
                <Text className="font-Roboto-Medium text-lg">Images</Text>
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
                  <View key={index} className="mr-3 relative">
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
              <Text className="font-Roboto-Medium text-lg">Description</Text>
              <TextInput
                placeholder="Enter service description"
                className="border border-gray-300 rounded-md px-4 py-5 h-16 w-full mb-3 "
                multiline={true}
                value={service.description}
                onChangeText={(text) =>
                  setService({ ...service, description: text })
                }
              />
            </View>

            <View style={{ zIndex: 1000 }}>
              <Text className="font-Roboto-Medium text-lg">Category</Text>
              <DropDownPicker
                open={openCategory}
                value={categoryValue}
                items={categoryItems}
                setOpen={setOpenCategory}
                setValue={setCategoryValue}
                setItems={setCategoryItems}
                placeholder="Select category"
                zIndex={1000}
                zIndexInverse={2000}
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#ccc',
                  marginBottom: 12,
                }}
                dropDownContainerStyle={{
                  backgroundColor: '#fff',
                  borderColor: '#ccc',
                }}
              />
            </View>

            <View>
              <Text className="font-Roboto-Medium text-lg">Price</Text>
              <TextInput
                placeholder="Enter service price"
                className="border border-gray-300 rounded-md px-4 py-3 h-12 w-full mb-3"
                value={service.base_price}
                onChangeText={(text) =>
                  setService({ ...service, base_price: text })
                }
              />
            </View>

            <View className="flex-row items-center">
              <Text className="font-Roboto-Medium text-lg">Status</Text>
              <CheckBox
                checked={service.status === 'active'}
                onPress={() =>
                  setService((prev) => ({
                    ...prev,
                    status: prev.status === 'active' ? 'inactive' : 'active',
                  }))
                }
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                }}
                textStyle={{ fontWeight: 'normal' }}
              />
            </View>
          </View>
          <TouchableOpacity
            className="flex-row items-center justify-end"
            onPress={updateServiceHandler}
          >
            <Text className="text-center font-Roboto-Medium text-base bg-[#FDBD10] rounded-md px-5 py-3">
              Update service
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

export default EditService;
