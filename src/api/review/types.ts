import { Review } from "@/types/review";

export interface CreateReviewRequest {
  hotelId: string;
  rating: number;
  title: string;
  comment: string;
  isAnonymous: boolean;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
  isAnonymous?: boolean;
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
  message?: string;
}

export interface ReviewsResponse {
  success: boolean;
  count: number;
  data: Review[];
}

export interface RespondToReviewRequest {
  response: string;
}
