import { z } from "zod";
import {
  Booking,
  BookingContactInfo,
  BookingGuestInfo,
  BookingSpecialRequests,
} from "@/types/booking";
import type { AvailableVoucher } from "@/api/voucher/types";

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

export interface MyBookingRoom {
  _id: string;
  hotelId: string;
  roomName: string;
  description: string;
  floor: number;
  roomType: string;
  bedType: string;
  price: number;
  capacity: number;
  squareMeters: number;
  amenities: string[];
  images: {
    url: string;
    publicId: string;
    filename: string;
    _id: string;
  }[];
  cancellationPolicy: string;
  discountPercent: number;
  discountStartDate: string | null;
  discountEndDate: string | null;
  status: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface MyBookingItem {
  _id: string;
  user: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests: {
    additionalRequests: string;
    earlyCheckIn: boolean;
    lateCheckOut: boolean;
  };
  room: MyBookingRoom;
  bookingFor: string;
  checkIn: string;
  checkOut: string;
  voucher: unknown;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  refundStatus: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetMyBookingsResponse {
  success: boolean;
  data: MyBookingItem[];
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
  paymentMethod: z.enum(["zalopay", "vnpay"]).default("zalopay"),
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
  selectedVoucher?: AvailableVoucher;
}

export interface BookingUserInfo {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface BookingRoomInfo {
  _id: string;
  roomType: string;
  roomNumber?: string;
  price: number;
  hotelId?: string | HotelInfo;
}

export interface VoucherInfo {
  code: string;
  discount: number;
  discountType: string;
  expiryDate?: string;
}

export interface PaymentInfo {
  amount: number;
  transactionId: string;
  status: string;
  method: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HotelInfo {
  _id: string;
  name: string;
  address: string;
  city?: string;
  images?: Array<{ url: string; publicId: string; filename: string }>;
  rating?: number;
}

export interface BookingDetailsResponse {
  success: boolean;
  data: {
    _id: string;
    user: BookingUserInfo;
    room: BookingRoomInfo & { hotelId?: HotelInfo };
    voucher?: VoucherInfo;
    paymentId?: PaymentInfo;
    contactInfo: BookingContactInfo;
    specialRequests?: BookingSpecialRequests;
    bookingFor: string;
    checkIn: string;
    checkOut: string;
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    refundStatus?: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export type BookingListItem = BookingDetailsResponse["data"];

export interface Pagination {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface BookingStats {
  totalBookings: number;
  totalRevenue?: number;
  statusCounts?: Record<string, number>;
  paymentMethodCounts?: Record<string, number>;
  pendingBookings?: number;
  confirmedBookings?: number;
  cancelledBookings?: number;
  completedBookings?: number;
}

export interface GetHotelBookingsResponse {
  success: boolean;
  data: BookingListItem[];
  pagination: Pagination;
}

export interface GetAllBookingsResponse {
  success: boolean;
  data: BookingListItem[];
  pagination: Pagination;
  stats: BookingStats;
}

export interface GetMyHotelBookingsResponse {
  success: boolean;
  data: BookingListItem[];
  pagination: Pagination;
  stats: BookingStats;
  message?: string;
}
