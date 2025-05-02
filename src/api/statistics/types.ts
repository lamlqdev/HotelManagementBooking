// Thống kê doanh thu
export interface RevenueStatistic {
  _id: string;
  totalRevenue: number;
  bookingCount: number;
}

export interface GetRevenueStatisticsResponse {
  success: boolean;
  totalRevenue: number;
  data: RevenueStatistic[];
}

// Thống kê đặt phòng
export interface BookingStatistic {
  _id: string;
  count: number;
}

export interface GetBookingStatisticsResponse {
  success: boolean;
  data: BookingStatistic[];
}

// Thống kê đánh giá
export interface ReviewStatistic {
  _id: number;
  count: number;
}

export interface GetReviewStatisticsResponse {
  success: boolean;
  totalReviews: number;
  averageRating: number;
  data: ReviewStatistic[];
}

// Thống kê người dùng
export interface UserStatistic {
  _id: string;
  count: number;
}

export interface GetUserStatisticsResponse {
  success: boolean;
  totalUsers: number;
  data: UserStatistic[];
}

// Thống kê phòng
export interface RoomStatistic {
  roomType: string;
  bedType: string;
  bookingCount: number;
  totalRevenue: number;
}

export interface GetRoomStatisticsResponse {
  success: boolean;
  data: RoomStatistic[];
}

// Query parameters
export interface StatisticsQueryParams {
  startDate?: string;
  endDate?: string;
  hotelId?: string;
  groupBy?: "day" | "week" | "month" | "year";
  status?: string;
}
