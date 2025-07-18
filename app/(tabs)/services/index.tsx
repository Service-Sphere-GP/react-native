import {
  View,
  Text,
  TextInput,
  Image,
  SafeAreaView,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import Header from '@/components/Header';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

interface Service {
  service_name: string;
  description: string;
  base_price: number;
  images: string[];
  service_provider: {
    _id: string;
    full_name: string;
    rating_average: number;
    business_name: string;
  };
  status: string;
  _id: string;
  rating_average: number;
  categories: {
    _id: string;
    name: string;
  }[];
}

const AllServices = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width: screenWidth } = useWindowDimensions();
  const { t } = useTranslation(['services', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  // Calculate image size based on screen width
  const imageSize = screenWidth < 375 ? 45 : screenWidth < 768 ? 60 : 75;

  const [services, setServices] = useState<Service[]>([]); // Initialize services as an empty array
  const [filteredServices, setFilteredServices] = useState<Service[]>([]); // Filtered services for search
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch services
        const servicesResponse: any = await ApiService.get(
          API_ENDPOINTS.GET_SERVICES,
        );
        setServices(servicesResponse.data.data);

        // Fetch categories
        const categoriesResponse: any = await ApiService.get(
          API_ENDPOINTS.GET_CATEGORIES,
        );
        setCategories(categoriesResponse.data.data);

        // Check if there's a category parameter from URL
        const categoryParam = params.category as string;
        if (categoryParam) {
          setSelectedCategory(categoryParam);
        } else {
          setFilteredServices(servicesResponse.data.data); // Initialize filtered services
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        if ((error as any)?.response?.status === 401) {
          // Redirect to login if unauthorized
          router.push('/(otp)/customer/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, params.category]);

  // Filter services based on search query and selected category
  const applyFilters = (
    servicesList: Service[],
    query: string = searchQuery,
    categoryId: string | null = selectedCategory,
  ) => {
    let filtered = servicesList;

    // Filter by category first
    if (categoryId) {
      filtered = filtered.filter(
        (service) =>
          service.categories &&
          service.categories.length > 0 &&
          service.categories.some((cat) => cat._id === categoryId),
      );
    }

    // Then filter by search query
    if (query.trim() !== '') {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.service_name.toLowerCase().includes(searchLower) ||
          service.service_provider.full_name
            .toLowerCase()
            .includes(searchLower) ||
          service.service_provider.business_name
            .toLowerCase()
            .includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = applyFilters(services, query, selectedCategory);
    setFilteredServices(filtered);
  };

  // Category filter functionality
  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    const filtered = applyFilters(services, searchQuery, categoryId);
    setFilteredServices(filtered);
  };

  // Update filtered services when services change
  useEffect(() => {
    const filtered = applyFilters(services, searchQuery, selectedCategory);
    setFilteredServices(filtered);
  }, [services, searchQuery, selectedCategory]);

  return (
    <>
      {loading ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <SafeAreaView className="flex-1 bg-[#F4F4F4]">
          {/* Header */}
          <Header title={t('services:allServices')} showBackButton={false} />

          {/* Search & Filter */}
          <View className="px-4 py-2 flex-row items-center justify-between mb-2">
            <View className="flex-row items-center bg-white rounded-lg px-2 py-1 flex-1 h-12">
              <Ionicons
                name="search"
                size={20}
                color="#030B19"
                style={{ paddingLeft: 4 }}
              />
              <SafeAreaView style={{ flex: 1, marginHorizontal: 10 }}>
                <TextInput
                  placeholder={t('services:search')}
                  clearButtonMode="always"
                  className="flex-1 text-base text-[#666B73]"
                  placeholderTextColor="#666B73"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  style={{
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    borderWidth: 0,
                    textAlign: isRTL ? 'right' : 'left',
                    writingDirection: isRTL ? 'rtl' : 'ltr',
                    fontFamily: textStyle.style.fontFamily,
                  }}
                />
              </SafeAreaView>
            </View>
          </View>

          {/* Category Filter */}
          <View className="px-4 mb-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
            >
              <TouchableOpacity
                className={`${isRTL ? 'ml-2' : 'mr-2'} px-4 py-2 rounded-full border ${!selectedCategory ? 'bg-[#2C8394] border-[#2C8394]' : 'bg-white border-gray-300'}`}
                style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
                onPress={() => handleCategoryFilter(null)}
              >
                <Text
                  className={`text-sm font-medium ${!selectedCategory ? 'text-white' : 'text-gray-700'}`}
                >
                  {t('services:allCategories')}
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category._id}
                  className={`${isRTL ? 'ml-2' : 'mr-2'} px-4 py-2 rounded-full border ${selectedCategory === category._id ? 'bg-[#2C8394] border-[#2C8394]' : 'bg-white border-gray-300'}`}
                  style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
                  onPress={() => handleCategoryFilter(category._id)}
                >
                  <Text
                    className={`text-sm font-medium ${selectedCategory === category._id ? 'text-white' : 'text-gray-700'}`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Services List */}
          <View className="bg-[#FFFFFF] rounded-2xl mx-2 xs:mx-4 xs:px-4 mb-5 px-2 flex-1">
            {/* Results Counter */}
            {filteredServices.length > 0 && (
              <View className="py-2 border-b border-gray-100">
                <Text
                  className={`text-sm text-gray-600 ${textStyle.className}`}
                >
                  {filteredServices.length}{' '}
                  {filteredServices.length === 1
                    ? t('services:serviceFound')
                    : t('services:servicesFound')}
                  {selectedCategory &&
                    ` ${t('services:inCategory')} "${categories.find((cat) => cat._id === selectedCategory)?.name}"`}
                </Text>
              </View>
            )}

            {filteredServices.length === 0 &&
            (searchQuery.trim() !== '' || selectedCategory) ? (
              <View className="flex-1 items-center justify-center py-10">
                <Ionicons name="search-outline" size={50} color="#666B73" />
                <Text
                  className={`text-[#666B73] text-base mt-2 text-center ${textStyle.className}`}
                >
                  {selectedCategory && searchQuery.trim() === ''
                    ? t('services:noCategoryServices')
                    : t('services:noServicesFound')}
                </Text>
                <Text
                  className={`text-[#676B73] text-sm mt-1 text-center ${textStyle.className}`}
                >
                  {selectedCategory && searchQuery.trim() === ''
                    ? t('services:tryDifferentCategory')
                    : t('services:tryDifferentSearch')}
                </Text>
              </View>
            ) : filteredServices.length === 0 ? (
              <View className="flex-1 items-center justify-center py-10">
                <Ionicons
                  name="information-circle-outline"
                  size={50}
                  color="#666B73"
                />
                <Text
                  className={`text-[#666B73] text-base mt-2 text-center ${textStyle.className}`}
                >
                  {t('services:noServices')}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredServices}
                keyExtractor={(services) => services._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/services/${item._id}`)}
                    className={`flex-row py-3 w-full items-center ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Image
                      source={{ uri: item.images[0] }}
                      className={`rounded-full ${isRTL ? 'ml-3' : 'mr-3'}`}
                      style={{
                        width: imageSize,
                        height: imageSize,
                      }}
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text
                        className={`text-[#030B19] font-bold text-sm xs:text-base ${textStyle.className}`}
                      >
                        {item.service_name}
                      </Text>
                      <View
                        className={`flex-row items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <Text
                          className={`text-gray-600 text-xs xs:text-sm flex-1 ${isRTL ? 'pl-2' : 'pr-2'} ${textStyle.className}`}
                        >
                          {item.service_provider.full_name}
                        </Text>
                        <Ionicons
                          name={isRTL ? 'chevron-back' : 'chevron-forward'}
                          size={20}
                          color="#030B19"
                        />
                      </View>

                      <View
                        className={`flex-row items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <View
                          className={`flex-row items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <Text
                            className={`text-sm text-[#030B19] ${isRTL ? 'ml-1' : 'mr-1'} ${textStyle.className}`}
                          >
                            {item.rating_average.toFixed(2)}
                          </Text>
                          <Rating
                            readonly
                            startingValue={item.rating_average}
                            imageSize={10}
                          />
                        </View>
                        <Text
                          className={`text-[#030B19] font-semibold text-xs xs:text-sm ${textStyle.className}`}
                        >
                          {item.base_price} {t('services:currency')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default AllServices;
