import axiosInstance from "@/lib/axios";
import {
  GetNotificationsResponse,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
  SendAdminNotificationRequest,
  SendAdminNotificationResponse,
} from "./types";

const API_URL = "/notifications";

export const notificationApi = {
  // Lấy danh sách thông báo của user
  getNotifications: async (): Promise<GetNotificationsResponse> => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  },

  // Đánh dấu thông báo đã đọc
  markAsRead: async (notificationId: string): Promise<MarkAsReadResponse> => {
    const response = await axiosInstance.put(
      `${API_URL}/${notificationId}/read`
    );
    return response.data;
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async (): Promise<MarkAllAsReadResponse> => {
    const response = await axiosInstance.put(`${API_URL}/read-all`);
    return response.data;
  },

  // Gửi thông báo admin
  sendAdminNotification: async (
    data: SendAdminNotificationRequest
  ): Promise<SendAdminNotificationResponse> => {
    const response = await axiosInstance.post(`${API_URL}/admin`, data);
    return response.data;
  },
};
