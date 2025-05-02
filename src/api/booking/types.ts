import {
  Booking,
  BookingContactInfo,
  BookingGuestInfo,
  BookingSpecialRequests,
} from "@/types/booking";

export interface CreateBookingRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
  voucherId?: string;
  paymentMethod?: "zalopay" | "vnpay";
  bookingFor?: "self" | "other";
  contactInfo: BookingContactInfo;
  guestInfo?: BookingGuestInfo;
  specialRequests?: BookingSpecialRequests;
}

export interface CreateBookingResponse {
  success: boolean;
  data: Booking;
  paymentUrl: string;
}

export interface GetMyBookingsResponse {
  success: boolean;
  data: Booking[];
}

export interface UpdateBookingStatusRequest {
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

export interface UpdateBookingStatusResponse {
  success: boolean;
  data: Booking;
}

export interface CheckVoucherRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
  voucherCode: string;
}

export interface CheckVoucherResponse {
  success: boolean;
  data: {
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    voucherId: string;
    voucherInfo: {
      code: string;
      discountType: string;
      discount: number;
      expiryDate: Date;
    };
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  data: {
    status: string;
    transactionId: string;
    amount: number;
  };
}

export interface CancelBookingResponse {
  success: boolean;
  message: string;
}
