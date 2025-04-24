import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetail from '@/components/profile/ProfileDetail';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/Header';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

interface User {
  first_name: string;
  full_name: string;
  business_name: string;
  role: string;
  profile_image: string;
  rating_average: number;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { t } = useTranslation(['profile', 'common']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser._id === id) {
            router.push('/profile/me');
          } else {
            const response: any = await ApiService.get(
              API_ENDPOINTS.GET_USER.replace(':id', id as string),
            );
            setUser(response.data.data);
          }
        } else {
          setTimeout(() => {
            router.push('/(otp)/customer/login');
          }, 100);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchProfile();
  }, [id, router]);

  return (
    <View>
      {!user ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View className="px-1 py-4 xs:px-4 gap-4">
          <Header title={t('profile:title')} showBackButton={true} />
          <ProfileHeader
            fullName={user?.full_name}
            rating={user?.rating_average}
            role={user?.business_name}
            imageUrl={user?.profile_image}
          />
          <View className="bg-white rounded-3xl w-full">
            {user?.role === 'service_provider' && (
              <ProfileDetail
                title={t('profile:services')}
                description={t('profile:servicesProvidedBy', { name: user?.first_name })}
                image={require('@/assets/images/services.png')}
                onPress={() => router.push(`/profile/${id}/services`)}
              />
            )}
            <ProfileDetail
              title={t('profile:myReviews')}
              description={t('profile:whatPeopleSaying', { name: user?.first_name })}
              image={require('@/assets/images/reviews.png')}
              onPress={() => router.push(`/profile/${id}/reviews`)}
            />
          </View>
        </View>
      )}
    </View>
  );
}
