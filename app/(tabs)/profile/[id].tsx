import { View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetail from '@/components/profile/ProfileDetail';
import NotificationIcon from '@/assets/icons/Notification';
import { useRouter } from 'expo-router';
interface User {
  first_name: string;
  last_name: string;
  business_name: string;
  role: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response: any = await ApiService.get(
          API_ENDPOINTS.Get_USER.replace(':id', id as string),
        );
        setUser(response.data.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchProfile();
  }, [id]);

  return (
    <View>
      {!user ? (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View className="px-1 py-4 xs:px-4 mt-12 gap-4">
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Image source={require('@/assets/images/blackArrow.png')} />
            </TouchableOpacity>
            <NotificationIcon />
          </View>
          <ProfileHeader
            firstName={user?.first_name}
            LastName={user?.last_name}
            rating={4.5}
            role={user?.business_name}
          />
          <View className="bg-white rounded-3xl w-full">
            {user?.role === 'service_provider' && (
              <ProfileDetail
                title="Services"
                description="Manage your services"
                image={require('@/assets/images/services.png')}
              />
            )}
            <ProfileDetail
              title="Reviews"
              description="What people are saying about you"
              image={require('@/assets/images/reviews.png')}
            />
          </View>
        </View>
      )}
    </View>
  );
}
