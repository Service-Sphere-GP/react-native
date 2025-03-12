import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import ApiService from '../../constants/ApiService';

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
    }
  }
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the login API endpoint using ApiService
      const response = await ApiService.post<LoginResponse>('/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);

      // Check if login was successful and user has admin role
      if (response.data && response.data.status === 'success' && response.data.data) {
        const { token, user } = response.data.data;
        
        // Check if user has admin role
        if (user.role === 'admin') {
          // Store admin session and token
          await AsyncStorage.setItem('adminAuthenticated', 'true');
          await AsyncStorage.setItem('adminToken', token);
          await AsyncStorage.setItem('adminUser', JSON.stringify(user));
          
          // Navigate to admin dashboard
          router.replace('/admin/dashboard');
        } else {
          setError('Access denied. Admin privileges required.');
        }
      } else {
        setError('Invalid credentials or server error');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
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

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Admin Login</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
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
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
}); 