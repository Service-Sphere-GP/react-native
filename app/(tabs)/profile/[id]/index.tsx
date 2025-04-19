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
          <Header
            title="Profile"
            showBackButton={true}
            notificationsCount={0}
          />
          <ProfileHeader
            fullName={user?.full_name}
            rating={user?.rating_average}
            role={user?.business_name}
            imageUrl={user?.profile_image}
          />
          <View className="bg-white rounded-3xl w-full">
            {user?.role === 'service_provider' && (
              <ProfileDetail
                title="Services"
                description={`Services Provided by ${user?.first_name}`}
                image={require('@/assets/images/services.png')}
                onPress={() => router.push(`/profile/${id}/services`)}
              />
            )}
            <ProfileDetail
              title="Reviews"
              description={`What people are saying about ${user?.first_name}`}
              image={require('@/assets/images/reviews.png')}
              onPress={() => router.push(`/profile/${id}/reviews`)}
            />
          </View>
        </View>
      )}
    </View>
  );
}
