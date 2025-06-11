import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an axios instance with the base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increase to 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Add request interceptor for authentication tokens
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token from AsyncStorage
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from AsyncStorage:', error);
    }

    // For FormData uploads, don't interfere with Content-Type if it's already set
    if (config.data instanceof FormData && !config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`,
          {
            refreshToken: refreshToken,
          },
        );

        if (response.data?.data?.accessToken) {
          const newAccessToken = response.data.data.accessToken;
          const newRefreshToken = response.data.data.refreshToken;

          await AsyncStorage.multiSet([
            ['authToken', newAccessToken],
            ['refreshToken', newRefreshToken],
          ]);

          processQueue(null, newAccessToken);

          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);

        // Clear tokens and redirect to login
        await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'user']);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// API service methods
const ApiService = {
  // GET request
  get: <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  // POST request
  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  // POST request specifically for file uploads
  postFormData: <T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    const uploadConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        // Don't set Content-Type for FormData - let React Native handle it
        Accept: 'application/json',
      },
      timeout: 120000, // 2 minutes for large file uploads
      transformRequest: (data) => data, // Don't transform FormData
    };

    return apiClient.post<T>(url, formData, uploadConfig);
  },

  // PUT request
  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  // DELETE request
  delete: <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },

  // PATCH request
  patch: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  // Logout method
  logout: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (refreshToken) {
        await apiClient.post(API_ENDPOINTS.LOGOUT, { refreshToken });
      }

      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'user']);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear tokens anyway
      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'user']);
    }
  },
};

export default ApiService;
