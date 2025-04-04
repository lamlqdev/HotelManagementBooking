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
    hotelLocationName: z
      .string()
      .min(1, "Vui lòng nhập tên địa điểm du lịch")
      .max(100, "Tên địa điểm không được vượt quá 100 ký tự"),
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
        (value) => ["allowed", "not-allowed"].includes(value),
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
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP"
      ),
    galleryImages: z
      .array(
        z
          .instanceof(File, { message: "Vui lòng tải lên ảnh gallery" })
          .refine(
            (file) => file.size <= 5 * 1024 * 1024,
            "Kích thước ảnh không được vượt quá 5MB"
          )
          .refine(
            (file) =>
              ["image/jpeg", "image/png", "image/webp"].includes(file.type),
            "Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP"
          )
      )
      .min(1, "Vui lòng tải lên ít nhất một ảnh gallery")
      .max(10, "Không được tải lên quá 10 ảnh gallery"),
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
      return checkOutHours > checkInHours;
    },
    {
      message: "Giờ trả phòng phải sau giờ nhận phòng",
      path: ["checkOutTime"],
    }
  );

export type PartnerFormData = z.infer<typeof partnerFormSchema>;
