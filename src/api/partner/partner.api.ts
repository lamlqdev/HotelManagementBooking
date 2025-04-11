import axiosInstance from "@/lib/axios";
import { PartnerFormData } from "./types";

export const partnerApi = {
  registerPartner: async (data: PartnerFormData) => {
    const formData = new FormData();

    // Thêm các trường thông tin người dùng
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);

    // Thêm các trường thông tin khách sạn
    formData.append("hotelName", data.hotelName);
    formData.append("hotelAddress", data.hotelAddress);
    formData.append("hotelDescription", data.hotelDescription);
    formData.append("hotelLocationName", data.hotelLocationName);
    formData.append("hotelLocationDescription", data.hotelLocationDescription);
    formData.append("hotelWebsite", data.hotelWebsite || "");

    // Thêm các chính sách khách sạn
    formData.append("checkInTime", data.checkInTime);
    formData.append("checkOutTime", data.checkOutTime);
    formData.append("cancellationPolicy", data.cancellationPolicy);
    formData.append("childrenPolicy", data.childrenPolicy);
    formData.append("petPolicy", data.petPolicy);
    formData.append("smokingPolicy", data.smokingPolicy);

    // Thêm các amenities nếu có
    if (data.hotelAmenities && data.hotelAmenities.length > 0) {
      // Gửi từng amenity ID riêng lẻ thay vì gửi cả mảng dưới dạng JSON
      data.hotelAmenities.forEach((amenityId) => {
        formData.append("amenities", amenityId);
      });
    }

    // Thêm ảnh đại diện nếu có
    if (data.featuredImage) {
      formData.append("featuredImage", data.featuredImage);
    }

    // Thêm các ảnh khác nếu có
    if (data.hotelImages) {
      data.hotelImages.forEach((image) => {
        formData.append("hotelImages", image);
      });
    }

    const response = await axiosInstance.post(
      `/auth/register-partner`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
