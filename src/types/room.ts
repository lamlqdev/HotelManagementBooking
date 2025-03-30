import { LucideIcon } from "lucide-react";

export type Amenity = {
  name: string;
  icon: LucideIcon;
  selected: boolean;
};

export type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  floor: number;
  images: string[];
  description: string;
  amenities: Amenity[];
  capacity: number;
  bedType: string;
  size: string;
  checkIn: string;
  checkOut: string;
  cancelPolicy: string;
  promotions: {
    id: number;
    name: string;
    discount: number;
    validUntil: string;
    code: string;
  }[];
};
