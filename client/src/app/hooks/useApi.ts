// hooks/useApi.ts
import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

// ✅ Create Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

// ✅ Request interceptor – attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ✅ Custom Hook
export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callApi = useCallback(
    async (endpoint: string, config?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);
      try {
        // 👇 Uses baseURL automatically
        const response = await axiosInstance(endpoint, config);
        setData(response.data);
        return response.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const message =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Something went wrong";
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
