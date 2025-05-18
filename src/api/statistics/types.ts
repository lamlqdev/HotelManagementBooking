// Tổng quan doanh thu
export interface RevenueSummaryResponse {
  success: boolean;
  data: {
    totalRevenue: number;
    totalBookings: number;
    successfulBookings: number;
    cancelledBookings: number;
    pendingBookings: number;
    previousPeriodRevenue: number;
    revenueChange: number | string;
  };
}

// Biểu đồ doanh thu
export interface RevenueChartRequest {
  from: string;
  to: string;
  groupBy?: "day" | "month";
}

export interface RevenueChartItem {
  period: string;
  revenue: number;
  bookings: number;
}

export interface RevenueChartResponse {
  success: boolean;
  data: RevenueChartItem[];
}

// Top phòng doanh thu cao nhất
export interface TopRoom {
  _id: string; // id phòng
  totalRevenue: number;
  bookingCount: number;
  hotelName?: string;
}

export interface TopRoomsRequest {
  limit?: number;
  from?: string;
  to?: string;
}

export interface TopRoomsResponse {
  success: boolean;
  data: TopRoom[];
}

// Thống kê booking
export interface BookingStatisticsResponse {
  success: boolean;
  data: {
    totalBookings: number;
    successfulBookings: number;
    cancelledBookings: number;
    pendingBookings: number;
  };
}
