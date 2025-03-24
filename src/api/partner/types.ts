import * as z from "zod";

export const partnerFormSchema = z.object({
  // Thông tin khách sạn
  hotelName: z.string().min(2, "Tên khách sạn phải có ít nhất 2 ký tự"),
  businessType: z.string().min(1, "Vui lòng chọn loại hình kinh doanh"),
  taxId: z.string().min(10, "Mã số thuế không hợp lệ"),
  website: z.string().url("URL website không hợp lệ").optional(),
  starRating: z.string().min(1, "Vui lòng chọn hạng sao khách sạn"),
  roomCount: z.string().min(1, "Vui lòng nhập số lượng phòng"),
  hotelAmenities: z.string().min(10, "Vui lòng liệt kê các tiện nghi chính"),
  hotelImages: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Vui lòng tải lên ít nhất 1 hình ảnh")
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= 5 * 1024 * 1024),
      "Mỗi file không được vượt quá 5MB"
    ),

  // Địa chỉ khách sạn
  address: z.string().min(5, "Vui lòng nhập địa chỉ đầy đủ"),
  district: z.string().min(1, "Vui lòng nhập quận/huyện"),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  country: z.string().min(1, "Vui lòng nhập quốc gia"),
  locationDescription: z
    .string()
    .min(50, "Vui lòng mô tả vị trí địa lý và các địa điểm lân cận"),

  // Thông tin người đại diện
  contactName: z.string().min(2, "Tên người liên hệ phải có ít nhất 2 ký tự"),
  position: z.string().min(2, "Vui lòng nhập chức vụ"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),

  // Thông tin kinh doanh
  priceRange: z.string().min(1, "Vui lòng chọn khoảng giá phòng"),
  targetGuests: z.string().min(1, "Vui lòng chọn đối tượng khách hàng chính"),
  businessDescription: z
    .string()
    .min(200, "Vui lòng mô tả chi tiết về khách sạn (tối thiểu 200 ký tự)"),
  marketingPlans: z
    .string()
    .min(100, "Vui lòng chia sẻ kế hoạch marketing và khuyến mãi"),

  // Giấy phép & Chứng nhận
  businessLicense: z.string().min(5, "Vui lòng nhập số giấy phép kinh doanh"),
  certifications: z.string().optional(),
  certificateImages: z
    .instanceof(FileList)
    .refine(
      (files) => files.length > 0,
      "Vui lòng tải lên ít nhất 1 hình ảnh giấy phép"
    )
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= 5 * 1024 * 1024),
      "Mỗi file không được vượt quá 5MB"
    ),
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;
