import { z } from "zod";

export const partnerFormSchema = z
  .object({
    // Thông tin người dùng
    name: z
      .string()
      .min(1, "Vui lòng nhập họ tên")
      .max(100, "Họ tên không được vượt quá 100 ký tự"),
    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    phone: z
      .string()
      .min(1, "Vui lòng nhập số điện thoại")
      .regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),

    // Thông tin khách sạn
    hotelName: z
      .string()
      .min(1, "Vui lòng nhập tên khách sạn")
      .max(100, "Tên khách sạn không được vượt quá 100 ký tự"),
    hotelAddress: z
      .string()
      .min(1, "Vui lòng nhập địa chỉ khách sạn")
      .max(200, "Địa chỉ không được vượt quá 200 ký tự"),
    hotelDescription: z
      .string()
      .min(1, "Vui lòng nhập mô tả khách sạn")
      .max(1000, "Mô tả không được vượt quá 1000 ký tự"),
    locationId: z.string().min(1, "Vui lòng chọn địa điểm du lịch"),
    hotelLocationDescription: z
      .string()
      .min(1, "Vui lòng nhập mô tả địa điểm")
      .max(500, "Mô tả không được vượt quá 500 ký tự"),
    hotelAmenities: z
      .array(z.string())
      .min(1, "Vui lòng chọn ít nhất một tiện ích"),
    hotelWebsite: z
      .string()
      .url("Website không hợp lệ")
      .optional()
      .or(z.literal("")),

    // Chính sách khách sạn
    checkInTime: z
      .string()
      .min(1, "Vui lòng chọn giờ nhận phòng")
      .refine((time) => {
        const [hours] = time.split(":").map(Number);
        return hours >= 0 && hours < 24;
      }, "Giờ nhận phòng không hợp lệ"),
    checkOutTime: z
      .string()
      .min(1, "Vui lòng chọn giờ trả phòng")
      .refine((time) => {
        const [hours] = time.split(":").map(Number);
        return hours >= 0 && hours < 24;
      }, "Giờ trả phòng không hợp lệ"),
    cancellationPolicy: z
      .string()
      .min(1, "Vui lòng chọn chính sách hủy phòng")
      .refine(
        (value) =>
          ["24h-full-refund", "24h-half-refund", "no-refund"].includes(value),
        "Vui lòng chọn chính sách hủy phòng hợp lệ"
      ),
    childrenPolicy: z
      .string()
      .min(1, "Vui lòng chọn chính sách trẻ em")
      .refine(
        (value) => ["yes", "no"].includes(value),
        "Vui lòng chọn chính sách trẻ em hợp lệ"
      ),
    childrenAgeDefinition: z
      .number()
      .min(0, "Độ tuổi không được nhỏ hơn 0")
      .max(18, "Độ tuổi không được lớn hơn 18")
      .default(12),
    petPolicy: z
      .string()
      .min(1, "Vui lòng chọn chính sách thú cưng")
      .refine(
        (value) => ["yes", "no"].includes(value),
        "Vui lòng chọn chính sách thú cưng hợp lệ"
      ),
    smokingPolicy: z
      .string()
      .min(1, "Vui lòng chọn chính sách hút thuốc")
      .refine(
        (value) => ["yes", "no"].includes(value),
        "Vui lòng chọn chính sách hút thuốc hợp lệ"
      ),

    // Hình ảnh
    featuredImage: z
      .instanceof(File, { message: "Vui lòng tải lên ảnh đại diện" })
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "Kích thước ảnh không được vượt quá 5MB"
      )
      .refine(
        (file) => file.type.startsWith("image/"),
        "File phải là hình ảnh"
      ),
    hotelImages: z
      .array(z.instanceof(File))
      .refine(
        (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
        "Kích thước mỗi ảnh không được vượt quá 5MB"
      )
      .refine(
        (files) => files.every((file) => file.type.startsWith("image/")),
        "Tất cả các file phải là hình ảnh"
      )
      .optional()
      .default([]),
  })
  .refine(
    (data) => {
      if (data.childrenPolicy === "allowed") {
        return data.childrenAgeDefinition !== undefined;
      }
      return true;
    },
    {
      message: "Vui lòng chọn độ tuổi được coi là trẻ em",
      path: ["childrenAgeDefinition"],
    }
  )
  .refine(
    (data) => {
      const [checkInHours] = data.checkInTime.split(":").map(Number);
      const [checkOutHours] = data.checkOutTime.split(":").map(Number);
      return checkInHours > checkOutHours;
    },
    {
      message: "Giờ nhận phòng phải lớn hơn giờ trả phòng",
      path: ["checkOutTime"],
    }
  );

// Định nghĩa kiểu dữ liệu cho response API
export interface PartnerResponse {
  success: boolean;
  count: number;
  data: Partner[];
}

export interface Partner {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    isEmailVerified: boolean;
    avatar: Array<{
      url: string;
      publicId: string;
      filename: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
  hotel: {
    _id: string;
    name: string;
    address: string;
    locationId: string;
    locationDescription: string;
    description: string;
    featuredImage: {
      url: string;
      publicId: string;
      filename: string;
    };
    images: Array<{
      url: string;
      publicId: string;
      filename: string;
    }>;
    policies: {
      checkInTime: string;
      checkOutTime: string;
      cancellationPolicy: string;
      childrenPolicy: string;
      petPolicy: string;
      smokingPolicy: string;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export type PartnerFormData = z.infer<typeof partnerFormSchema>;
