import { Amenity } from "./amenity";

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

export interface TabProps {
  hotel: Hotel;
  isEditing: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export interface GeneralTabProps extends TabProps {
  onAmenityToggle: (amenityId: string) => void;
  availableAmenities: Amenity[];
}
