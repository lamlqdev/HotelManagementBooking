import { z } from "zod";

import { Room } from "@/types/room";

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
  roomType?: "Standard" | "Superior" | "Deluxe" | "Suite" | "Family";
  bedType?: "Single" | "Twin" | "Double" | "Queen" | "King";
  price?: number;
  capacity?: number;
  squareMeters?: number;
  amenities?: string[];
  images?: File[];
  cancellationPolicy?: "flexible" | "moderate" | "strict";
  status?: "available" | "booked" | "maintenance";
};

export const createRoomSchema = z.object({
  hotelId: z.string().min(1, "Vui lòng chọn khách sạn"),
  roomName: z.string().min(1, "Vui lòng nhập tên phòng"),
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
  amenities: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một tiện ích"),
  images: z.array(z.instanceof(File)).optional(),
  cancellationPolicy: z.enum(["flexible", "moderate", "strict"], {
    required_error: "Vui lòng chọn chính sách hủy phòng",
  }),
  status: z
    .enum(["available", "booked", "maintenance"])
    .optional()
    .default("available"),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
