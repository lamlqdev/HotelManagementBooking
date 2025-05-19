export interface PostUser {
  _id: string;
  id: string;
  name: string;
  email: string;
}

export interface PostImage {
  url: string;
  publicId: string;
  filename: string;
  _id?: string;
}

export type PostStatus = "pending" | "approved" | "rejected";

export interface Post {
  id: string;
  _id?: string;
  userId: string | PostUser;
  title: string;
  content: string;
  images?: PostImage[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface PostInteraction {
  id: string;
  postId: string;
  userId: string;
  type: "like" | "comment" | "share";
  content?: string;
  createdAt: string;
  updatedAt: string;
}
