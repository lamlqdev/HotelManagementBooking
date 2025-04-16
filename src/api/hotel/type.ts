import { Hotel } from "@/types/hotel";

export interface HotelResponse {
  success: boolean;
  data: Hotel;
}

export interface HotelsResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  data: Hotel[];
}

export interface HotelQueryParams {
  name?: string;
  ownerId?: string;
  locationId?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscountPercent?: number;
  sort?: string;
  page?: number;
  limit?: number;
  status?: "active" | "inactive" | "pending";
  rating?: number;
}
