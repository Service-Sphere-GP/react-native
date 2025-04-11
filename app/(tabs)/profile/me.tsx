import { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
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
  const [showAdminOption, setShowAdminOption] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Check if user is admin or has admin privileges
          if (parsedUser.role === 'admin') {
            setShowAdminOption(true);
          } else {
            // For development purposes, allow accessing admin panel from non-admin accounts
            // In production, you might want to remove this or add more secure conditions
            setShowAdminOption(true);
          }
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


  const handleAdminAccess = () => {
    router.push('/admin/login');
  }
  const navigateToPerosnalData = () => {
    router.push('/profile/settings');
  };
  const navigateToMyServices = () => {
    router.push('/profile/my-services');
  };

  const logoutHandler = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      router.push('/customer/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }

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
                  onPress={navigateToMyServices}
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
                onPress={logoutHandler}
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
              
              {/* Admin Panel Access Button */}
              {showAdminOption && (
                <TouchableOpacity onPress={handleAdminAccess}>
                  <View className="flex-row justify-between p-4 items-center border-t border-[#f5f5f5]">
                    <View className="flex-row gap-4">
                      <View className="w-10 h-10 rounded-full bg-[#FFF9C4] items-center justify-center">
                        <Text className="text-[#F57F17] text-lg font-Roboto-Bold">A</Text>
                      </View>
                      <View className="justify-center">
                        <Text className="font-Roboto-Medium text-base text-[#147E93]">
                          Admin Panel
                        </Text>
                        <Text className="text-[#676B73] text-sm font-Roboto">
                          Access administration dashboard
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
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
