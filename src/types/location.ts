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