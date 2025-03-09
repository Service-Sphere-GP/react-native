import { View, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetail from '@/components/profile/ProfileDetail';
import NotificationIcon from '@/assets/icons/Notification';

interface User {
  first_name: string;
  last_name: string;
  role: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

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
            <Image source={require('@/assets/images/blackArrow.png')} />
            <NotificationIcon />
          </View>
          <ProfileHeader
            firstName={user?.first_name}
            LastName={user?.last_name}
            rating={4.5}
            role={user?.role}
          />
          <View className="bg-white rounded-3xl w-full">
            {user?.role === 'service_provider' && (
              <>
                <ProfileDetail
                  title="Services"
                  description="Manage your services"
                  image={require('@/assets/images/services.png')}
                />
                <ProfileDetail
                  title="Time Slots"
                  description="Available time slots"
                  image={require('@/assets/images/timeSlots.png')}
                />
              </>
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
