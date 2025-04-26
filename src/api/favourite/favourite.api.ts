import axiosInstance from "@/lib/axios";
import {
  FavoriteResponse,
  CheckFavoriteResponse,
  PopularHotelsResponse,
} from "./types";

const API_URL = "/favorites";

export const favouriteApi = {
  // Thêm khách sạn vào danh sách yêu thích
  addFavorite: async (hotelId: string): Promise<FavoriteResponse> => {
    const response = await axiosInstance.post(API_URL, { hotelId });
    return response.data;
  },

  // Xóa khách sạn khỏi danh sách yêu thích
  removeFavorite: async (hotelId: string): Promise<FavoriteResponse> => {
    const response = await axiosInstance.delete(`${API_URL}/${hotelId}`);
    return response.data;
  },

  // Lấy danh sách khách sạn yêu thích
  getFavorites: async (): Promise<FavoriteResponse> => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  },

  // Kiểm tra xem một khách sạn có trong danh sách yêu thích không
  checkFavorite: async (hotelId: string): Promise<CheckFavoriteResponse> => {
    const response = await axiosInstance.get(`${API_URL}/${hotelId}`);
    return response.data;
  },

  // Lấy danh sách khách sạn được yêu thích nhiều nhất
  getPopularHotels: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PopularHotelsResponse> => {
    const response = await axiosInstance.get(`${API_URL}/popular-hotels`, {
      params: { page, limit },
    });
    return response.data;
  },
};
