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
  GET_USER: '/users/:id',
  DELETE_CUSTOMER: '/users/customers/:id',
  DELETE_PROVIDER: '/users/service-providers/:id',
  VERIFY_EMAIL: '/auth/verify-email/:id',
  RESEND_OTP: '/auth/resend-verification',
  GET_SERVICE_DETAILS: '/services/:id',
  CREATE_SERVICE: '/services',
  GET_SERVICES: '/services',
  UPDATE_PROVIDER: '/users/service-providers/:id',
  UPDATE_CUSTOMER: '/users/customers/:id',
  GET_PROVIDER_SERVICES: '/services/provider/:id',
  GET_MY_SERVICES: '/services/my-services',
  BOOK_SERVICE: '/bookings/:serviceId',
  GET_CUSTOMER_BOOKINGS: '/bookings',
  GET_PROVIDER_BOOKINGS: '/bookings/provider',
  COMPELETE_BOOKING: '/bookings/:id/status',
  SEND_FEEDBACK: '/feedback',
  GET_MY_FEEDBACKS: '/feedback/provider',
  GET_CUSTOMER_FEEDBACKS: '/feedback/customer/:id',
  GET_PROVIDER_FEEDBACKS: '/feedback/provider/:id',
  GET_SERVICE_FEEDBACKS: '/feedback/service/:id',
  // Add more endpoints as needed
};

export { API_BASE_URL, API_ENDPOINTS };
