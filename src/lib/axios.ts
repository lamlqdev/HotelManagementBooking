import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
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

    if (originalRequest.url?.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    // Chỉ thực hiện refresh token khi gặp lỗi 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, thêm request vào hàng đợi
        return new Promise((resolve, reject) => {
          refreshSubscribers.push({
            resolve: () => {
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.post("/auth/refresh-token");

        if (response.data?.accessToken) {
          refreshSubscribers.forEach((subscriber) => {
            subscriber.resolve();
          });
          refreshSubscribers = [];

          return axiosInstance(originalRequest);
        } else {
          throw new Error("Không nhận được access token mới");
        }
      } catch (refreshError: unknown) {
        // Nếu refresh token cũng hết hạn, reject tất cả request trong queue
        refreshSubscribers.forEach((subscriber) => {
          subscriber.reject(refreshError);
        });
        refreshSubscribers = [];

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
