import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:8000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Setup request interceptor to add JWT token
export const setupInterceptors = (getAccessToken, refreshToken, logout) => {
  apiClient.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Setup response interceptor to handle token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshed = await refreshToken();
          if (refreshed) {
            const token = getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          } else {
            logout();
            window.location.href = "/login";
            return Promise.reject(error);
          }
        } catch (refreshError) {
          logout();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return apiClient;
};

export default apiClient;
