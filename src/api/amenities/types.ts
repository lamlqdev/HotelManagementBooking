export interface Amenity {
  _id: string;
  name: string;
  type: "hotel" | "room";
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

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
