import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import ToastService from '../../constants/ToastService';

interface AdminUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Check if admin is authenticated
    const checkAuth = async () => {
      try {
        const adminAuth = await AsyncStorage.getItem('adminAuthenticated');
        const adminUserStr = await AsyncStorage.getItem('adminUser');
        const adminToken = await AsyncStorage.getItem('adminToken');
        
        if (adminAuth !== 'true' || !adminUserStr || !adminToken) {
          // Redirect to login if not authenticated
          router.replace('/admin/login');
        } else {
          const user = JSON.parse(adminUserStr) as AdminUser;
          
          // Verify the user has admin role
          if (user.role !== 'admin') {
            await AsyncStorage.removeItem('adminAuthenticated');
            await AsyncStorage.removeItem('adminToken');
            await AsyncStorage.removeItem('adminUser');
            router.replace('/admin/login');
            return;
          }
          
          setAdminUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.replace('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Get user name before clearing storage
      const userName = adminUser?.full_name || 'Admin';
      
      // Clear admin session data
      await AsyncStorage.removeItem('adminAuthenticated');
      await AsyncStorage.removeItem('adminToken');
      await AsyncStorage.removeItem('adminUser');
      
      // Show logout toast
      ToastService.success('Logged Out Successfully', `Goodbye, ${userName}!`);
      
      // Navigate to login page
      router.replace('/admin/login');
    } catch (error) {
      console.error('Error during logout:', error);
      router.replace('/admin/login');
    }
  };

  // Only render on web platform
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Admin Panel is only available on web</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !adminUser) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            {adminUser.full_name} ({adminUser.email})
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Hello World!</Text>
          <Text style={styles.subText}>
            This is your admin dashboard. Here you will be able to manage service provider verifications.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.tint,
    height: 80,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto-Bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoText: {
    color: '#fff',
    marginRight: 15,
    fontFamily: 'Roboto-Medium',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.light.text,
    fontFamily: 'Roboto-Bold',
  },
  subText: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.light.icon,
    maxWidth: 600,
    fontFamily: 'Roboto-Regular',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.light.text,
    fontFamily: 'Roboto-Regular',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.text,
    fontFamily: 'Roboto-Bold',
  },
}); 