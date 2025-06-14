import { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetail from '@/components/profile/ProfileDetail';
import Header from '@/components/Header';
// Import translation hook
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../src/i18n/LanguageContext';
import ApiService from '@/constants/ApiService';

const ProfileComponent = () => {
  interface User {
    full_name: string;
    role: string;
    rating_average: number;
    profile_image: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [showAdminOption, setShowAdminOption] = useState(false);
  // Add translation hook
  const { t } = useTranslation(['profile', 'common']);
  const { isRTL } = useLanguage();

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
            router.push('/(otp)/customer/login');
          }, 100);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setTimeout(() => {
          router.push('/(otp)/customer/login');
        }, 100);
      }
    };

    checkUser();
  }, [router]);

  const handleAdminAccess = () => {
    router.push('/admin/login');
  };
  const navigateToPerosnalData = () => {
    router.push('/profile/settings');
  };
  const navigateToMyServices = () => {
    router.push('/profile/my-services');
  };

  const navigateToMyReviews = () => {
    router.push('/profile/my-reviews');
  };
    const navigateToAboutApp = () => {
    router.push('/profile/aboutApp');
  };

  // Add navigation to language settings
  const navigateToLanguageSettings = () => {
    router.push('/profile/language');
  };
  const logoutHandler = async () => {
    try {
      // Use the ApiService logout method which handles refresh token cleanup
      await ApiService.logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout', error);
      // Even if logout fails, redirect to login
      router.push('/');
    }
  };

  return (
    <ScrollView>
      {user ? (
        <View className="px-1 py-4 xs:px-4 gap-4">
          <Header title={t('profile:title')} showBackButton={false} />

          <View className="justify-center items-center p-2 gap-4">
            <ProfileHeader
              fullName={user.full_name}
              rating={user.role === 'service_provider' ? user.rating_average : undefined}
              imageUrl={user.profile_image}
            />
            <View className="bg-white rounded-3xl w-full">
              <ProfileDetail
                title={t('profile:editProfile')}
                description={t('profile:settings')}
                image={require('@/assets/images/personalData.png')}
                onPress={navigateToPerosnalData}
              />
              {user.role === 'service_provider' && (
                <>
                  <ProfileDetail
                    title={t('profile:myServices')}
                    description={t('services:allServices')}
                    image={require('@/assets/images/services.png')}
                    onPress={navigateToMyServices}
                  />
                  <ProfileDetail
                    title={t('profile:myReviews')}
                    description={t('services:reviews')}
                    image={require('@/assets/images/reviews.png')}
                    onPress={navigateToMyReviews}
                  />
                </>
              )}

              {/* Language Settings Option */}
              <ProfileDetail
                title={t('common:language')}
                description={t('common:languageDescription')}
                image={require('@/assets/images/info.png')}
                onPress={navigateToLanguageSettings}
              />

              <ProfileDetail
                title={t('profile:logout')}
                description={null}
                image={require('@/assets/images/logout.png')}
                onPress={logoutHandler}
              />
            </View>
            <View className="bg-white rounded-3xl w-full">
              <ProfileDetail
                title={t('profile:helpSupport')}
                description={null}
                image={require('@/assets/images/help.png')}
              />
              <ProfileDetail
                title={t('profile:aboutApp')}
                description={null}
                image={require('@/assets/images/info.png')}
                onPress={navigateToAboutApp}
              />

              {/* Admin Panel Access Button */}
              {showAdminOption && (
                <TouchableOpacity onPress={handleAdminAccess}>
                  <View
                    className={`flex-row justify-between p-4 items-center border-t border-[#f5f5f5] ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <View
                      className={`flex-row gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <View className="w-10 h-10 rounded-full bg-[#FFF9C4] items-center justify-center">
                        <Text className="text-[#F57F17] text-lg font-bold">
                          A
                        </Text>
                      </View>
                      <View className="justify-center">
                        <Text
                          className={`text-base text-[#147E93] font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                        >
                          {t('profile:adminPanel')}
                        </Text>
                        <Text
                          className={`text-[#676B73] text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                        >
                          {t('profile:adminAccess')}
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
