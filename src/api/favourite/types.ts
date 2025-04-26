import { Hotel } from "@/types/hotel";

export interface FavoriteResponse {
  success: boolean;
  message?: string;
  data?: Hotel[];
}

export interface CheckFavoriteResponse {
  success: boolean;
  isFavorite: boolean;
}

export interface PopularHotelsResponse {
  success: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  data: Hotel[];
}
