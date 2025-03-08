import { useState } from 'react';
import ApiService from '../constants/ApiService';
import { API_ENDPOINTS } from '../constants/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginError = string | null;

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LoginError>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Using the endpoint path from ApiConfig with ApiService
      const response: any = await ApiService.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      await AsyncStorage.multiSet([
        ['user', JSON.stringify(response.data.data.user)],
        ['authToken', response.data.data.token],
      ]);

      return true;
    } catch (err: any) {
      setError(err.response?.data?.data?.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
