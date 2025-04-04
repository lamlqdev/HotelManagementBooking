import axios from "axios";
import { authApi } from "@/api/auth/auth.api";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Biến để theo dõi số lần gọi refreshToken
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Chỉ thực hiện refresh token khi có accessToken trong localStorage
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("accessToken")
    ) {
      if (isRefreshing) {
        // Nếu đang refresh, thêm request vào hàng đợi
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token thông qua authApi
        const response = await authApi.refreshToken();

        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.accessToken}`;

          // Thực hiện lại các request đang đợi
          refreshSubscribers.forEach((callback) => {
            if (response.accessToken) {
              callback(response.accessToken);
            }
          });
          refreshSubscribers = [];

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn, logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
