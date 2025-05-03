import axiosInstance from "@/lib/axios";
import { HotelResponse, HotelsResponse, HotelQueryParams } from "./types";

const baseUrl = "/hotels";

export const hotelApi = {
  // Lấy danh sách khách sạn
  getHotels: async (params?: HotelQueryParams): Promise<HotelsResponse> => {
    const response = await axiosInstance.get<HotelsResponse>(baseUrl, {
      params,
    });
    return response.data;
  },

  // Lấy danh sách khách sạn của đối tác đang đăng nhập
  getMyHotels: async (params?: HotelQueryParams): Promise<HotelsResponse> => {
    const response = await axiosInstance.get<HotelsResponse>(
      `${baseUrl}/my-hotels`,
      {
        params,
      }
    );
    return response.data;
  },

  // Lấy thông tin một khách sạn
  getHotel: async (id: string): Promise<HotelResponse> => {
    const response = await axiosInstance.get<HotelResponse>(`${baseUrl}/${id}`);
    return response.data;
  },

  // Tạo khách sạn mới
  createHotel: async (data: {
    name: string;
    description: string;
    address: string;
    locationId: string;
    locationDescription?: string;
    website?: string;
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: string;
    childrenPolicy: string;
    petPolicy: string;
    smokingPolicy: string;
    amenities?: string[];
    featuredImage?: File;
    images?: File[];
  }): Promise<HotelResponse> => {
    const formData = new FormData();

    // Thêm các trường thông tin cơ bản
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("address", data.address);
    formData.append("locationId", data.locationId);
    if (data.locationDescription) {
      formData.append("locationDescription", data.locationDescription);
    }
    if (data.website) {
      formData.append("website", data.website);
    }

    // Thêm các chính sách
    formData.append("checkInTime", data.checkInTime);
    formData.append("checkOutTime", data.checkOutTime);
    formData.append("cancellationPolicy", data.cancellationPolicy);
    formData.append("childrenPolicy", data.childrenPolicy);
    formData.append("petPolicy", data.petPolicy);
    formData.append("smokingPolicy", data.smokingPolicy);

    // Thêm amenities nếu có
    if (data.amenities && data.amenities.length > 0) {
      data.amenities.forEach((amenityId) => {
        formData.append("amenities", amenityId);
      });
    }

    // Thêm ảnh đại diện nếu có
    if (data.featuredImage) {
      formData.append("featuredImage", data.featuredImage);
    }

    // Thêm các ảnh khác nếu có
    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axiosInstance.post<HotelResponse>(
      baseUrl,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Cập nhật thông tin khách sạn
  updateHotel: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      address?: string;
      locationId?: string;
      locationDescription?: string;
      website?: string;
      policies?: {
        checkInTime?: string;
        checkOutTime?: string;
        cancellationPolicy?:
          | "24h-full-refund"
          | "24h-half-refund"
          | "no-refund";
        childrenPolicy?: "yes" | "no";
        petPolicy?: "yes" | "no";
        smokingPolicy?: "yes" | "no";
      };
      amenities?: string[];
      featuredImage?: File;
      images?: File[];
      status?: "active" | "inactive";
    }
  ): Promise<HotelResponse> => {
    const formData = new FormData();

    // Thêm các trường thông tin cơ bản nếu có
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.address) formData.append("address", data.address);
    if (data.locationId) formData.append("locationId", data.locationId);
    if (data.locationDescription)
      formData.append("locationDescription", data.locationDescription);
    if (data.website) formData.append("website", data.website);

    // Thêm policies nếu có
    if (data.policies) {
      Object.entries(data.policies).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(`policies[${key}]`, value);
        }
      });
    }

    // Thêm amenities nếu có
    if (data.amenities && data.amenities.length > 0) {
      data.amenities.forEach((amenityId) => {
        formData.append("amenities", amenityId);
      });
    }

    // Thêm status nếu có
    if (data.status) formData.append("status", data.status);

    // Thêm ảnh đại diện nếu có
    if (data.featuredImage) {
      formData.append("featuredImage", data.featuredImage);
    }

    // Thêm các ảnh khác nếu có
    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    console.log(formData);

    const response = await axiosInstance.put<HotelResponse>(
      `${baseUrl}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Xóa khách sạn
  deleteHotel: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(`${baseUrl}/${id}`);
    return response.data;
  },

  // Lấy danh sách khách sạn theo địa điểm
  getHotelsByLocation: async (locationId: string): Promise<HotelsResponse> => {
    const response = await axiosInstance.get<HotelsResponse>(
      `${baseUrl}/location/${locationId}`
    );
    return response.data;
  },

  // Lấy danh sách khách sạn đang có giảm giá
  getDiscountedHotels: async (params?: {
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<HotelsResponse> => {
    const response = await axiosInstance.get<HotelsResponse>(
      `${baseUrl}/discounts`,
      {
        params,
      }
    );
    return response.data;
  },
};
