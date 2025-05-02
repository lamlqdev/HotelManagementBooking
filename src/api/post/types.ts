import { Post, PostInteraction } from "@/types/post";

export interface CreatePostRequest {
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
}

export interface CreatePostResponse {
  success: boolean;
  data: Post;
}

export interface GetPostsResponse {
  success: boolean;
  count: number;
  data: Post[];
}

export interface GetPostResponse {
  success: boolean;
  data: Post;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  images?: string[];
  tags?: string[];
}

export interface UpdatePostResponse {
  success: boolean;
  data: Post;
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}

export interface AddInteractionRequest {
  type: "like" | "comment" | "share";
  content?: string;
}

export interface AddInteractionResponse {
  success: boolean;
  data: PostInteraction;
}

export interface GetPostInteractionsResponse {
  success: boolean;
  count: number;
  data: PostInteraction[];
}

export interface DeleteInteractionResponse {
  success: boolean;
  message: string;
}
