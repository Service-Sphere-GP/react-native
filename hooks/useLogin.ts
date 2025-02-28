import { useState } from 'react';
import axios from 'axios';

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

      setData(response.data); // Assuming the response contains user data or tokens
    } catch (err: any) {
      setError(err.response.data.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, data };
};

export default useLogin;
