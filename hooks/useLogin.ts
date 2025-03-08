import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/login',
        {
          email,
          password,
        },
      );

      setData(response.data);

      // Store user data and token using AsyncStorage
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

  return { login, loading, error, data };
};

export default useLogin;
