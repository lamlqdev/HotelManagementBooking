import axios from "@/lib/axios";
import {
  UploadAvatarResponse,
  UpdateMeRequest,
  UpdateMeResponse,
  GetUsersParams,
  GetUsersResponse,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
  GetUserStatsResponse,
  DeactivateUserRequest,
  DeactivateUserResponse,
  ActivateUserResponse,
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

  getUsers: async (params: GetUsersParams): Promise<GetUsersResponse> => {
    const response = await axios.get<GetUsersResponse>("/users", { params });
    return response.data;
  },

  getUser: async (id: string): Promise<GetUserResponse> => {
    const response = await axios.get<GetUserResponse>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (
    id: string,
    data: UpdateUserRequest
  ): Promise<UpdateUserResponse> => {
    const response = await axios.put<UpdateUserResponse>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<DeleteUserResponse> => {
    const response = await axios.delete<DeleteUserResponse>(`/users/${id}`);
    return response.data;
  },

  getUserStats: async (): Promise<GetUserStatsResponse> => {
    const response = await axios.get<GetUserStatsResponse>("/users/stats");
    return response.data;
  },

  deactivateUser: async (
    id: string,
    data: DeactivateUserRequest
  ): Promise<DeactivateUserResponse> => {
    const response = await axios.patch<DeactivateUserResponse>(
      `/users/${id}/deactivate`,
      data
    );
    return response.data;
  },

  activateUser: async (id: string): Promise<ActivateUserResponse> => {
    const response = await axios.patch<ActivateUserResponse>(
      `/users/${id}/activate`
    );
    return response.data;
  },
};
