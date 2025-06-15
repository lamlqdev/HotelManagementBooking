import axiosInstance from "@/lib/axios";
import {
  GeminiGenerateContentRequest,
  GeminiGenerateContentResponse,
} from "./types";

const API_URL = "/gemini";

export const geminiChatBotApi = {
  // Đặt câu hỏi cho chatbot
  generateContent: async (
    data: GeminiGenerateContentRequest
  ): Promise<GeminiGenerateContentResponse> => {
    const response = await axiosInstance.post(`${API_URL}/generate`, data);
    return response.data;
  },
};
