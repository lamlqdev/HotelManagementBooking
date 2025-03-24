import { UploadAvatarResponse } from "./types";
import axiosInstance from "@/lib/axios";

const API_URL = "/users/me";

export const userApi = {
  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const response = await axiosInstance.put(`${API_URL}/avatar`, {
      avatar: file,
    });
    return response.data;
  },
};
