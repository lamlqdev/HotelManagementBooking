export interface Hotel {
  name: string;
  address: string;
  description: string;
  mainImage: string;
  galleryImages: string[];
  amenities: string[];
  phone: string;
  email: string;
  website: string;
  representativeName: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  paymentPolicy: string;
  houseRules: string;
  childrenPolicy: string;
  petPolicy: string;
  smokingPolicy: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
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
