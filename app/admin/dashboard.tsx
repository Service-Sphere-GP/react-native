import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import ToastService from '../../constants/ToastService';
import ApiService from '../../constants/ApiService';

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

interface ServiceProvider {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
  status: string;
  role: string;
  business_name: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  rating_average: number;
  business_address: string;
  tax_id: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [pendingProviders, setPendingProviders] = useState<ServiceProvider[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

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
          
          // Load service providers
          fetchServiceProviders();
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

  const fetchServiceProviders = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.get('/users/service-providers');
      
      if (response.data && response.data.status === 'success') {
        const allProviders = response.data.data as ServiceProvider[];
        setProviders(allProviders);
        
        // Filter pending providers
        const pending = allProviders.filter(p => p.verification_status === 'pending');
        setPendingProviders(pending);
        
        // Calculate stats
        setStats({
          total: allProviders.length,
          pending: allProviders.filter(p => p.verification_status === 'pending').length,
          approved: allProviders.filter(p => p.verification_status === 'approved').length,
          rejected: allProviders.filter(p => p.verification_status === 'rejected').length
        });
        
        ToastService.success('Data Loaded', 'Service provider data loaded successfully');
      } else {
        ToastService.error('Data Error', 'Failed to load service provider data');
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
      ToastService.error('Data Error', 'Failed to load service provider data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateVerificationStatus = async (providerId: string, status: 'approved' | 'rejected') => {
    try {
      setIsUpdating(true);
      
      const response = await ApiService.patch(`/users/service-providers/${providerId}`, {
        verification_status: status
      });
      
      if (response.data && response.data.status === 'success') {
        // Refresh the provider list
        fetchServiceProviders();
        
        ToastService.success(
          'Status Updated', 
          `Provider verification status updated to ${status}`
        );
      } else {
        ToastService.error('Update Failed', 'Failed to update verification status');
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
      ToastService.error('Update Failed', 'Failed to update verification status');
    } finally {
      setIsUpdating(false);
    }
  };

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

  const filteredProviders = searchQuery 
    ? providers.filter(p => 
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.business_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : providers;

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
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Providers</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FFF9C4' }]}>
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending Verification</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.statNumber}>{stats.approved}</Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
              <Text style={styles.statNumber}>{stats.rejected}</Text>
              <Text style={styles.statLabel}>Rejected</Text>
            </View>
          </View>

          {/* Pending Verification Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pending Verifications</Text>
            {pendingProviders.length === 0 ? (
              <Text style={styles.emptyMessage}>No pending verifications</Text>
            ) : (
              pendingProviders.map(provider => (
                <View key={provider._id} style={styles.providerItem}>
                  <View style={styles.providerInfo}>
                    <Text style={styles.providerName}>{provider.full_name}</Text>
                    <Text style={styles.providerBusiness}>{provider.business_name}</Text>
                    <Text style={styles.providerDetail}>Email: {provider.email}</Text>
                    <Text style={styles.providerDetail}>Tax ID: {provider.tax_id}</Text>
                    <Text style={styles.providerDetail}>Address: {provider.business_address}</Text>
                    <Text style={styles.providerDetail}>
                      Registered: {new Date(provider.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => updateVerificationStatus(provider._id, 'approved')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.actionButtonText}>Approve</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => updateVerificationStatus(provider._id, 'rejected')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.actionButtonText}>Reject</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Search and Filter Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>All Service Providers</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, email, or business name"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            
            {filteredProviders.length === 0 ? (
              <Text style={styles.emptyMessage}>No providers found</Text>
            ) : (
              filteredProviders.map(provider => (
                <View key={provider._id} style={styles.providerItem}>
                  <View style={styles.providerInfo}>
                    <Text style={styles.providerName}>{provider.full_name}</Text>
                    <Text style={styles.providerBusiness}>{provider.business_name}</Text>
                    <Text style={styles.providerDetail}>Email: {provider.email}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={[
                        styles.statusText,
                        provider.verification_status === 'approved' ? styles.approvedText :
                        provider.verification_status === 'rejected' ? styles.rejectedText :
                        styles.pendingText
                      ]}>
                        {provider.verification_status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  {provider.verification_status !== 'pending' && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={[
                          styles.actionButton, 
                          provider.verification_status === 'rejected' ? styles.approveButton : styles.rejectButton
                        ]}
                        onPress={() => updateVerificationStatus(
                          provider._id, 
                          provider.verification_status === 'rejected' ? 'approved' : 'rejected'
                        )}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.actionButtonText}>
                            {provider.verification_status === 'rejected' ? 'Approve' : 'Reject'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
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
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '23%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Roboto-Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Roboto-Bold',
  },
  providerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Roboto-Bold',
  },
  providerBusiness: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontFamily: 'Roboto-Medium',
  },
  providerDetail: {
    fontSize: 14,
    color: '#777',
    marginBottom: 2,
    fontFamily: 'Roboto-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontFamily: 'Roboto-Regular',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: 20,
    color: '#777',
    fontFamily: 'Roboto-Regular',
  },
  statusBadge: {
    marginTop: 5,
  },
  statusText: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
    alignSelf: 'flex-start',
    fontFamily: 'Roboto-Bold',
  },
  approvedText: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  pendingText: {
    backgroundColor: '#FFF9C4',
    color: '#F57F17',
  },
  rejectedText: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.light.text,
    fontFamily: 'Roboto-Regular',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.text,
    fontFamily: 'Roboto-Bold',
  },
}); 