// src/app/hooks/useApi.ts
import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

// ✅ Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor – attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
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
        if (!endpoint) throw new Error("Endpoint is required");

        const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
        console.log("[useApi] Request:", normalizedEndpoint, config.method || "GET");

        // Ensure body is only sent for POST/PUT/PATCH
        const method = (config.method || "GET").toUpperCase();
        if (method === "POST" || method === "PUT" || method === "PATCH") {
          config.data = config.data || {};
        }

        const response = await axiosInstance({
          url: normalizedEndpoint,
          ...config,
        });

        setData(response.data);
        return response.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const message =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Something went wrong";
        setError(message);
        console.error("[useApi] Error:", message, axiosErr.response?.data);
        throw axiosErr;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, error, loading, callApi };
}
