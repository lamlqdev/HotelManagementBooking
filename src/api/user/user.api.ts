import axios from "@/lib/axios";
import {
  UploadAvatarResponse,
  UpdateMeRequest,
  UpdateMeResponse,
} from "./types";

export const userApi = {
  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.patch<UploadAvatarResponse>(
      "/users/me/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateMe: async (data: UpdateMeRequest): Promise<UpdateMeResponse> => {
    const response = await axios.put<UpdateMeResponse>("/users/me", data);
    return response.data;
  },

  getMe: async (): Promise<UpdateMeResponse> => {
    const response = await axios.get<UpdateMeResponse>("/users/me");
    return response.data;
  },
};
