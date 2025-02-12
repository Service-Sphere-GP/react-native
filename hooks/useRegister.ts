import { useState } from 'react';
import axios from 'axios';

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

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
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/register/customer',
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
      setError(err.response.data.data.message);
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
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/register/service-provider',
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
      setError(err.response.data.data.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    customerRegister,
    providerRegister,
    loading,
    error,
    data,
    clearError,
  };
};

export default useRegister;
