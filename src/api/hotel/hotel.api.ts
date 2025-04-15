import axiosInstance from "@/lib/axios";
import {
  CreateHotelDto,
  UpdateHotelDto,
  HotelResponse,
  HotelsResponse,
  HotelQueryParams,
} from "./type";

const baseUrl = "/hotels";

export const hotelApi = {
  // Lấy danh sách khách sạn
  getHotels: async (params?: HotelQueryParams): Promise<HotelsResponse> => {
    const response = await axiosInstance.get<HotelsResponse>(baseUrl, {
      params,
    });
    return response.data;
  },

  // Lấy thông tin một khách sạn
  getHotel: async (id: string): Promise<HotelResponse> => {
    const response = await axiosInstance.get<HotelResponse>(`${baseUrl}/${id}`);
    return response.data;
  },

  // Tạo khách sạn mới
  createHotel: async (data: CreateHotelDto): Promise<HotelResponse> => {
    const formData = new FormData();

    // Thêm các trường dữ liệu cơ bản
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "featuredImage" && key !== "images") {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      }
    });

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
    data: UpdateHotelDto
  ): Promise<HotelResponse> => {
    const formData = new FormData();

    // Thêm các trường dữ liệu cơ bản
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "featuredImage" && key !== "images") {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      }
    });

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

  // Upload hình ảnh cho khách sạn
  uploadHotelImages: async (
    id: string,
    images: File[]
  ): Promise<HotelResponse> => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await axiosInstance.post<HotelResponse>(
      `${baseUrl}/${id}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Xóa một ảnh từ mảng images của khách sạn
  deleteHotelImage: async (
    id: string,
    imageIndex: number
  ): Promise<HotelResponse> => {
    const response = await axiosInstance.delete<HotelResponse>(
      `${baseUrl}/${id}/images/${imageIndex}`
    );
    return response.data;
  },

  // Cập nhật ảnh đại diện
  updateFeaturedImage: async (
    id: string,
    image: File
  ): Promise<HotelResponse> => {
    const formData = new FormData();
    formData.append("featuredImage", image);

    const response = await axiosInstance.put<HotelResponse>(
      `${baseUrl}/${id}/featured-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
