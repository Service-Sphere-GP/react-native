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
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import Header from '@/components/Header';
import { useLocalSearchParams } from 'expo-router';

interface ServiceData {
  service_name: string;
  description: string;
  base_price: string;
  category: string;
  images: string[];
  status: string;
  service_attributes: {
    availability: string;
  };
}
const EditService = () => {
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [service, setService] = useState<ServiceData>({
    service_name: '',
    description: '',
    base_price: '',
    category: '',
    images: [],
    status: 'active',
    service_attributes: {
      availability: '24/7',
    },
  });

  useEffect(() => {
    const getService = async () => {
      try {
        setLoading(true);
        const response: any = await ApiService.get(
          API_ENDPOINTS.GET_SERVICE_DETAILS.replace(':id', id as string),
        );
        setService(response.data.data);
        console.log('Service data:', response.data.data);
        setImages(response.data.data.images);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        router.push('/(otp)/customer/login');
      } finally {
        setLoading(false);
      }
    };

    getService();
  }, [router, id]);

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

  const editNewServiceHandler = async () => {
    try {
      console.log('Images array before sending:', images);

      // Create a new FormData instance
      const formData = new FormData();

      // Add text fields
      formData.append('service_name', service.service_name);
      formData.append('description', service.description);
      formData.append('base_price', service.base_price);
      formData.append('category', service.category);
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
        </View>
      ) : (
        <View className="bg-white px-4 h-full justify-between">
          <View className="gap-4">
            <Header
              title="Edit Service"
              showBackButton={true}
              notificationsCount={0}
            />
            <View>
              <Text className="font-Roboto-Medium text-lg">Name</Text>
              <TextInput
                placeholder={service.service_name}
                className="border text-[#666B73] border-gray-300 rounded-md px-4 py-3 h-12 w-full mb-3"
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
                placeholder={service.description}
                className="border text-[#666B73] border-gray-300 rounded-md px-4 py-5 h-16 w-full mb-3 "
                multiline={true}
                onChangeText={(text) =>
                  setService({ ...service, description: text })
                }
              />
            </View>

            <View>
              <Text className="font-Roboto-Medium text-lg">Category</Text>
              <TextInput
                placeholder={service.category}
                className="border text-[#666B73] border-gray-300 rounded-md px-4 py-3 h-12 w-full mb-3"
                onChangeText={(text) =>
                  setService({ ...service, category: text })
                }
              />
            </View>

            <View>
              <Text className="font-Roboto-Medium text-lg">Price</Text>
              <TextInput
                placeholder={service.base_price}
                className="border text-[#666B73] border-gray-300 rounded-md px-4 py-3 h-12 w-full mb-3"
                onChangeText={(text) =>
                  setService({ ...service, base_price: text })
                }
              />
            </View>
          </View>
          <TouchableOpacity
            className="flex-row items-center justify-end"
            onPress={editNewServiceHandler}
          >
            <Text className="text-center font-Roboto-Medium text-base bg-[#FDBD10] rounded-md px-5 py-3 mb-4">
              Confirm Editing
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default EditService;
