import axiosInstance from "@/lib/axios";
import {
  ReviewResponse,
  ReviewsResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  RespondToReviewRequest,
} from "./types";

const API_URL = "/reviews";

export const reviewApi = {
  // Tạo đánh giá mới
  createReview: async (data: CreateReviewRequest): Promise<ReviewResponse> => {
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  },

  // Lấy tất cả đánh giá của một khách sạn
  getHotelReviews: async (hotelId: string): Promise<ReviewsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/${hotelId}`);
    return response.data;
  },

  // Cập nhật đánh giá
  updateReview: async (
    reviewId: string,
    data: UpdateReviewRequest
  ): Promise<ReviewResponse> => {
    const response = await axiosInstance.put(`${API_URL}/${reviewId}`, data);
    return response.data;
  },

  // Phản hồi đánh giá (dành cho chủ khách sạn)
  respondToReview: async (
    reviewId: string,
    data: RespondToReviewRequest
  ): Promise<ReviewResponse> => {
    const response = await axiosInstance.put(
      `${API_URL}/${reviewId}/respond`,
      data
    );
    return response.data;
  },

  // Xóa đánh giá
  deleteReview: async (reviewId: string): Promise<ReviewResponse> => {
    const response = await axiosInstance.delete(`${API_URL}/${reviewId}`);
    return response.data;
  },
};
