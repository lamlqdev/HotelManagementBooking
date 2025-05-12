import axiosInstance from "@/lib/axios";
import {
  SendMessageRequest,
  SendMessageResponse,
  GetChatHistoryResponse,
  GetConversationsResponse,
  MarkAsReadResponse,
} from "./types";

const API_URL = "/chats";

export const chatApi = {
  // Gửi tin nhắn
  sendMessage: async (
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  },

  // Lấy lịch sử chat với một người
  getChatHistory: async (userId: string): Promise<GetChatHistoryResponse> => {
    const response = await axiosInstance.get(`${API_URL}/${userId}`);
    return response.data;
  },

  // Lấy danh sách cuộc trò chuyện
  getConversations: async (): Promise<GetConversationsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/conversations`);
    return response.data;
  },

  // Đánh dấu tin nhắn đã đọc
  markAsRead: async (chatId: string): Promise<MarkAsReadResponse> => {
    const response = await axiosInstance.put(`${API_URL}/${chatId}/read`);
    return response.data;
  },
};
