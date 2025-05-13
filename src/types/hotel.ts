export interface Hotel {
  _id: string;
  name: string;
  address: string;
  locationId: {
    _id: string;
    name: string;
  };
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
    cancellationPolicy: "24h-full-refund" | "24h-half-refund" | "no-refund";
    childrenPolicy: "yes" | "no";
    petPolicy: "yes" | "no";
    smokingPolicy: "yes" | "no";
  };
  favoriteCount: number;
  lowestPrice: number;
  lowestDiscountedPrice: number;
  highestDiscountPercent: number;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}
