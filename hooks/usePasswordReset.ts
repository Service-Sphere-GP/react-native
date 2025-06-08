import { useState } from 'react';
import ApiService from '../constants/ApiService';
import { API_ENDPOINTS } from '../constants/ApiConfig';

type PasswordResetError = string | null;

const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PasswordResetError>(null);

  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        email,
      });

      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.patch(
        API_ENDPOINTS.RESET_PASSWORD.replace(':token', token),
        {
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
      );

      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    requestPasswordReset,
    resetPassword,
  };
};

export default usePasswordReset;
