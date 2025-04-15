import axiosInstance from "@/lib/axios";
import { AmenityResponse, AmenitiesResponse } from "./types";
import { Amenity } from "@/types/amenity";

const API_URL = "/amenities";

export const amenitiesApi = {
  // Tạo tiện ích mới
  createAmenity: async (data: Partial<Amenity>): Promise<AmenityResponse> => {
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  },

  // Lấy danh sách tiện ích
  getAmenities: async (): Promise<AmenitiesResponse> => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  },

  // Lấy thông tin một tiện ích
  getAmenity: async (id: string): Promise<AmenityResponse> => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Cập nhật tiện ích
  updateAmenity: async (
    id: string,
    data: Partial<Amenity>
  ): Promise<AmenityResponse> => {
    const response = await axiosInstance.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  // Xóa tiện ích
  deleteAmenity: async (id: string): Promise<AmenityResponse> => {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  },
};
