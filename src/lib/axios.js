import axios from "axios";
import toast from "react-hot-toast";

import { getToken, clearAuth } from "../features/auth/utils/authStorage";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData requests
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const isLoginRequest = error.config?.url?.includes("/login");

    // Token expired / invalid
    if (status === 401 && !isLoginRequest) {
      clearAuth();

      toast.error(
        error.response?.data?.message ||
          "Your session has expired. Please login again."
      );

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;