import { Amenity } from "@/types/amenity";

export interface AmenityResponse {
  success: boolean;
  data: Amenity;
  message?: string;
}

export interface AmenitiesResponse {
  success: boolean;
  count: number;
  data: Amenity[];
}
