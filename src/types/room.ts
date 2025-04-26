import { Amenity } from "./amenity";

export type RoomImage = {
  url: string;
  publicId: string;
  filename: string;
};

export type Room = {
  _id: string;
  hotelId: string;
  roomName: string;
  description: string;
  floor: number;
  roomType: "Standard" | "Superior" | "Deluxe" | "Suite" | "Family";
  bedType: "Single" | "Twin" | "Double" | "Queen" | "King";
  price: number;
  capacity: number;
  squareMeters: number;
  amenities: Amenity[];
  images: RoomImage[];
  cancellationPolicy: "flexible" | "moderate" | "strict";
  discountPercent: number;
  discountStartDate: string | null;
  discountEndDate: string | null;
  status: "available" | "booked" | "maintenance";
  createdAt: string;
  updatedAt: string;
};
