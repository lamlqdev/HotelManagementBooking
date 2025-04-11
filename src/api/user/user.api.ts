import axios from "@/lib/axios";
import { UploadAvatarResponse } from "@/types/auth";

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
};
