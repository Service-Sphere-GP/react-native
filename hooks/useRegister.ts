import { useState } from 'react';
import ApiService from '../constants/ApiService';
import { API_ENDPOINTS } from '../constants/ApiConfig';

// Define types for the response data and error
type RegisterData = any; // Replace with your actual register response type
type RegisterError = string | null;

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RegisterError>(null);
  const [data, setData] = useState<RegisterData | null>(null);

  const customerRegister = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    confirm_password: string,
  ) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await ApiService.post(
        API_ENDPOINTS.REGISTER + '/customer',
        {
          email,
          password,
          first_name,
          last_name,
          confirm_password,
        },
      );

      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const providerRegister = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    confirm_password: string,
    business_name: string,
    business_address: string,
    tax_id: string,
  ) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await ApiService.post(
        API_ENDPOINTS.REGISTER + '/service-provider',
        {
          email,
          password,
          first_name,
          last_name,
          confirm_password,
          business_name,
          business_address,
          tax_id,
        },
      );

      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    customerRegister,
    providerRegister,
    loading,
    error,
    data,
  };
};

export default useRegister;
