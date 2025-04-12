export interface HotelImage {
  url: string;
  publicId: string;
  filename: string;
  _id?: string;
}

export interface HotelPolicies {
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  childrenPolicy: string;
  petPolicy: string;
  smokingPolicy: string;
}

export interface Hotel {
  id: string;
  _id?: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  locationName: string;
  locationDescription: string;
  policies: {
    checkInTime: string;
    checkOutTime: string;
    childrenPolicy: "yes" | "no";
    petPolicy: "yes" | "no";
    smokingPolicy: "yes" | "no";
  };
  rating: number;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
  __v: number;
  featuredImage: HotelImage;
  images: HotelImage[];
  amenities: string[];
  ownerId: string;
}

export interface CreateHotelDto {
  name: string;
  description: string;
  address: string;
  locationName: string;
  locationDescription: string;
  website?: string;
  amenities: string[];
  featuredImage?: File;
  images?: File[];
  policies: HotelPolicies;
}

export interface UpdateHotelDto extends Partial<CreateHotelDto> {
  replaceAllImages?: boolean;
}

export interface HotelResponse {
  success: boolean;
  count: number;
  data: Hotel[];
}

export interface SingleHotelResponse {
  success: boolean;
  data: Hotel;
}
