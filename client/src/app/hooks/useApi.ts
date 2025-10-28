// src/app/hooks/useApi.ts
import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import toast from 'react-hot-toast';

// ✅ Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor – attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      // Cast headers to satisfy Axios 1.x + TS
      (config.headers as Record<string, string>) = {
        ...(config.headers as Record<string, string>),
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor – handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('/login')
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Custom hook

export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callApi = useCallback(
    async (endpoint: string, config: AxiosRequestConfig = {}) => {
      setLoading(true);
      setError(null);

      try {
        if (!endpoint) throw new Error('Endpoint is required');

        const normalizedEndpoint = endpoint.startsWith('/')
          ? endpoint
          : `/${endpoint}`;
        console.log(
          '[useApi] Request:',
          normalizedEndpoint,
          config.method?.toUpperCase() || 'GET'
        );

        // Ensure body is only sent for POST/PUT/PATCH
        const method = (config.method || 'GET').toUpperCase();
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
          config.data = config.data || {};
        }

        const response = await axiosInstance({
          url: normalizedEndpoint,
          ...config,
        });

        setData(response.data);
        return response.data;
      } catch (err) {
        const axiosErr = err as AxiosError<unknown>;
        let message = axiosErr.message || 'Something went wrong';

        // Try to get server message
        if (axiosErr.response) {
          const respData = axiosErr.response.data as any;
          if (respData?.message) message = respData.message;

          // ✅ Pretty console log
          console.error(
            '[useApi] Server Error:',
            message,
            typeof respData === 'object'
              ? JSON.stringify(respData, null, 2)
              : respData
          );
        } else {
          console.error('[useApi] Network/Error:', message);
        }

        setError(message);
        toast.error(message); // show user-friendly toast
        throw axiosErr;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, error, loading, callApi };
}
