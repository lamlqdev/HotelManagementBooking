import axiosInstance from "@/lib/axios";
import {
  CreateLocationDto,
  UpdateLocationDto,
  LocationResponse,
  SingleLocationResponse,
  PopularLocationResponse,
} from "./types";

export const locationApi = {
  // API lấy danh sách địa điểm
  getLocations: async () => {
    const response = await axiosInstance.get<LocationResponse>("/locations");
    return response.data;
  },

  // API lấy thông tin một địa điểm
  getLocation: async (id: string) => {
    const response = await axiosInstance.get<SingleLocationResponse>(
      `/locations/${id}`
    );
    return response.data;
  },

  // API tạo địa điểm mới
  createLocation: async (data: CreateLocationDto) => {
    const formData = new FormData();

    // Thêm các trường dữ liệu cơ bản
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image") {
        formData.append(key, value as string);
      }
    });

    // Thêm ảnh nếu có
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await axiosInstance.post<SingleLocationResponse>(
      "/locations",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // API cập nhật thông tin địa điểm
  updateLocation: async (id: string, data: UpdateLocationDto) => {
    const formData = new FormData();

    // Thêm các trường dữ liệu cơ bản
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image") {
        formData.append(key, value as string);
      }
    });

    // Thêm ảnh nếu có
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await axiosInstance.put<SingleLocationResponse>(
      `/locations/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // API xóa địa điểm
  deleteLocation: async (id: string) => {
    const response = await axiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/locations/${id}`);
    return response.data;
  },

  // API lấy top 10 địa điểm phổ biến nhất
  getPopularLocations: async () => {
    const response = await axiosInstance.get<PopularLocationResponse>(
      "/locations/popular"
    );
    return response.data;
  },
};
