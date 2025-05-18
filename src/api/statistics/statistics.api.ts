import axiosInstance from "@/lib/axios";
import {
  RevenueSummaryResponse,
  RevenueChartRequest,
  RevenueChartResponse,
  TopRoomsRequest,
  TopRoomsResponse,
  BookingStatisticsResponse,
} from "./types";

const API_URL = "/statistics";

export const statisticsApi = {
  // Tổng quan doanh thu
  getRevenueSummary: async (
    period: "day" | "week" | "month" | "year" = "month"
  ): Promise<RevenueSummaryResponse> => {
    const response = await axiosInstance.get(`${API_URL}/summary`, {
      params: { period },
    });
    return response.data;
  },

  // Biểu đồ doanh thu
  getRevenueChart: async (
    params: RevenueChartRequest
  ): Promise<RevenueChartResponse> => {
    const response = await axiosInstance.get(`${API_URL}/chart`, {
      params,
    });
    return response.data;
  },

  // Top phòng doanh thu cao nhất
  getTopRooms: async (params?: TopRoomsRequest): Promise<TopRoomsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/top-rooms`, {
      params,
    });
    return response.data;
  },

  // Thống kê booking
  getBookingStatistics: async (): Promise<BookingStatisticsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/booking`);
    return response.data;
  },
};
