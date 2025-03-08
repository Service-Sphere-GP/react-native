import { useState } from 'react';
import ApiService from '../constants/ApiService';
import { API_ENDPOINTS } from '../constants/ApiConfig';

// Define types for the response data and error
type LoginData = any; // Replace with your actual login response type
type LoginError = string | null;

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LoginError>(null);
  const [data, setData] = useState<LoginData | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Using the endpoint path from ApiConfig with ApiService
      const response = await ApiService.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, data };
};

export default useLogin;
