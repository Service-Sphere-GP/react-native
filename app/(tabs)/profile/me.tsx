import { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationIcon from '@/assets/icons/Notification';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetail from '@/components/profile/ProfileDetail';

const ProfileComponent = () => {
  interface User {
    first_name: string;
    last_name: string;
    role: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          setTimeout(() => {
            router.push('/customer/login');
          }, 100);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setTimeout(() => {
          router.push('/customer/login');
        }, 100);
      }
    };

    checkUser();
  }, [router]);

  const navigateToPerosnalData = () => {
    router.push('/profile/settings');
  };

  return (
    <ScrollView>
      {user ? (
        <View className="px-1 py-4 xs:px-4 mt-12 gap-4">
          <View className="flex-row justify-between mr-2">
            <Text className="font-Roboto-Medium text-xl flex-1 text-center">
              Profile
            </Text>
            <NotificationIcon />
          </View>

          <View className="justify-center items-center p-2 gap-4">
            <ProfileHeader
              firstName={user.first_name}
              LastName={user.last_name}
              rating={4.5}
            />
            <View className="bg-white rounded-3xl w-full">
              <ProfileDetail
                title="Personal Data"
                description="Manage your personal details"
                image={require('@/assets/images/personalData.png')}
                onPress={navigateToPerosnalData}
              />
              {user.role === 'service_provider' && (
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
              <ProfileDetail
                title="Log out"
                description="logging out will clear your session"
                image={require('@/assets/images/logout.png')}
              />
            </View>
            <View className="bg-white rounded-3xl w-full">
              <ProfileDetail
                title="Help & Support"
                description={null}
                image={require('@/assets/images/help.png')}
              />
              <ProfileDetail
                title="About App"
                description={null}
                image={require('@/assets/images/info.png')}
              />
            </View>
          </View>
        </View>
      ) : (
        <View className="flex items-center justify-center h-screen">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileComponent;
