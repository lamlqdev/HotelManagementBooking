import axiosInstance from "@/lib/axios";
import {
  GetRevenueStatisticsResponse,
  GetBookingStatisticsResponse,
  GetReviewStatisticsResponse,
  GetUserStatisticsResponse,
  GetRoomStatisticsResponse,
  StatisticsQueryParams,
} from "./types";

const API_URL = "/statistics";

export const statisticsApi = {
  // Thống kê doanh thu
  getRevenueStatistics: async (
    params?: StatisticsQueryParams
  ): Promise<GetRevenueStatisticsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/revenue`, { params });
    return response.data;
  },

  // Thống kê đặt phòng
  getBookingStatistics: async (
    params?: StatisticsQueryParams
  ): Promise<GetBookingStatisticsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/bookings`, { params });
    return response.data;
  },

  // Thống kê đánh giá
  getReviewStatistics: async (
    params?: StatisticsQueryParams
  ): Promise<GetReviewStatisticsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/reviews`, { params });
    return response.data;
  },

  // Thống kê người dùng
  getUserStatistics: async (
    params?: StatisticsQueryParams
  ): Promise<GetUserStatisticsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/users`, { params });
    return response.data;
  },

  // Thống kê phòng
  getRoomStatistics: async (
    params?: StatisticsQueryParams
  ): Promise<GetRoomStatisticsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/rooms`, { params });
    return response.data;
  },
};
