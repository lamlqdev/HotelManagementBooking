import { z } from "zod";

import { Room } from "@/types/room";
import { Hotel } from "@/types/hotel";

export type RoomResponse = {
  success: boolean;
  data: Room;
  message?: string;
};

export type RoomsResponse = {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  data: Room[];
};

export type HotelResponse = {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  data: Hotel[];
};

export type RoomQueryParams = {
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  available?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
};

export type RoomSearchParams = {
  locationName: string;
  checkIn: string;
  checkOut: string;
  capacity: number;
  hotelName?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
};

export type RoomDiscountParams = {
  discountPercent: number;
  startDate: string;
  endDate: string;
};

export type UpdateRoomData = {
  name?: string;
  floor?: number;
  roomType?: string;
  bedType?: string;
  description?: string;
  price?: number;
  capacity?: number;
  squareMeters?: number;
  cancellationPolicy?: string;
  status?: string;
  amenities?: string[];
  images?: File[];
};

export type UpdateRoomFormData = FormData;

export const createRoomSchema = z.object({
  hotelId: z.string().min(1, "Vui lòng chọn khách sạn"),
  name: z.string().min(1, "Vui lòng nhập tên phòng"),
  description: z.string().min(1, "Vui lòng nhập mô tả phòng"),
  floor: z
    .number()
    .min(1, "Vui lòng nhập số tầng")
    .max(100, "Số tầng không hợp lệ"),
  roomType: z.enum(["Standard", "Superior", "Deluxe", "Suite", "Family"], {
    required_error: "Vui lòng chọn loại phòng",
  }),
  bedType: z.enum(["Single", "Twin", "Double", "Queen", "King"], {
    required_error: "Vui lòng chọn loại giường",
  }),
  price: z.number().min(0, "Giá phòng không được âm"),
  capacity: z
    .number()
    .min(1, "Vui lòng nhập số người tối đa")
    .max(10, "Số người tối đa không hợp lệ"),
  squareMeters: z
    .number()
    .min(1, "Vui lòng nhập diện tích phòng")
    .max(1000, "Diện tích phòng không hợp lệ"),
  amenities: z.array(z.string()).min(2, "Vui lòng chọn ít nhất hai tiện ích"),
  images: z
    .array(z.instanceof(File))
    .min(1, "Vui lòng chọn ít nhất một hình ảnh"),
  cancellationPolicy: z.enum(["flexible", "moderate", "strict"], {
    required_error: "Vui lòng chọn chính sách hủy phòng",
  }),
  status: z
    .enum(["available", "booked", "maintenance"])
    .optional()
    .default("available"),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;

export type PartnerRoomQueryParams = {
  name?: string;
  floor?: number;
  bedType?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  status?: string;
  roomType?: string;
  amenities?: string[];
  hasDiscount?: boolean | string;
  isBooked?: boolean | string;
  checkIn?: string;
  checkOut?: string;
  sort?: string;
  page?: number;
  limit?: number;
};
