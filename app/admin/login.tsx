import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import ApiService from '../../constants/ApiService';
import ToastService from '../../constants/ToastService';

interface LoginResponse {
  status: string;
  data: {
    token: string;
    user: {
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
      full_name: string;
      status: string;
      role: string;
      created_at: string;
      updated_at: string;
    };
  };
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Simple validation
    if (!email || !password) {
      ToastService.error(
        'Validation Error',
        'Please enter both email and password',
      );
      return;
    }

    setIsLoading(true);

    try {
      // Call the login API endpoint using ApiService
      const response = await ApiService.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response.data);

      // Check if login was successful and user has admin role
      if (
        response.data &&
        response.data.status === 'success' &&
        response.data.data
      ) {
        const { token, user } = response.data.data;

        // Check if user has admin role
        if (user.role === 'admin') {
          // Store admin session and token
          await AsyncStorage.setItem('adminAuthenticated', 'true');
          await AsyncStorage.setItem('adminToken', token);
          await AsyncStorage.setItem('adminUser', JSON.stringify(user));

          // Show success toast
          ToastService.success(
            'Login Successful',
            `Welcome back, ${user.full_name}!`,
          );

          // Navigate to admin dashboard
          router.replace('/admin/dashboard');
        } else {
          ToastService.error('Access Denied', 'Admin privileges required');
        }
      } else {
        ToastService.error(
          'Authentication Failed',
          'Invalid credentials or server error',
        );
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      ToastService.error('Authentication Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.contentContainer}>
        {/* Back button for mobile */}
        {Platform.OS !== 'web' && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}

        {/* Logo or Icon - Optional */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Service Sphere</Text>
          <Text style={styles.adminText}>Admin Portal</Text>
        </View>

        <View
          style={[
            styles.loginBox,
            Platform.OS !== 'web' && styles.mobileLoginBox,
          ]}
        >
          <Text style={styles.title}>Admin Login</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#687076"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#687076"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontFamily: 'Roboto-Medium',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#147E93',
    fontFamily: 'Roboto-Bold',
  },
  adminText: {
    fontSize: 18,
    color: '#FDBC10',
    fontFamily: 'Roboto-Medium',
    marginTop: 5,
  },
  loginBox: {
    width: 400,
    padding: 30,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  mobileLoginBox: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.light.text,
    fontFamily: 'Roboto-Bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.text,
    fontFamily: 'Roboto-Medium',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E6E8EB',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: Colors.light.text,
    fontFamily: 'Roboto-Regular',
  },
  loginButton: {
    backgroundColor: Colors.light.tint,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
});
