// Tổng quan hệ thống
export interface SystemOverviewResponse {
  totalPartners: number;
  totalUsers: number;
  totalHotels: number;
  totalBookings: number;
  totalRevenue: number;
}

// Thống kê booking theo trạng thái
export interface BookingStatusStatistics {
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

// Thống kê khách sạn theo trạng thái
export interface HotelStatusStatistics {
  active: number;
  inactive: number;
  pending: number;
}

// Dữ liệu biểu đồ theo thời gian
export interface AdminChartDataItem {
  period: string; // yyyy-mm-dd hoặc yyyy-mm
  newBookings: number;
  newUsers: number;
  newHotels: number;
  revenue: number;
}

export type AdminChartData = AdminChartDataItem[];

// Top khách sạn có nhiều booking nhất
export interface TopHotelByBooking {
  hotelName: string;
  bookingCount: number;
  totalRevenue: number;
}

// Top người dùng có nhiều booking nhất
export interface TopUserByBooking {
  userName: string;
  userEmail: string;
  bookingCount: number;
  totalSpent: number;
}
