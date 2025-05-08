import axiosInstance from "@/lib/axios";
import {
  CreateBookingRequest,
  CreateBookingResponse,
  GetMyBookingsResponse,
  UpdateBookingStatusRequest,
  UpdateBookingStatusResponse,
  CheckVoucherRequest,
  CheckVoucherResponse,
  PaymentStatusResponse,
  CancelBookingResponse,
} from "./types";

const API_URL = "/bookings";

export const bookingApi = {
  // Tạo booking mới
  createBooking: async (
    data: CreateBookingRequest
  ): Promise<CreateBookingResponse> => {
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  },

  // Lấy danh sách booking của user
  getMyBookings: async (): Promise<GetMyBookingsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/my-bookings`);
    return response.data;
  },

  // Cập nhật trạng thái booking
  updateBookingStatus: async (
    bookingId: string,
    data: UpdateBookingStatusRequest
  ): Promise<UpdateBookingStatusResponse> => {
    const response = await axiosInstance.put(
      `${API_URL}/${bookingId}/status`,
      data
    );
    return response.data;
  },

  // Kiểm tra voucher
  checkVoucher: async (
    data: CheckVoucherRequest
  ): Promise<CheckVoucherResponse> => {
    const response = await axiosInstance.post(`${API_URL}/check-voucher`, data);
    return response.data;
  },

  // Xác nhận thanh toán
  confirmPayment: async (
    transactionId: string,
    paymentMethod: "zalopay" | "vnpay"
  ): Promise<PaymentStatusResponse> => {
    const response = await axiosInstance.post(`${API_URL}/confirm-payment`, {
      transactionId,
      paymentMethod,
    });
    return response.data;
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (
    transactionId: string
  ): Promise<PaymentStatusResponse> => {
    const response = await axiosInstance.get(
      `${API_URL}/payment-status/${transactionId}`
    );
    return response.data;
  },

  // Hủy booking
  cancelBooking: async (bookingId: string): Promise<CancelBookingResponse> => {
    const response = await axiosInstance.patch(`${API_URL}/${bookingId}/cancel`);
    return response.data;
  },
};
