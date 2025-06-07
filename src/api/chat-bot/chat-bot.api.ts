import axiosInstance from "@/lib/axios";
import {
  ChatBotMessage,
  ChatBotEvent,
  ChatBotResponse,
  ChatBotEventResponse,
  ChatBotHealthResponse,
  ChatBotSessionResponse,
} from "./types";

const API_URL = "/chatbot";

export const chatBotApi = {
  // Gửi tin nhắn đến chatbot
  sendMessage: async (data: ChatBotMessage): Promise<ChatBotResponse> => {
    const response = await axiosInstance.post(`${API_URL}/message`, data);
    return response.data;
  },

  // Gửi event đến chatbot
  sendEvent: async (data: ChatBotEvent): Promise<ChatBotEventResponse> => {
    const response = await axiosInstance.post(`${API_URL}/event`, data);
    return response.data;
  },

  // Xóa session chat
  clearSession: async (sessionId: string): Promise<ChatBotSessionResponse> => {
    const response = await axiosInstance.delete(
      `${API_URL}/session/${sessionId}`
    );
    return response.data;
  },

  // Kiểm tra trạng thái kết nối
  checkHealth: async (): Promise<ChatBotHealthResponse> => {
    const response = await axiosInstance.get(`${API_URL}/health`);
    return response.data;
  },
};
