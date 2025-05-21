import axiosInstance from "@/lib/axios";
import {
  CreatePostRequest,
  CreatePostResponse,
  GetPostsResponse,
  GetPostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  DeletePostResponse,
  AddInteractionRequest,
  AddInteractionResponse,
  GetPostInteractionsResponse,
  DeleteInteractionResponse,
} from "./types";

const API_URL = "/posts";

export const postApi = {
  // Tạo bài viết mới
  createPost: async (data: FormData): Promise<CreatePostResponse> => {
    const response = await axiosInstance.post(API_URL, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Lấy danh sách bài viết
  getPosts: async (): Promise<GetPostsResponse> => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  },

  // Lấy chi tiết bài viết
  getPost: async (postId: string): Promise<GetPostResponse> => {
    const response = await axiosInstance.get(`${API_URL}/${postId}`);
    return response.data;
  },

  // Cập nhật bài viết
  updatePost: async (
    postId: string,
    data: FormData
  ): Promise<UpdatePostResponse> => {
    const response = await axiosInstance.put(`${API_URL}/${postId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Xóa bài viết
  deletePost: async (postId: string): Promise<DeletePostResponse> => {
    const response = await axiosInstance.delete(`${API_URL}/${postId}`);
    return response.data;
  },

  // Thêm tương tác
  addInteraction: async (
    postId: string,
    data: AddInteractionRequest
  ): Promise<AddInteractionResponse> => {
    const response = await axiosInstance.post(
      `${API_URL}/${postId}/interactions`,
      data
    );
    return response.data;
  },

  // Lấy danh sách tương tác của bài viết
  getPostInteractions: async (
    postId: string
  ): Promise<GetPostInteractionsResponse> => {
    const response = await axiosInstance.get(
      `${API_URL}/${postId}/interactions`
    );
    return response.data;
  },

  // Xóa tương tác
  deleteInteraction: async (
    postId: string,
    interactionId: string
  ): Promise<DeleteInteractionResponse> => {
    const response = await axiosInstance.delete(
      `${API_URL}/${postId}/interactions/${interactionId}`
    );
    return response.data;
  },
};
