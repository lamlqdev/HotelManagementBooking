export interface LocationImage {
  url: string;
  publicId: string;
  filename: string;
  _id?: string;
}

export interface Location {
  _id: string;
  name: string;
  description: string;
  image?: LocationImage;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateLocationDto {
  name: string;
  description: string;
  image?: File;
}

export type UpdateLocationDto = Partial<CreateLocationDto>;

export interface LocationResponse {
  success: boolean;
  count: number;
  data: Location[];
}

export interface SingleLocationResponse {
  success: boolean;
  data: Location;
}

export interface PopularLocation {
  _id: string;
  name: string;
  image?: LocationImage;
  hotelCount: number;
}

export interface PopularLocationResponse {
  success: boolean;
  count: number;
  data: PopularLocation[];
}
