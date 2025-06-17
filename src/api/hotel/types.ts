import { Hotel } from "@/types/hotel";
import { Room } from "@/types/room";

export interface SearchHotelsWithAvailableRoomsParams {
  locationName: string;
  checkIn: string;
  checkOut: string;
  capacity: number;
  hotelName?: string;
  minPrice?: number;
  maxPrice?: number;
  roomType?: string[];
  roomAmenities?: string;
  hotelAmenities?: string;
  minRating?: number;
  maxRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

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

export interface SearchHotelsWithAvailableRoomsResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  data: Array<{
    _id: string;
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
    images: Array<{
      url: string;
      publicId: string;
      filename: string;
    }>;
    featuredImage: {
      url: string;
      publicId: string;
      filename: string;
    };
    policies: {
      checkInTime: string;
      checkOutTime: string;
      cancellationPolicy: "24h-full-refund" | "24h-half-refund" | "no-refund";
      childrenPolicy: "yes" | "no";
      petPolicy: "yes" | "no";
      smokingPolicy: "yes" | "no";
    };
    lowestPrice: number;
    lowestDiscountedPrice: number;
    highestDiscountPercent: number;
    availableRoomCount: number;
    availableRoomTypes?: string[];
    availableAmenities?: string[];
  }>;
}

export interface GetAvailableRoomsByHotelResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  data: Room[];
  availableRoomTypes?: string[];
  availableAmenities?: string[];
}
