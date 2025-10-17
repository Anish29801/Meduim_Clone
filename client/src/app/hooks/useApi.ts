import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callApi = useCallback(
    async (url: string, config?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios(url, config);
        setData(response.data);
        return response.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const message =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          'Something went wrong';
        setError(message);
        throw axiosErr;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, error, loading, callApi };
}
