import { User } from "./auth";
import { Hotel } from "./hotel";

export interface Review {
  _id: string;
  userId: User;
  hotelId: Hotel;
  rating: number;
  title: string;
  comment: string;
  isAnonymous: boolean;
  response?: string;
  createdAt: string;
  updatedAt: string;
}
