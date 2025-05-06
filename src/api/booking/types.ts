import { z } from "zod";
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
  paymentUrl: {
    payUrl: string;
  };
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

export const contactFormSchema = z.object({
  bookingFor: z.enum(["self", "other"]),
  guestName: z.string().optional(),
  contactName: z.string().min(1, "Vui lòng nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const specialRequestsSchema = z.object({
  earlyCheckIn: z.boolean().optional(),
  lateCheckOut: z.boolean().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  additionalRequests: z.string().optional(),
});

export type SpecialRequestsData = z.infer<typeof specialRequestsSchema>;

export interface BookingContactFormProps {
  onSubmit: (data: ContactFormData) => void;
}

export interface BookingSpecialRequestsProps {
  onSubmit: (data: SpecialRequestsData) => void;
}

export interface BookingSummaryProps {
  roomId: string;
  searchParams: {
    hotelId: string;
    checkIn: string;
    checkOut: string;
    capacity: number;
  };
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}
