import axiosInstance from "@/lib/axios";
import {
  SystemOverviewResponse,
  BookingStatusStatistics,
  HotelStatusStatistics,
  AdminChartData,
  TopHotelByBooking,
  TopUserByBooking,
} from "./types";

const API_URL = "/admin-statistics";

export const adminStatisticsApi = {
  // Tổng quan hệ thống
  getSystemOverview: async (): Promise<{
    success: boolean;
    data: SystemOverviewResponse;
  }> => {
    const res = await axiosInstance.get(`${API_URL}/system-overview`);
    return res.data;
  },

  // Thống kê booking theo trạng thái
  getBookingStatus: async (): Promise<{
    success: boolean;
    data: BookingStatusStatistics;
  }> => {
    const res = await axiosInstance.get(`${API_URL}/booking-status`);
    return res.data;
  },

  // Thống kê khách sạn theo trạng thái
  getHotelStatus: async (): Promise<{
    success: boolean;
    data: HotelStatusStatistics;
  }> => {
    const res = await axiosInstance.get(`${API_URL}/hotel-status`);
    return res.data;
  },

  // Dữ liệu biểu đồ theo thời gian
  getChartData: async (params: {
    from: string;
    to: string;
    groupBy?: "day" | "month";
  }): Promise<{ success: boolean; data: AdminChartData }> => {
    const res = await axiosInstance.get(`${API_URL}/chart-data`, { params });
    return res.data;
  },

  // Top khách sạn có nhiều booking nhất
  getTopHotelsByBookings: async (params?: {
    limit?: number;
    from?: string;
    to?: string;
  }): Promise<{ success: boolean; data: TopHotelByBooking[] }> => {
    const res = await axiosInstance.get(`${API_URL}/top-hotels`, { params });
    return res.data;
  },

  // Top người dùng có nhiều booking nhất
  getTopUsersByBookings: async (params?: {
    limit?: number;
    from?: string;
    to?: string;
  }): Promise<{ success: boolean; data: TopUserByBooking[] }> => {
    const res = await axiosInstance.get(`${API_URL}/top-users`, { params });
    return res.data;
  },
};
