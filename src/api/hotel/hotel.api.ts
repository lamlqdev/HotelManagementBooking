import axiosInstance from "@/lib/axios";
import {
  HotelImage,
  CreateHotelDto,
  UpdateHotelDto,
  HotelResponse,
  SingleHotelResponse,
} from "./type";

export const hotelApi = {
  // API lấy danh sách khách sạn
  getHotels: async () => {
    const response = await axiosInstance.get<HotelResponse>("/hotels");
    return response.data;
  },

  // API lấy thông tin một khách sạn
  getHotel: async (id: string) => {
    const response = await axiosInstance.get<SingleHotelResponse>(
      `/hotels/${id}`
    );
    return response.data;
  },

  // API tạo khách sạn mới
  createHotel: async (data: CreateHotelDto) => {
    const formData = new FormData();

    // Thêm các trường dữ liệu cơ bản
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "featuredImage" && key !== "images") {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value as string);
        }
      }
    });

    // Thêm ảnh đại diện nếu có
    if (data.featuredImage) {
      formData.append("featuredImage", data.featuredImage);
    }

    // Thêm mảng ảnh nếu có
    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axiosInstance.post<SingleHotelResponse>(
      "/hotels",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // API cập nhật thông tin khách sạn
  updateHotel: async (id: string, data: UpdateHotelDto) => {
    const formData = new FormData();

    // Thêm các trường dữ liệu cơ bản
    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== "featuredImage" &&
        key !== "images" &&
        key !== "replaceAllImages"
      ) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value as string);
        }
      }
    });

    // Thêm flag replaceAllImages nếu có
    if (data.replaceAllImages !== undefined) {
      formData.append("replaceAllImages", data.replaceAllImages.toString());
    }

    // Thêm ảnh đại diện nếu có
    if (data.featuredImage) {
      formData.append("featuredImage", data.featuredImage);
    }

    // Thêm mảng ảnh nếu có
    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axiosInstance.put<SingleHotelResponse>(
      `/hotels/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // API xóa khách sạn
  deleteHotel: async (id: string) => {
    const response = await axiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/hotels/${id}`);
    return response.data;
  },

  // API upload thêm ảnh cho khách sạn
  uploadHotelImages: async (id: string, images: File[]) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await axiosInstance.post<{
      success: boolean;
      count: number;
      data: HotelImage[];
    }>(`/hotels/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // API xóa một ảnh từ mảng images
  deleteHotelImage: async (id: string, imageIndex: number) => {
    const response = await axiosInstance.delete<{
      success: boolean;
      message: string;
      data: HotelImage[];
    }>(`/hotels/${id}/images/${imageIndex}`);
    return response.data;
  },

  // API cập nhật ảnh đại diện
  updateFeaturedImage: async (id: string, image: File) => {
    const formData = new FormData();
    formData.append("featuredImage", image);

    const response = await axiosInstance.put<{
      success: boolean;
      data: HotelImage;
    }>(`/hotels/${id}/featured-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
