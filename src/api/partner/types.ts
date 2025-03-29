import * as z from "zod";

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export const availableAmenities: Amenity[] = [
  { id: "wifi", name: "WiFi", icon: "wifi" },
  { id: "parking", name: "Bãi đỗ xe", icon: "parking" },
  { id: "elevator", name: "Thang máy", icon: "elevator" },
  { id: "air-conditioning", name: "Điều hòa", icon: "air-conditioning" },
  { id: "minibar", name: "Mini bar", icon: "minibar" },
  { id: "safe", name: "Két sắt", icon: "safe" },
  { id: "balcony", name: "Ban công", icon: "balcony" },
  { id: "ocean-view", name: "View biển", icon: "ocean-view" },
  { id: "pool", name: "Bể bơi", icon: "pool" },
  { id: "gym", name: "Phòng gym", icon: "gym" },
  { id: "spa", name: "Spa", icon: "spa" },
  { id: "tennis", name: "Sân tennis", icon: "tennis" },
  { id: "restaurant", name: "Nhà hàng", icon: "restaurant" },
  { id: "bar", name: "Bar", icon: "bar" },
  { id: "cafe", name: "Café", icon: "cafe" },
  { id: "room-service", name: "Dịch vụ phòng", icon: "room-service" },
  { id: "meeting-room", name: "Phòng họp", icon: "meeting-room" },
  {
    id: "business-center",
    name: "Trung tâm kinh doanh",
    icon: "business-center",
  },
  { id: "conference-hall", name: "Hội trường", icon: "conference-hall" },
];

export const partnerFormSchema = z.object({
  // Thông tin cơ bản
  hotelName: z.string().min(2, "Tên khách sạn phải có ít nhất 2 ký tự"),
  description: z.string().min(50, "Vui lòng mô tả chi tiết về khách sạn"),
  mainImage: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Vui lòng tải lên ít nhất 1 hình ảnh")
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= 5 * 1024 * 1024),
      "Mỗi file không được vượt quá 5MB"
    ),
  galleryImages: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Vui lòng tải lên ít nhất 1 hình ảnh")
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= 5 * 1024 * 1024),
      "Mỗi file không được vượt quá 5MB"
    ),
  amenities: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 tiện nghi"),

  // Địa chỉ khách sạn
  address: z.string().min(5, "Vui lòng nhập địa chỉ đầy đủ"),
  touristSpot: z.string().min(1, "Vui lòng nhập điểm du lịch"),
  country: z.string().min(1, "Vui lòng nhập quốc gia"),
  locationDescription: z
    .string()
    .min(50, "Vui lòng mô tả vị trí địa lý và các địa điểm lân cận"),

  // Thông tin liên hệ
  contactName: z.string().min(2, "Tên người liên hệ phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  website: z.string().url("URL website không hợp lệ").optional(),

  // Chính sách và quy định
  checkInTime: z.string().min(1, "Vui lòng nhập giờ check-in"),
  checkOutTime: z.string().min(1, "Vui lòng nhập giờ check-out"),
  cancellationPolicy: z.string().min(50, "Vui lòng mô tả chính sách hủy phòng"),
  paymentPolicy: z.string().min(50, "Vui lòng mô tả chính sách thanh toán"),
  houseRules: z.string().min(50, "Vui lòng mô tả nội quy nhà"),
  childrenPolicy: z.string().min(50, "Vui lòng mô tả chính sách trẻ em"),
  petPolicy: z.string().min(50, "Vui lòng mô tả chính sách thú cưng"),
  smokingPolicy: z.string().min(50, "Vui lòng mô tả chính sách hút thuốc"),
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;
