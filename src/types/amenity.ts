export interface Amenity {
  _id: string;
  name: string;
  type: "hotel" | "room";
  icon?: string;
  createdAt: string;
  updatedAt: string;
}
