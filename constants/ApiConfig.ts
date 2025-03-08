import { Platform } from 'react-native';

// Base API URL that changes based on platform
const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000/api/v1'
    : 'http://10.0.2.2:3000/api/v1';

// API endpoint paths (without the base URL)
const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  // Add more endpoints as needed
};

export { API_BASE_URL, API_ENDPOINTS };
