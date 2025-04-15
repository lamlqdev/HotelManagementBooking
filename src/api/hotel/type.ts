export interface Hotel {
  _id: string;
  name: string;
  address: string;
  locationId: string;
  locationDescription?: string;
  rating: number;
  description: string;
  ownerId: string;
  website?: string;
  featuredImage?: {
    url: string;
    publicId: string;
    filename: string;
  };
  images?: Array<{
    url: string;
    publicId: string;
    filename: string;
  }>;
  amenities: string[]; // Array of Amenity IDs
  policies: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: '24h-full-refund' | '24h-half-refund' | 'no-refund';
    childrenPolicy: 'yes' | 'no';
    petPolicy: 'yes' | 'no';
    smokingPolicy: 'yes' | 'no';
  };
  favoriteCount: number;
  lowestPrice: number;
  lowestDiscountedPrice: number;
  highestDiscountPercent: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelDto {
  name: string;
  address: string;
  locationId: string;
  locationDescription?: string;
  description: string;
  website?: string;
  featuredImage?: File;
  images?: File[];
  amenities: string[]; // Array of Amenity IDs
  policies?: {
    checkInTime?: string;
    checkOutTime?: string;
    cancellationPolicy?: '24h-full-refund' | '24h-half-refund' | 'no-refund';
    childrenPolicy?: 'yes' | 'no';
    petPolicy?: 'yes' | 'no';
    smokingPolicy?: 'yes' | 'no';
  };
}

export interface UpdateHotelDto extends Partial<CreateHotelDto> {
  status?: 'active' | 'inactive' | 'pending';
  rating?: number;
  favoriteCount?: number;
  lowestPrice?: number;
  lowestDiscountedPrice?: number;
  highestDiscountPercent?: number;
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
  locationId?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscountPercent?: number;
  sort?: string;
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'pending';
  rating?: number;
}